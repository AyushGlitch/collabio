import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body= await req.json();
        const friendId: string= body.friendId;

        if (!friendId) {
            return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 });
        }

        const acceptFriendRequest= await prisma.$transaction([
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
            }),
            prisma.friends.createManyAndReturn({
                data: [
                    {
                        userId: session.user.id!,
                        friendId: friendId
                    },
                    {
                        userId: friendId,
                        friendId: session.user.id!
                    }
                ],
            }),
            prisma.user.findFirst({
                where: {
                    id: friendId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            })
        ])

        return NextResponse.json(acceptFriendRequest, { status: 200 });
    }
    catch (error) {
        console.error("Error accepting friend request:", error);
        return NextResponse.json({ error: "Failed to accept friend request" }, { status: 500 });
    }
}