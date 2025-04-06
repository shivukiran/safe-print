


// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export function FetchFiles({ onClose }: { onClose: () => void }) {
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [userId, setUserId] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [files, setFiles] = useState<{ id: string; filename: string }[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [timeLeft, setTimeLeft] = useState(20); // 5 minutes in seconds


//     const formatTime = (seconds: number) => {
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//     };

//     const handleSendOTP = async () => {
//         if (!email) {
//             setMessage("Please enter your email.");
//             return;
//         }
//         setLoading(true);
    
//         try {
//             const response = await axios.post("/api/send-otp", { email });
    
//             if (response.data.success) {
//                 setOtpSent(true);
//                 alert("OTP sent to your email!");
//                 if (response.data.userId) {
//                     setUserId(response.data.userId);
//                 }
//             } else if (response.data.error) {
//                 // Handle specific error messages from the backend
//                 alert(response.data.error); // This will show the error message returned by the backend
//             } else {
//                 // If no success or error message is returned
//                 alert("Unexpected response from the server.");
//             }
//         } catch (error) {
//             // console.error(error);
//             if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
//                 alert(error.response.data.error); // Display error from backend
//             } else {
//                 alert("Failed to send OTP");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     useEffect(() => {
//         let timer: NodeJS.Timeout;
//         if (otpVerified && userId) {
//             fetchFiles(userId)
//             timer = setInterval(() => {
//                 setTimeLeft((prev) => {
//                     if (prev <= 1) {
//                         clearInterval(timer);
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [otpVerified]);

//     useEffect(() => {
//         if (timeLeft === 0) {
//             onClose(); // Close only when timer reaches 0
//         }
//     }, [timeLeft, onClose]);
//     const handleVerifyOTP = async () => {
//         if (!otp) {
//             setMessage("Please enter the OTP.");
//             return;
//         }
//         setLoading(true);
//         try {
//             const response = await axios.post("/api/verify-otp", { email, otp });
//             if (response.data.success) {
//                 setOtpVerified(true);
//                 alert("OTP verified successfully!");
//             } else {
//                 setMessage("Invalid OTP. Please try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             setMessage("Failed to verify OTP.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchFiles = async (ownerId: any) => {
//         if (!ownerId) {
//             setMessage("User ID not found. Please try again.");
//             return;
//         }
//         setLoading(true);
//         try {
//             const res = await axios.get(`/api/files?ownerId=${ownerId}`);
//             setFiles(res.data);
//         } catch (error) {
//             console.error("Failed to fetch files", error);
//             setMessage("Error fetching files.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const printFile = async (fileId: string) => {
//         try {
//             const res = await axios.get(`/api/decrypt/${fileId}`, { responseType: "blob" });
//             const blob = new Blob([res.data], { type: res.headers["content-type"] });
//             const url = URL.createObjectURL(blob);
//             const printWindow = window.open(url, "_blank");

//             if (printWindow) {
//                 printWindow.onload = () => printWindow.print();
//             }
//         } catch (error) {
//             console.error("Failed to print file:", error);
//             alert("Printing failed!");
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">

//                 <h2 className="text-2xl font-bold mb-4">Fetch Files</h2>

//                 {/* Display Countdown Timer */}
//                 {otpVerified && (
//                     <p className="text-center text-red-500 text-xl font-semibold mb-2">
//                         {timeLeft > 0 ? `Time Left: ${formatTime(timeLeft)}` : "You can close now."}
//                     </p>
//                 )}

//                 {message && <p className="text-red-500 mb-2">{message}</p>}

//                 {!otpSent && (
//                     <>
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full p-2 border rounded mb-2"
//                         />
//                         <button
//                             onClick={handleSendOTP}
//                             disabled={loading}
//                             className="w-full bg-blue-500 text-white p-2 rounded mb-2 disabled:bg-gray-400"
//                         >
//                             {loading ? "Sending OTP..." : "Send OTP"}
//                         </button>
//                     </>
//                 )}

//                 {otpSent && !otpVerified && (
//                     <>
//                         <p className="text-sm text-gray-600 text-center mb-4">
//                             Enter the OTP sent to your email
//                         </p>
//                         <input
//                             type="text"
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             className="w-full p-2 border rounded mb-2"
//                         />
//                         <button
//                             onClick={handleVerifyOTP}
//                             disabled={loading}
//                             className="w-full bg-green-500 text-white p-2 rounded mb-2 disabled:bg-gray-400"
//                         >
//                             {loading ? "Verifying OTP..." : "Verify OTP"}
//                         </button>
//                     </>
//                 )}

//                 {otpVerified && (
//                     <div className="mt-4 w-full max-h-64 overflow-y-auto rtl">
//                         <ul className="space-y-3">
//                             {files.map((file) => (
//                                 <li key={file.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow">
//                                     <p className="text-gray-700 font-medium truncate w-2/3">{file.filename}</p>
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={() => printFile(file.id)}
//                                             className="bg-blue-500 text-white px-3 py-1 rounded hover:scale-105 hover:shadow-lg transition"
//                                         >
//                                             Print
//                                         </button>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 {/* Close Button (Always Clickable, but Shows Timer if Active) */}
//                 <button
//                     onClick={onClose}
//                     className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
//                 >
//                     {timeLeft > 0 ? `Close (Time Left: ${formatTime(timeLeft)})` : "Close"}
//                 </button>
//             </div>
//         </div>
//     );
// }



import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./InputOtp";

interface FetchFilesModalProps {
  onClose: () => void;
}

const FetchFilesModal = ({ onClose }: FetchFilesModalProps) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [files, setFiles] = useState<{ id: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 60000);
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [handleClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpVerified && userId) {
      fetchFiles(userId);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpVerified, userId, handleClose]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/send-otp", { email });

      if (response.data.success) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Check your email for the verification code.",
        });

        if (response.data.userId) {
          setUserId(response.data.userId);
        }
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Unexpected response from server.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter the complete OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/verify-otp", { email, otp });

      if (response.data.success) {
        setOtpVerified(true);
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (ownerId: string) => {
    if (!ownerId) {
      toast({
        title: "Error",
        description: "User ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/files?ownerId=${ownerId}`);
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const printFile = async (fileId: string) => {
    try {
      const res = await axios.get(`/api/decrypt/${fileId}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("Failed to print file:", error);
      toast({
        title: "Error",
        description: "Printing failed!",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transition-transform duration-300 transform"
        style={{ transform: isVisible ? "scale(1)" : "scale(0.9)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Fetch Others&apos; Files</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {otpVerified && (
            <div className="mb-4 text-center">
              <p className="text-amber-600 font-medium">
                Session expires in:{" "}
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </p>
            </div>
          )}

          {!otpSent && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Enter your email address to receive a verification code to access shared files.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button onClick={handleSendOTP} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {otpSent && !otpVerified && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center">
                Enter the verification code sent to <span className="font-medium">{email}</span>
              </p>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}

          {otpVerified && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Files</h3>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-gray-500">Loading files...</p>
                </div>
              ) : files.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <p className="text-gray-700 font-medium truncate w-2/3">{file.filename}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => printFile(file.id)}
                        className="flex items-center"
                      >
                        Print
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No files available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <Button
            onClick={handleClose}
            variant={otpVerified ? "default" : "outline"}
            className={otpVerified ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-black"}
          >
            {otpVerified ? "Close" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FetchFilesModal;
