import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./InputOtp";
import { z } from "zod";

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
  const [timeLeft, setTimeLeft] = useState(300);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [printingFileId, setPrintingFileId] = useState<string | null>(null);


  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
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

  const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  const handleSendOTP = async () => {
    setErrors({});
    try {
      emailSchema.parse({ email });
    } catch (error) {
      const err = error as z.ZodError;
      setErrors({ email: err.errors[0].message });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/send-otp", { email });
      if (response.status === 200 && response.data.userId) {
        setUserId(response.data.userId);
        toast({
          title: "OTP Sent Successfully",
          description: "Please check your email for the OTP.",
        });
        setOtpSent(true);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast({
          title: "No User Found",
          description: "The entered email is not registered with us.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
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
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        });
        setOtpVerified(true);
      } 
    } catch (error :any) {
        if(error.response?.status === 404) {
            toast({
                title: "Invalid OTP",
                description: "Please try again.",
                variant: "destructive",
              });
        }
else{
      toast({
        title: "Verification Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (ownerId: string) => {
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
    setPrintingFileId(fileId);
    try {
      console.log(`🖨️ Printing file with ID: ${fileId}`);
      toast({
        title: "Printing...", 
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
          <h2 className="text-lg font-semibold">Fetch Others' Files</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {otpVerified && (
            <div className="mb-4 text-center">
              <p className="text-amber-600 font-medium">
                Session expires in: <span className="font-bold">{formatTime(timeLeft)}</span>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                    {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="w-full">
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
                        disabled={printingFileId === file.id}
                        className="flex items-center gap-2"
                      >
                        {printingFileId === file.id ? (
                          <>
                            <Loader2 className="animate-spin border-2 border-t-transparent border-blue-600 rounded-full w-5 h-5 inline-block" />
                          </>
                        ) : (
                          "Print"
                        )}
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
