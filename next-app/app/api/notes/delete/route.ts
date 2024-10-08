import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const [deletedNote, updatedBoard] = await prisma.$transaction([
            prisma.notes.delete({
                where: {
                    noteId: body.noteId,
                },
            }),
            prisma.boards.update({
                where: {
                    boardId: body.boardId,
                },
                data: {
                    notesCnt: {
                        decrement: 1,
                    },
                    notesId: {
                        set: await prisma.boards
                            .findUnique({
                                where: { boardId: body.boardId },
                                select: { notesId: true },
                            })
                            .then(
                                (board) =>
                                    board?.notesId.filter(
                                        (id) => id !== body.noteId
                                    ) || []
                            ),
                    },
                },
            }),
        ]);

        return NextResponse.json(
            { deletedNote, updatedBoard },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            { error: "Failed to delete note" },
            { status: 500 }
        );
    }
}
