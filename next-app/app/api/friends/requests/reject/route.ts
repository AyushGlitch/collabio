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
        if (!body.friendId) {
            return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 })
        }

        const friendId= body.friendId
        const removeFriendRequest= await prisma.$transaction([
            prisma.friendRequest.deleteMany({
                where: {
                    userId: friendId,
                    friendId: session.user.id,
                    status: "PENDING"
                }
            }),
            prisma.friendRequest.deleteMany({
                where: {
                    userId: session.user.id,
                    friendId: friendId,
                    status: "PENDING"
                }
            })
        ])

        return NextResponse.json({ status: 200 })
    }
    catch (error) {
        console.error("Error rejecting friend request:", error);
        return NextResponse.json({ error: "Failed to reject friend request" }, { status: 500 });
    }
}