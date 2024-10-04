
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function Dashboard() {
    const session= await auth()
    if (!session?.user) {
        redirect('/auth/signin')
    }

    fetch(process.env.NEXT_PUBLIC_SOCKET_URL! + '/', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then( (resp) => {
        if (resp.status !== 200) {
            console.error("Failed to fetch socket")
        }
        else {
            console.log("Socket fetched")
            // console.log(resp)
        }
    } )

    return (
        <h1>
            Dashboard
        </h1>
    )
}
