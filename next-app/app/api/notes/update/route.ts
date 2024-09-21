import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body= await req.json()
        const note= await prisma.notes.update({
            where: {
                noteId: body.noteId
            },
            data: {
                noteTitle: body.title,
                noteBody: body.body
            }
        })

        return NextResponse.json(note, { status: 200 })
    }
    catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}