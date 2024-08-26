import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const searchTerm = `${body.searchTerm}:*`;

        const result = await prisma.$queryRaw`
            SELECT "id", "name", "email", "image"
            FROM "User" 
            WHERE to_tsvector('english', "User"."name") @@ to_tsquery('english', ${searchTerm})
                OR to_tsvector('english', "User"."email") @@ to_tsquery('english', ${searchTerm})
            LIMIT 5;
        `;

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
