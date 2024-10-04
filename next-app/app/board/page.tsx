import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function Board() {
    const session= await auth()
    if (!session?.user) {
        redirect('/auth/signin')
    }
    else {
        redirect('/dashboard')
    }

    return (
        <div>
            <h1>Board</h1>
        </div>
    )
}