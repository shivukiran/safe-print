

import { useState, useEffect , useCallback } from "react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import Sidebar from "./SideBar";
import FileUpload from "./FileUpload";
import FileCard from "./FileCard";
// import MenuButton from "./MenuButton";
import FetchFilesModal from "./fetchFiles";
import { Search } from "lucide-react";

interface FileManagerDashboardProps {
  userId: string | undefined;
  userName: string | undefined;
}

const FileManagerDashboard = ({ userId, userName }: FileManagerDashboardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<{ id: string; filename: string }[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFetchOpen, setFetchOpen] = useState(false);
  const [isName, setName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchFiles = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing! Please log in.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/files?ownerId=${userId}`);
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFiles();
    }
  }, [userId, fetchFiles]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (userId) {
        try {
          console.log("Fetching name for userId:", userId);
          const res = await axios.get(`/api/fetchName?ownerId=${userId}`);
          console.log("User data received:", res.data);
          setName(res.data.name);
        } catch (error) {
          console.error("Failed to fetch user name", error);
          setName("Demo User");
        }
      }
    };

    if (userId) fetchUserName();
  }, [userId]);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file!",
        variant: "destructive"
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing! Please log in.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", userId);
    
    setLoadingUpload(true);
    try {

      await axios.post("/api/upload", formData);
      
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
      

      fetchFiles();
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: "Upload failed!",
        variant: "destructive"
      });
    } finally {
      setLoadingUpload(false);
    }
  };



  const deleteFile = async (fileId: string) => {
    try {

      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "File deleted successfully!",
        });
        // Update the file list after deletion
        fetchFiles();
      } else {
        toast({
          title: "Error", 
          description: data.error || "Failed to delete file!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast({
        title: "Error", 
        description: "Failed to delete file!",
        variant: "destructive"
      });
    }
  };

  const deleteAllFiles = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing! Please log in.",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingDelete(true);
    try {
      // Make actual API call to delete all files
      const res = await fetch("/api/deleteAllFiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "All files deleted successfully!",
        });
        
        // Refresh the file list after deletion
        fetchFiles();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete files!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to delete files:", error);
      toast({
        title: "Error",
        description: "Failed to delete files!",
        variant: "destructive"
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const viewFile = async (fileId: string) => {
    console.log("📂 Fetching file for viewing:", fileId);

    if (!fileId) {
      toast({
        title: "Error",
        description: "File ID is missing!",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await axios.get(`/api/decrypt/${fileId}`, {
        responseType: "blob",
      });

      if (res.status !== 200) {
        throw new Error(`Unexpected response: ${res.status}`);
      }

      console.log("✅ File Decrypted, preparing to display...");
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error: any) {
      console.error("❌ Failed to open file:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: `Failed to open the file: ${error.response?.data?.error || error.message}`,
        variant: "destructive"
      });
    }
  };

  const printFile = async (fileId: string) => {
    try {
      console.log(`🖨️ Printing file with ID: ${fileId}`);

      const res = await axios.get(`/api/decrypt/${fileId}`, {
        responseType: "blob",
      });

      console.log("✅ File download successful, preparing to print...");

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          console.log("🖨️ Triggering print...");
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("❌ Failed to print file:", error);
      toast({
        title: "Error",
        description: "Printing failed!",
        variant: "destructive"
      });
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
<div className="flex h-screen bg-gray-200 overflow-hidden">
  {/* Sidebar */}
  <div
    className={`
      ${sidebarCollapsed ? "w-0 md:w-0" : "w-50"}
      transition-all duration-300 ease-in-out
      bg-white border-r border-gray-200
      fixed md:relative z-20 h-full
    `}
  >
    <Sidebar
      userName={isName || userName}
      userId={userId}
      isCollapsed={sidebarCollapsed}
      toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      onFetchFilesOpen={() => setFetchOpen(true)}
      onDeleteAllFiles={deleteAllFiles}
      loadingDelete={loadingDelete}
    />
  </div>

  {/* Main Content */}
  <div
    className={`
      flex-1 flex flex-col transition-all duration-300 ease-in-out
      ${sidebarCollapsed ? "md:ml-40" : "md:ml-10"} ml-0
    `}
  >
    {/* Mobile Header */}
    {/* <header className="bg-white border-b border-gray-200 p-4 flex md:hidden items-center justify-between shadow-sm z-10">} */}
      {/* <div className="flex items-center">
        <MenuButton
          isOpen={!sidebarCollapsed}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <h1 className="ml-4 text-xl font-semibold">File Space</h1>
      </div> */}
    {/* </header> */}
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <FileUpload 
              onFileSelect={handleFileChange}
              onUpload={handleUpload}
              isUploading={loadingUpload}
            />
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
              {loading ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your files...</p>
                </div>
              ) : filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onView={viewFile}
                      onDelete={deleteFile}
                      onPrint={printFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? "No files match your search" : "Upload your first file to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Fetch Files Modal */}
      {isFetchOpen && <FetchFilesModal onClose={() => setFetchOpen(false)} />}
    </div>
  );
};

export default FileManagerDashboard;