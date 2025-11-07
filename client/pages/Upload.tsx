import { useState, useRef } from "react";
import { GlassCard, LuxuryButton, LuxuryInput, LuxuryTextarea } from "@/components/ui/luxury";
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
  Sparkles,
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-luxury-black"></div>
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 bg-luxury-noise"></div>

        <GlassCard className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-luxury-gold" />
          </div>
          <h2 className="text-2xl font-extralight text-white mb-3 tracking-tight">
            Access <span className="text-luxury-gold">Denied</span>
          </h2>
          <p className="text-white/60 font-light">
            Only creators can upload media content. Please switch to a creator account.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center animate-luxury-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  Creator Dashboard
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extralight text-white mb-4 tracking-tight">
            Upload <span className="text-luxury-gold">Content</span>
          </h1>
          <p className="text-white/60 text-lg font-light">
            Share your exclusive content with your fans
          </p>
        </div>

        {/* Upload Form */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30">
                <UploadIcon className="w-5 h-5 text-luxury-gold" />
              </div>
              <h2 className="text-xl font-light text-white tracking-tight">Select Media</h2>
            </div>

            <div
              className="border-2 border-dashed border-luxury-gold/30 rounded-2xl p-12 text-center hover:border-luxury-gold/50 hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="w-8 h-8 text-luxury-gold" />
              </div>
              <p className="text-white/80 font-light mb-2">Click to select files</p>
              <p className="text-white/50 text-sm">
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
                <h3 className="text-xs uppercase tracking-wider text-luxury-gold font-semibold">
                  Selected Files ({uploads.length})
                </h3>
                {uploads.map((upload, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-luxury-gold flex-shrink-0">
                        {getMediaIcon(upload.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-light truncate">
                          {upload.file.name}
                        </p>
                        <p className="text-white/50 text-xs">
                          {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUpload(index)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0 ml-3"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Content Details */}
          <GlassCard premium className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30">
                <Sparkles className="w-5 h-5 text-luxury-gold" />
              </div>
              <h2 className="text-xl font-light text-white tracking-tight">Content Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Upload successful!</span>
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                  Title *
                </label>
                <LuxuryInput
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter a title for your content"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                  Description
                </label>
                <LuxuryTextarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your content..."
                  rows={3}
                />
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-light text-white block mb-1">
                      Premium Content
                    </label>
                    <p className="text-white/50 text-xs">
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
              </div>

              {formData.isPremium && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price (USD)
                  </label>
                  <LuxuryInput
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
                    required
                  />
                </div>
              )}

              <LuxuryButton
                type="submit"
                variant="gold"
                size="lg"
                disabled={isUploading || uploads.length === 0}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-5 w-5 mr-2" />
                    Upload Content
                  </>
                )}
              </LuxuryButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
