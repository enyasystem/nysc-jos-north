import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview?: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

interface DragDropUploadProps {
  onFilesUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function DragDropUpload({
  onFilesUpload,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "video/mp4": [".mp4"],
    "video/quicktime": [".mov"]
  },
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className
}: DragDropUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      status: "uploading" as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uploadFile, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.file === uploadFile.file 
            ? { ...f, progress: Math.min(f.progress + 10, 100) }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(f => 
          f.file === uploadFile.file 
            ? { ...f, status: "success", progress: 100 }
            : f
        ));
      }, 2000);
    });

    onFilesUpload(acceptedFiles);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.file !== fileToRemove);
      // Revoke object URL to prevent memory leaks
      const removedFile = prev.find(f => f.file === fileToRemove);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)} data-testid="drag-drop-upload">
      <Card 
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-all duration-300 cursor-pointer hover:bg-muted/30",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          "relative overflow-hidden"
        )}
      >
        <input {...getInputProps()} data-testid="file-input" />
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragActive && !isDragReject && "bg-primary/10",
              isDragReject && "bg-destructive/10",
              !isDragActive && "bg-muted"
            )}>
              <Upload className={cn(
                "w-8 h-8",
                isDragActive && !isDragReject && "text-primary",
                isDragReject && "text-destructive",
                !isDragActive && "text-muted-foreground"
              )} />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {isDragActive && !isDragReject && "Drop files here"}
                {isDragReject && "Invalid file type"}
                {!isDragActive && "Drag & drop files here"}
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Supported formats: PDF, DOC, DOCX, JPG, PNG, MP4, MOV</p>
                <p>Max file size: {formatFileSize(maxSize)}</p>
                <p>Max files: {maxFiles}</p>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="bg-background hover:bg-muted"
              data-testid="browse-files-button"
            >
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card data-testid="uploaded-files-list">
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h4>
            <div className="space-y-3">
              {uploadedFiles.map((uploadFile, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/20"
                  data-testid={`uploaded-file-${index}`}
                >
                  {uploadFile.preview ? (
                    <img 
                      src={uploadFile.preview} 
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <File className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(uploadFile.file.size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {uploadFile.file.type.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>
                    </div>
                    
                    {uploadFile.status === "uploading" && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="flex-1 bg-muted rounded-full h-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <span>{uploadFile.progress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadFile.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {uploadFile.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.file)}
                      className="p-1"
                      data-testid={`remove-file-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}