import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const boardsQuery= await prisma.usersBoards.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                board: {
                    select: {
                        boardId: true,
                        boardTitle: true,
                        membersCnt: true,
                        membersId: true,
                        notesCnt: true,
                        notesId: true,
                        createdBy: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        })

        const boards= boardsQuery.map( (board) => board.board )
        return NextResponse.json(boards, { status: 200 })
    }
    catch (error) {
        console.error("Error getting boards:", error);
        return NextResponse.json({ error: "Failed to get boards" }, { status: 500 })
    }
}