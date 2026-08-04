import { NextResponse } from "next/server";
import { loginUser } from "@/app/services/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await loginUser(email, password);

    if (!result.success) {
      const status = result.error?.includes("required") ? 400 : 401;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result.user, { status: 200 });
  } catch (error: any) {
    console.error("API Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error during login." },
      { status: 500 }
    );
  }
}
