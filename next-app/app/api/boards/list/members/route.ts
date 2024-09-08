import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest) {
    try {
        const body= await req.json()
        if (!body.membersId) {
            return NextResponse.json({ error: "Invalid members list" }, { status: 400 })
        }

        const membersId: string[]= body.membersId

        const members= await prisma.user.findMany({
            where: {
                id: {
                    in: membersId
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            }
        })
        // console.log("Members:", members);
        return NextResponse.json(members, { status: 200 })
    }
    catch (error) {
        console.error("Error getting board members:", error);
        return NextResponse.json({ error: "Failed to get board members" }, { status: 500 })
    }
}