import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const body= await req.json()
        if (!body.boardId) {
            return NextResponse.json({ error: "Invalid board id" }, { status: 400 })
        }
        console.log("Board JSON:", typeof body.boardJSON)

        await prisma.boards.update({
            where: {
                boardId: body.boardId
            },
            data: {
                boardJSON: body.boardJSON
            }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    }
    catch (error) {
        console.error("Error saving board:", error);
        return NextResponse.json({ error: "Failed to save board" }, { status: 500 })
    }
}