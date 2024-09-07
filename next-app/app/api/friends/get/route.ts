import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";



export async function GET (req: NextRequest) {
    try {
        const session= await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const friends= await prisma.friends.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                friend: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        const friendsArray= friends.map( friend => ({
            id: friend.friend.id,
            name: friend.friend.name,
            email: friend.friend.email,
            image: friend.friend.image
        }))

        return NextResponse.json(friendsArray, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching friend requests:", error);
        return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
    }
}