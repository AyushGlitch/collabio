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

        const boardId: string= body.boardId

        const board = await prisma.boards.findUnique({
            where: { boardId: boardId },
            select: { membersId: true },
        });
    
        if (!board) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        const updatedMembersId = board.membersId.filter(
            (id: string) => id !== session.user?.id
        );

        const leaveBoard= await prisma.$transaction([
            prisma.usersBoards.deleteMany({
                where: {
                    boardId: boardId,
                    userId: session.user.id
                }
            }),
            prisma.boards.update({
                where: {
                    boardId: boardId
                },
                data: {
                    membersCnt: {
                        decrement: 1
                    },
                    membersId: {
                        set: updatedMembersId
                    }
                }
            })
        ])

        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.error("Error leaving board:", error);
        return NextResponse.json({ error: "Failed to leave board" }, { status: 500 })
    } 
}