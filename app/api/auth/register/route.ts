import { NextResponse } from "next/server";
import { registerUser } from "@/app/services/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);

    if (!result.success) {
      const status = result.error?.includes("already exists") ? 409 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result.user, { status: 201 });
  } catch (error: any) {
    console.error("API Error during registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error during registration." },
      { status: 500 }
    );
  }
}
