import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.CERTIFICATE_API_KEY;

if (!API_KEY) {
  console.warn(
    "CERTIFICATE_API_KEY not set in environment variables. Certificate downloads will not be protected."
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, certificateId } = body;

    // Validate API key
    if (!API_KEY || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Validate certificateId is provided
    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    // Log successful download attempt
    console.log(
      `Certificate download authorized for: ${certificateId} from IP: ${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"}`
    );

    // Return authorization token for downloading
    return NextResponse.json(
      {
        success: true,
        message: "API key validated. You can now download the certificate.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Download certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
