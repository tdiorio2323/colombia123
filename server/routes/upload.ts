import { Router } from "express";
import { Request, Response } from "express";
import multer from "multer";
import { z } from "zod";
import { FileStorage } from "../lib/storage";
import { prisma, handlePrismaError } from "../lib/prisma";
import { authenticateToken, AuthenticatedRequest, requireCreator } from "../lib/auth";

const upload = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (FileStorage.isValidMediaType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images, videos, and audio files are allowed."));
    }
  },
});

// Validation schema
const uploadMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isPremium: z.string().transform((val) => val === "true"),
  price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

// Upload media file
upload.post(
  "/",
  authenticateToken,
  requireCreator,
  uploadMiddleware.single("file"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Validate metadata
      const metadata = uploadMetadataSchema.parse(req.body);

      // Validate price for premium content
      if (metadata.isPremium && (!metadata.price || metadata.price <= 0)) {
        return res.status(400).json({ error: "Price is required for premium content" });
      }

      // Get creator profile
      const creatorProfile = req.user?.profile;
      if (!creatorProfile) {
        return res.status(400).json({ error: "Creator profile not found" });
      }

      // Upload file to storage
      const uploadResult = await FileStorage.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        `media/${creatorProfile.id}`
      );

      // Get media type
      const mediaType = FileStorage.getMediaTypeFromMimetype(file.mimetype);
      if (!mediaType) {
        // Clean up uploaded file
        await FileStorage.deleteFile(uploadResult.path);
        return res.status(400).json({ error: "Unsupported media type" });
      }

      // Create media record in database
      const mediaRecord = await prisma.media.create({
        data: {
          creatorId: creatorProfile.id,
          title: metadata.title,
          description: metadata.description,
          mediaUrl: uploadResult.url,
          mediaType,
          isPremium: metadata.isPremium,
          price: metadata.price ? Math.round(metadata.price * 100) : null, // Convert to cents
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update creator's media count
      await prisma.profile.update({
        where: { id: creatorProfile.id },
        data: {
          mediaCount: {
            increment: 1,
          },
        },
      });

      res.status(201).json({
        data: {
          ...mediaRecord,
          price: mediaRecord.price ? mediaRecord.price / 100 : null, // Convert back to dollars
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      if (error.message.includes("Invalid file type")) {
        return res.status(400).json({ error: error.message });
      }
      const dbError = handlePrismaError(error);
      res.status(500).json(dbError);
    }
  }
);

// Upload avatar/profile image
upload.post(
  "/avatar",
  authenticateToken,
  uploadMiddleware.single("avatar"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Only allow images for avatars
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed for avatars" });
      }

      const profile = req.user?.profile;
      if (!profile) {
        return res.status(400).json({ error: "User profile not found" });
      }

      // Delete old avatar if exists
      if (profile.avatarUrl) {
        // Extract path from URL and delete
        const oldPath = profile.avatarUrl.replace(`${process.env.SERVER_URL}/uploads/`, "");
        const oldFilePath = `uploads/${oldPath}`;
        await FileStorage.deleteFile(oldFilePath);
      }

      // Upload new avatar
      const uploadResult = await FileStorage.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        `avatars/${profile.id}`
      );

      // Update profile with new avatar URL
      const updatedProfile = await prisma.profile.update({
        where: { id: profile.id },
        data: { avatarUrl: uploadResult.url },
      });

      res.json({
        data: {
          avatarUrl: updatedProfile.avatarUrl,
        },
      });
    } catch (error: any) {
      if (error.message.includes("Invalid file type")) {
        return res.status(400).json({ error: error.message });
      }
      const dbError = handlePrismaError(error);
      res.status(500).json(dbError);
    }
  }
);

export { upload };