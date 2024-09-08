import { auth } from "@/auth"
import { prisma } from "@/prisma/prismaClient"
import { NextRequest, NextResponse } from "next/server"



export async function DELETE (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const body= await req.json()
        if (!body.boardId) {
            return NextResponse.json({ error: "Invalid board id" }, { status: 400 })
        }

        const boardId: string= body.boardId

        const deleteBoard= await prisma.boards.delete({
            where: {
                boardId: boardId
            }
        })

        return NextResponse.json(deleteBoard, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting board:", error);
        return NextResponse.json({ error: "Failed to delete board" }, { status: 500 })
    }
}