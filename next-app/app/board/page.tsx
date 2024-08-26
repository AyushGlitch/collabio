import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function Board() {
    const session= await auth()
    if (!session?.user) {
        redirect('/auth/signin')
    }

    return (
        <div>
            <h1>Board</h1>
        </div>
    )
}