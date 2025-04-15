import { FileType } from "../app/utils/types";
import { Eye, Trash2, Printer } from "lucide-react";

interface FileCardProps {
  file: FileType;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onPrint: (id: string) => void;
  isViewing: boolean;
  isDeleting: boolean;
  isPrinting: boolean;
}

const FileCard = ({ file, onView, onDelete, onPrint, isViewing, isPrinting , isDeleting}: FileCardProps) => {
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return "📕";
      case 'doc':
      case 'docx': return "📘";
      case 'xls': 
      case 'xlsx': return "📗";
      case 'ppt':
      case 'pptx': return "📙";
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return "🖼️";
      case 'mp3':
      case 'wav': return "🎵";
      case 'mp4':
      case 'avi':
      case 'mov': return "🎬";
      case 'zip':
      case 'rar': return "🗜️";
      default: return "📄";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{getFileIcon(file.filename)}</div>
        <div className="flex-1 truncate" title={file.filename}>
          {file.filename}
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => file.id && onView(file.id)}
          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
          aria-label="View file"
          title="View file"
        >  {isViewing ? (
            <span className="animate-spin border-2 border-t-transparent border-blue-600 rounded-full w-5 h-5 inline-block"></span>
        ) : (
          <Eye size={18} />
        )}
      
        </button>
        <button
          onClick={() => file.id && onPrint(file.id)}
          className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
          aria-label="Print file"
          title="Print file"
        >
          {isPrinting ? (
            <span className="animate-spin border-2 border-t-transparent border-blue-600 rounded-full w-5 h-5 inline-block"></span>
        ) : (
          <Printer size={18} />
        )}
      
        </button>
        <button
          onClick={() => file.id && onDelete(file.id)}
          className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          aria-label="Delete file"
          title="Delete file"
        >
           {isDeleting ? (
            <span className="animate-spin border-2 border-t-transparent border-blue-600 rounded-full w-5 h-5 inline-block"></span>
        ) : (
          <Trash2 size={18} />

        )}
        </button>
      </div>
    </div>
  );
};

export default FileCard;
