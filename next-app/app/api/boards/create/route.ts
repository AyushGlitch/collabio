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
        if (!body.boardTitle) {
            return NextResponse.json({ error: "Invalid board title" }, { status: 400 })
        }
        if (!body.addedFriends) {
            return NextResponse.json({ error: "Invalid friends list" }, { status: 400 })
        }

        const boardTitle: string= body.boardTitle
        const addedFriends: string[]= [...body.addedFriends, session.user.id]

        const createBoard= await prisma.boards.create({
            data: {
                boardTitle: boardTitle,
                createdBy: session.user.id!,
                membersCnt: addedFriends.length,
                notesCnt: 0,
                membersId: addedFriends,
                notesId: [],
                members: {
                    createMany: {
                        data: addedFriends.map( (member) => ({
                            userId: member
                        }) )
                    }
                }
            }
        })

        return NextResponse.json(createBoard, { status: 200 })
    }
    catch (error) {
        console.error("Error creating board:", error);
        return NextResponse.json({ error: "Failed to create board" }, { status: 500 })
    }
}