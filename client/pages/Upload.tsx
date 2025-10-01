import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { mediaApi } from "@/lib/prisma";
import {
  Upload as UploadIcon,
  Image,
  Video,
  Music,
  X,
  Crown,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUpload {
  file: File;
  preview: string;
  type: "image" | "video" | "audio";
}

export default function UploadPage() {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<MediaUpload[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPremium: false,
    price: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
            ? "audio"
            : null;

      if (!fileType) {
        setError("Please select valid image, video, or audio files");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setError("File size must be less than 100MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newUpload: MediaUpload = {
          file,
          preview: e.target?.result as string,
          type: fileType,
        };
        setUploads((prev) => [...prev, newUpload]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToStorage = async (file: File, formData: any) => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("title", formData.title);
    if (formData.description) uploadFormData.append("description", formData.description);
    uploadFormData.append("isPremium", formData.isPremium.toString());
    if (formData.isPremium && formData.price) uploadFormData.append("price", formData.price);

    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploads.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (formData.isPremium && !formData.price) {
      setError("Please set a price for premium content");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload each file
      const uploadPromises = uploads.map(async (upload) => {
        return uploadToStorage(upload.file, formData);
      });

      await Promise.all(uploadPromises);

      setUploadStatus("success");
      setUploads([]);
      setFormData({ title: "", description: "", isPremium: false, price: "" });

      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-8 h-8" />;
      case "video":
        return <Video className="w-8 h-8" />;
      case "audio":
        return <Music className="w-8 h-8" />;
      default:
        return <UploadIcon className="w-8 h-8" />;
    }
  };

  if (profile?.role !== "CREATOR") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              Only creators can upload media content.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-luxury-display font-bold text-gradient-luxury mb-2">
            Upload Content
          </h1>
          <p className="text-white/80">Share your content with your fans</p>
          <Badge className="glass-card bg-gold/20 text-gold border-gold/30 mt-2">
            <Crown className="w-3 h-3 mr-1" />
            Creator Dashboard
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <Card className="auth-card-luxury border-0">
            <CardHeader>
              <h2 className="text-xl font-luxury-display font-bold text-gold">
                Select Media
              </h2>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gold/30 rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="w-12 h-12 text-gold/60 mx-auto mb-4" />
                <p className="text-white/80 mb-2">Click to select files</p>
                <p className="text-white/60 text-sm">
                  Images, videos, or audio files up to 100MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Preview uploaded files */}
              {uploads.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-gold">
                    Selected Files
                  </h3>
                  {uploads.map((upload, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="text-gold mr-3">
                          {getMediaIcon(upload.type)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {upload.file.name}
                          </p>
                          <p className="text-white/60 text-xs">
                            {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card className="auth-card-luxury border-0">
            <CardHeader>
              <h2 className="text-xl font-luxury-display font-bold text-gold">
                Content Details
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload successful!
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gold block mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter a title for your content"
                    className="auth-input-luxury text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gold block mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your content..."
                    rows={3}
                    className="auth-input-luxury text-white placeholder:text-white/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gold block">
                      Premium Content
                    </label>
                    <p className="text-white/60 text-xs">
                      Require subscription or payment to view
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPremium}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isPremium: checked }))
                    }
                  />
                </div>

                {formData.isPremium && (
                  <div>
                    <label className="text-sm font-medium text-gold block mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Price (USD)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="auth-input-luxury text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || uploads.length === 0}
                  className="w-full btn-luxury py-3 text-base"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload Content
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
