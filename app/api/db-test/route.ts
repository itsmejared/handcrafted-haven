import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export async function GET() {
  try {
    // Get the connection pool
    const db = getDb();

    // Querying database to test connection
    const result = await db.query(
      "SELECT NOW(), current_database(), current_user;",
    );

    return NextResponse.json(
      {
        status: "success",
        message: "Successful Postgres connection!",
        data: {
          time: result.rows[0].now,
          database: result.rows[0].current_database,
          user: result.rows[0].current_user,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ There was an error connecting to the database:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Connection to the database wasn't successful.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
