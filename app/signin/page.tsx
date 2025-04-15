"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { z } from "zod";
import axios from "axios"; // ✅ Required for isAxiosError
import { ForgotPass } from "@/components/ForgotPass";
import { toast } from "@/components/ui/use-toast";

const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [postInputs, setPostInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignin = async () => {
    const { email, password } = postInputs;

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      userSchema.parse({ email, password });
      setErrors({});

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Sign In Failed",
          description:  result?.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const key = err.path[0] as "email" | "password";
          fieldErrors[key] = err.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex justify-center items-center bg-[#E0EAFF]  p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center">Login</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your registered email below to log in to your account.
          </p>

          <LabelledInput
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={postInputs.email}
            onChange={handleChange}
            name="email"
            error={errors.email}
          />

          <LabelledInput
            label="Password"
            type="password"
            placeholder="******"
            value={postInputs.password}
            onChange={handleChange}
            name="password"
            error={errors.password}
            showToggle
          />

          <button
            onClick={handleSignin}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-semibold text-lg tracking-wide 
              disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="mt-3 text-center text-sm text-gray-600">
            Forgot Password?{" "}
            <button
              onClick={() => setForgotPasswordOpen(true)}
              className="text-blue-500 underline"
            >
              Click Here
            </button>
          </p>

          <p className="mt-3 text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gradient-to-r from-black via-gray-900 to-gray-800 flex justify-center items-center 
        text-white text-4xl font-extrabold font-[Poppins] p-12 shadow-lg">
        <div className="text-center leading-tight tracking-wide">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            From Concept to Secure Print,
          </span>
          <br />
          <span className="text-gray-300">We Make It Simple and Safe</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && <ForgotPass onClose={() => setForgotPasswordOpen(false)} />}
    </div>
  );
}

function LabelledInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
  error,
  showToggle = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  error?: string;
  showToggle?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col relative mb-4">
      <label className="font-medium">{label}</label>
      <div className="relative flex items-center">
        <input
          type={showToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          className={`w-full px-3 py-2 border rounded-md ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeOffFill size={20} /> : <RiEyeFill size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
