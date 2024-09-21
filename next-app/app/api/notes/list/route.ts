import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notes= await prisma.user.findMany({
            where: {
                id: session.user.id
            },
            select: {
                boards: {
                    select: {
                        board: {
                            select: {
                                notes: {
                                    select: {
                                        noteId: true,
                                        noteTitle: true,
                                        noteBody: true,
                                        boardId: true,
                                    },
                                    orderBy: {
                                        updatedAt: "desc"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        
        const notesArray= notes[0].boards.map( (board) => board.board.notes )
        const finalNotesArray= notesArray.flat()

        // console.log(finalNotesArray)
        return NextResponse.json(finalNotesArray, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
    }
}