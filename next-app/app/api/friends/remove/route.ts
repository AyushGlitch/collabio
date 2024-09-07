import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId= session.user.id

        const body= await req.json()
        if (!body.friendId) {
            return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 })
        }

        const friendId= body.friendId
        const removeFriend= await prisma.$transaction([
            prisma.friends.deleteMany({
                where: {
                    userId: userId,
                    friendId: friendId
                }
            }),
            prisma.friends.deleteMany({
                where: {
                    userId: friendId,
                    friendId: userId
                }
            })
        ])

        return NextResponse.json({ status: 200 })
    }
    catch (error) {
        console.error("Error removing friend:", error);
        return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
    }
}