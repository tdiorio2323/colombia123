import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import logger from "@server/lib/logger";

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), "uploads");
const BASE_URL = process.env.SERVER_URL || "http://localhost:3000";

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Initialize storage
ensureStorageDir();

export interface UploadResult {
  path: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export class FileStorage {
  static async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimetype: string,
    folder?: string
  ): Promise<UploadResult> {
    await ensureStorageDir();

    // Generate unique filename
    const ext = path.extname(originalFilename);
    const filename = `${randomUUID()}${ext}`;

    // Create folder path if specified
    const folderPath = folder ? path.join(STORAGE_DIR, folder) : STORAGE_DIR;
    await fs.mkdir(folderPath, { recursive: true });

    // Full file path
    const filePath = path.join(folderPath, filename);

    // Write file
    await fs.writeFile(filePath, fileBuffer);

    // Generate public URL
    const publicPath = folder ? `${folder}/${filename}` : filename;
    const url = `${BASE_URL}/uploads/${publicPath}`;

    return {
      path: filePath,
      url,
      filename,
      size: fileBuffer.length,
      mimetype,
    };
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error("Failed to delete file:", error);
    }
  }

  static async getFile(filePath: string): Promise<Buffer> {
    return fs.readFile(filePath);
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Utility method to get file extension from mimetype
  static getExtensionFromMimetype(mimetype: string): string {
    const mimeMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/ogg": ".ogv",
      "audio/mp3": ".mp3",
      "audio/mpeg": ".mp3",
      "audio/wav": ".wav",
      "audio/ogg": ".ogg",
    };

    return mimeMap[mimetype] || "";
  }

  // Validate file type
  static isValidMediaType(mimetype: string): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
    ];

    return allowedTypes.includes(mimetype);
  }

  // Get media type from mimetype
  static getMediaTypeFromMimetype(mimetype: string): "IMAGE" | "VIDEO" | "AUDIO" | null {
    if (mimetype.startsWith("image/")) return "IMAGE";
    if (mimetype.startsWith("video/")) return "VIDEO";
    if (mimetype.startsWith("audio/")) return "AUDIO";
    return null;
  }
}