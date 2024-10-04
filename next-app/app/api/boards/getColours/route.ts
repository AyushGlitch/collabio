import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const userColours= await prisma.usersBoards.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                boardId: true,
                color: true,
            }
        })

        // console.log("User colours:", userColours)
        return NextResponse.json(userColours, { status: 200 })
    }
    catch (error) {
        console.error("Error getting boards:", error);
        return NextResponse.json({ error: "Failed to get boards" }, { status: 500 })
    }
}