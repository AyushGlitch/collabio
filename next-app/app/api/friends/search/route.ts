import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const searchTerm = body.searchTerm?.trim();
        
        if (!searchTerm) {
            return NextResponse.json({ error: "Invalid search term" }, { status: 400 });
        }

        const formattedSearchTerm = `${searchTerm}:*`;

        const result = await prisma.$queryRaw`
            SELECT "id", "name", "email", "image"
            FROM "User" 
            WHERE (
                to_tsvector('english', "User"."name") @@ to_tsquery('english', ${formattedSearchTerm})
                OR to_tsvector('english', "User"."email") @@ to_tsquery('english', ${formattedSearchTerm})
            )
            AND "User"."id" != ${session.user?.id}
            AND "User"."id" NOT IN (
                SELECT "friendId"
                FROM "Friends"
                WHERE "userId" = ${session.user?.id}
            )
            LIMIT 5;
        `;
        console.log(session.user.id)
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
