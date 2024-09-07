import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const friendRequests= await prisma.friendRequest.findMany({
            where: {
                friendId: session.user.id,
                status: "PENDING"
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        const friendRequestsArray = friendRequests.map(request => ({
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            image: request.user.image
        }));
        // console.log(friendRequestsArray)
        return NextResponse.json(friendRequestsArray, { status: 200 });
    }   
    
    catch (error) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
    }
}