import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {

    
    const { email, otp }: { email: string; otp: string } = await req.json();
    console.log("Received verification request:", { email, otp });

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Initialize global.otpStore if not present
    if (!global.otpStore) global.otpStore = new Map<string, string>();

    const storedOtp = global.otpStore.get(email);
    console.log(`Stored OTP for ${email}:`, storedOtp);

    if (storedOtp === otp) {
      global.otpStore.delete(email);
      console.log("OTP Verified Successfully");
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully!",
      });
    } else {
      console.error("Invalid OTP");
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    let message = "Verification failed";

    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Required so that global declarations work in modules
export {};
