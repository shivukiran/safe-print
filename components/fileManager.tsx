

import React, { useState, useEffect , useCallback } from "react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import Sidebar from "./SideBar";
import FileUpload from "./FileUpload";
import FileCard from "./FileCard";
import MenuButton from "./MenuButton";
import FetchFilesModal from "./fetchFiles";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Bodoni_Moda_SC, Limelight
} from 'next/font/google';

const barriecito = Bodoni_Moda_SC
({
  weight: '400',
  subsets: ['latin'],
});

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
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);
const [printingFileId, setPrintingFileId] = useState<string | null>(null);
const [deletingFileId, setDeletingFileId] = useState<string | null>(null);



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

      toast({
        title: "Encrypting...", 
        description: "Uploading your file !",
      });
      
      await axios.post("/api/upload", formData);
      
      toast({
        title: "Success ",
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

    setDeletingFileId(fileId);
    try {
      toast({
        title: "Deleting...",
        description: "File is being deleted!",
      });
      
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
    finally {
      setDeletingFileId(null);
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
    setViewingFileId(fileId);

    try {

      toast({
        title: "Decrypting...", 
        description: "Viewing your file !",
      });
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
    finally {
      setViewingFileId(null);
    }
  };

  const printFile = async (fileId: string) => {
    setPrintingFileId(fileId);
    try {
      console.log(`🖨️ Printing file with ID: ${fileId}`);
      toast({
        title: "Decrypting...", 
        description: "Printing your file !",
      });
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
    finally { 
      setPrintingFileId(null);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#E0EAFF] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${sidebarCollapsed ? "w-0 md:w-0" : "w-40 md:w-60"}
          transition-all duration-500 ease-in-out
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
          flex-1 flex flex-col transition-all duration-500 ease-in-out
          ${sidebarCollapsed ? "md:ml-40" : "md:ml-10"} ml-0
        `}
      >
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pt-20">
          <div className="max-w-5xl mx-auto border border-gray-300 px-20 py-20  bg-white  rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h1 className={`text-2xl font-bold text-gray-800 ${barriecito.className} text-center`}>My Files</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  className={`pl-10 pr-4 py-2 border bg-[#E0EAFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  ${barriecito.className}`}
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
              <h2 className={`text-xl font-semibold mb-4 ${barriecito.className}`}>Uploaded Files</h2>
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
                      isViewing={viewingFileId === file.id}
                      isPrinting={printingFileId === file.id}
                      isDeleting={deletingFileId === file.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className={`text-lg font-medium mb-2 ${barriecito.className}`}>No files found</h3>
                  <p className={`text-gray-500 ${barriecito.className}`} >
                    {searchQuery
                      ? "No files match your search"
                      : "Upload your first file to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
  
        {/* Fetch Files Modal */}
        {isFetchOpen && <FetchFilesModal onClose={() => setFetchOpen(false)} />}
      </div>
    </div>
  );
}

export default FileManagerDashboard;