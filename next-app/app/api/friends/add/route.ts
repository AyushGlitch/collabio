import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        if (!body.id) {
            return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 });
        }

        let friendReq= await prisma.friendRequest.findFirst({
            where: {
                userId: session.user.id,
                friendId: body.id,
                status: "PENDING"
            }
        })
        if (friendReq) {
            return NextResponse.json(friendReq, { status: 200 });
        }
        else {
            friendReq= await prisma.friendRequest.create({
                data: {
                    userId: session.user.id as string,
                    friendId: body.id as string
                }
            })
            return NextResponse.json(friendReq, { status: 200 });
        }


    } catch (error) {
        console.error("Error adding friend:", error);
        return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
    }
}
