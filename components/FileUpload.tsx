import { useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "../app/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  isUploading: boolean;
}

const FileUpload = ({ onFileSelect, onUpload, isUploading }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setSelectedFile(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
      setSelectedFile(file.name);
    }
    setIsDragging(false);
  };

  return (
    <div className="mb-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
          disabled={isUploading}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload size={40} className="text-blue-500 mb-2" />
            <p className="text-sm font-medium">
              {selectedFile || "Drag & drop a file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Supports all file types</p>
          </div>
        </label>
      </div>
    <button
      onClick={onUpload}
      disabled={!selectedFile || isUploading}
      className={cn(
        "w-full mt-4 py-2 px-4 rounded-lg text-white font-medium",
        selectedFile && !isUploading 
        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        : "bg-gray-400 cursor-not-allowed"
      )}
    >
      {isUploading ? "Uploading..." : "Upload File"}
    </button>
    </div>
  );
};

export default FileUpload;
