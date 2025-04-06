

import { useState } from "react";
import axios from "axios";


export function ForgotPass({ onClose }: { onClose: () => void }) {
    console.log("In the forgotpass");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    // Step 1: Send OTP
    const handleSendOTP = async () => {
        console.log("In handleSendOTP");
        if (!email) {
            setMessage("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/send-otp", { email });

            if (response.data.success) {
                setOtpSent(true);
                alert("OTP sent to your email!");
            } else {
                alert("No user found with this email.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async () => {
        console.log("In handleVerifyOTP");
        if (!otp) {
            setMessage("Please enter the OTP.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/verify-otp", { email, otp });

            if (response.data.success) {
                setOtpVerified(true);
                alert("OTP verified successfully!");
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async () => {
        console.log("In handleResetPassword");
        if (!newPassword) {
            setMessage("Please enter a new password.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/reset-password", { email, newPassword });

            if (response.data.success) {
                alert("Password reset successfully!");
                onClose();
            } else {
                alert("Failed to reset password. Try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error resetting password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Forgot Password?</h2>

                {/* Step 1: Enter Email */}
                {!otpSent && (
                    <>
                        <p className="text-sm text-gray-600 text-center mb-4">Enter your email to receive an OTP</p>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <button
                            onClick={handleSendOTP}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* Step 2: Enter OTP */}
                {otpSent && !otpVerified && (
                    <>
                        <p className="text-sm text-gray-600 text-center mb-4">Enter the OTP sent to your email</p>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <button
                            onClick={handleVerifyOTP}
                            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {/* Step 3: Reset Password */}
                {otpVerified && (
                    <>
                        <p className="text-sm text-gray-600 text-center mb-4">Enter a new password</p>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <button
                            onClick={handleResetPassword}
                            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                {message && <p className="mt-2 text-sm text-center text-gray-700">{message}</p>}

                <button onClick={onClose} className="mt-4 w-full text-center text-gray-600 underline">
                    Close
                </button>
                    </div>
        </div>
    );
}