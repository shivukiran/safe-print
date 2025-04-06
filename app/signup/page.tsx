"use client";

import { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { toast } from "../../components/ui/use-toast";
import { signIn } from "next-auth/react";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postInputs, setPostInputs] = useState({ email: "", password: "", name: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { email, password, name } = postInputs;

    try {
      // Validate with Zod
      userSchema.parse(postInputs);
      setErrors({});
      setLoading(true);

      const res = await axios.post("/api/user/signup", { email, password, name });

      // Try logging in immediately after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        toast({
          title: "Welcome!",
          description: "Account created successfully. Redirecting to dashboard...",
        });
      } else {
        if(res?.data?.error) {
        router.push("/signin");
        toast({
          title: "Signup Successful",
          description: "Account created. Please sign in.",
        });
      }
    }
    } catch (error) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
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
          description: "Signup failed. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left - Form Section */}
      <div className="w-1/2 flex justify-center items-center bg-white p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your details below to create an account
          </p>

          <LabelledInput 
            label="Name" 
            type="text" 
            placeholder="Your Name" 
            value={postInputs.name} 
            onChange={handleChange} 
            name="name" 
            error={errors.name} 
          />
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
            onClick={handleSignup}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-semibold text-lg tracking-wide 
                      disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="mt-3 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Brand Section */}
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
    </div>
  );
}

// Input Component
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
