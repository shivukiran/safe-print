

// import { useState } from "react";

// import axios from "axios";
// import { toast } from "@/components/ui/use-toast";



// export function ForgotPass({ onClose }: { onClose: () => void }) {
//     console.log("In the forgotpass");

//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

//     // Step 1: Send OTP
//     const handleSendOTP = async () => {
//         console.log("In handleSendOTP");
//         if (!email) {
//             setMessage("Please enter your email.");
//             return;
//         }
    
//         setLoading(true);
//         try {
//             const response = await axios.post("/api/send-otp", { email });
    
//             if (response.status === 200) {
//                 toast({
//                     title: "OTP Sent Successfully",
//                     description: "Please check your email for the OTP.",
//                 });
//                 setOtpSent(true);
//             }
//         } catch (error: any) {
//             if (error.response?.status === 404) {
//                 toast({
//                     title: "No User Found",
//                     description: "The entered email is not registered with us.",
//                     variant: "destructive",
//                 });
//             } else {
//                 toast({
//                     title: "Failed to Send OTP",
//                     description: "An error occurred. Please check your email and try again.",
//                     variant: "destructive",
//                 });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     // Step 2: Verify OTP
//     const handleVerifyOTP = async () => {
//         console.log("In handleVerifyOTP");
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
//                 alert("Invalid OTP. Please try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Failed to verify OTP");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Step 3: Reset Password
//     const handleResetPassword = async () => {
//         console.log("In handleResetPassword");
//         if (!newPassword) {
//             setMessage("Please enter a new password.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await axios.post("/api/reset-password", { email, newPassword });

//             if (response.data.success) {
//                 alert("Password reset successfully!");
//                 onClose();
//             } else {
//                 alert("Failed to reset password. Try again.");
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Error resetting password");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-bold mb-4 text-center">Forgot Password?</h2>

//                 {/* Step 1: Enter Email */}
//                 {!otpSent && (
//                     <>
//                         <p className="text-sm text-gray-600 text-center mb-4">Enter your email to receive an OTP</p>
//                         <input
//                             type="email"
//                             placeholder="example@gmail.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full border p-2 rounded"
//                         />
//                         <button
//                             onClick={handleSendOTP}
//                             className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
//                             disabled={loading}
//                         >
//                             {loading ? "Sending..." : "Send OTP"}
//                         </button>
//                     </>
//                 )}

//                 {/* Step 2: Enter OTP */}
//                 {otpSent && !otpVerified && (
//                     <>
//                         <p className="text-sm text-gray-600 text-center mb-4">Enter the OTP sent to your email</p>
//                         <input
//                             type="text"
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             className="w-full border p-2 rounded"
//                         />
//                         <button
//                             onClick={handleVerifyOTP}
//                             className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
//                             disabled={loading}
//                         >
//                             {loading ? "Verifying..." : "Verify OTP"}
//                         </button>
//                     </>
//                 )}

//                 {/* Step 3: Reset Password */}
//                 {otpVerified && (
//                     <>
//                         <p className="text-sm text-gray-600 text-center mb-4">Enter a new password</p>
//                         <input
//                             type="password"
//                             placeholder="New Password"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             className="w-full border p-2 rounded"
//                         />
//                         <button
//                             onClick={handleResetPassword}
//                             className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
//                             disabled={loading}
//                         >
//                             {loading ? "Resetting..." : "Reset Password"}
//                         </button>
//                     </>
//                 )}

//                 {message && <p className="mt-2 text-sm text-center text-gray-700">{message}</p>}

//                 <button onClick={onClose} className="mt-4 w-full text-center text-gray-600 underline">
//                     Close
//                 </button>
//                     </div>
//         </div>
//     );
// }

import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

export function ForgotPass({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters");

  // Step 1: Send OTP
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
      if (response.status === 200) {
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

  // Step 2: Verify OTP
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

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      passwordSchema.parse(newPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors({ password: e.errors[0].message });
        toast({
          title: "Invalid Password",
          description: e.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await axios.post("/api/reset-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        toast({
          title: "Password Reset",
          description: "Your password has been updated successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Reset Failed",
          description: "Unable to reset password. Try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while resetting the password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800">Forgot Password?</h2>
  
        {/* Step 1: Email Input */}
        {!otpSent && (
          <>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter your email to receive an OTP
            </p>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
            <button
              onClick={handleSendOTP}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}
  
        {/* Step 2: OTP Input */}
        {otpSent && !otpVerified && (
          <>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the OTP sent to your email
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              onClick={handleVerifyOTP}
              className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
  
        {/* Step 3: New Password */}
        {otpVerified && (
          <>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter a new password
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-purple-300"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
            <button
              onClick={handleResetPassword}
              className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
  
        <button
          onClick={onClose}
          className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 underline transition duration-150"
        >
          Close
        </button>
      </div>
    </div>
  );
}  