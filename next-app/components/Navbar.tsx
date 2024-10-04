"use client"

import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUserStore } from "@/store/user"
import { useEffect } from "react"


const links= [
    {
        label: "Home",
        href: "/",
        pathname: ""
    },
    {
        label: "Dashboard",
        href: "/dashboard",
        pathname: "dashboard"
    },
    {
        label: "Board",
        href: "/board",
        pathname: "board"
    }
]


export const Navbar= () => {
    // const [user, setUser]= useRecoilState(userAtom)
    const user= useUserStore( state => state.getUser() )
    const setUser= useUserStore( state => state.setUser )

    // console.log("user", user)

    const pathname= usePathname()
    const parentDir= pathname.split('/')[1]

    const session= useSession()
    
    useEffect( () => {
        if (session.data?.user && user.id === "") {
            // @ts-ignore
            setUser(session.data.user)
        }
    }, [session])
    
    return (
        <div className="absolute w-full top-0 z-20">
            <div className="flex justify-between items-center py-3 px-5 bg-slate-950 rounded-b-3xl border-b-2 border-white/40">
                <div>
                    <Link href={'/'} className="flex gap-5 justify-center items-center">
                        <Image src="/icon.jpeg" alt="Collabio" width={60} height={60} className="rounded-full" />
                        <h1 className="text-3xl font-semibold">Collabio</h1>
                    </Link>
                </div>

                <div className="flex gap-7 justify-center items-center">
                    {
                        links.map( (link, i) => (
                            <Button key={i} asChild variant={"secondary"} className={cn("border-b-4 text-base font-medium", parentDir === link.pathname ? " border-slate-300" : "border-slate-600")}>
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </Button>
                        ) )
                    }
                </div>

                {
                    session.data?.user ? (
                        <div className="flex gap-5 justify-center items-center">
                            <div className="flex gap-3 justify-center items-center">
                                <Avatar>
                                    <AvatarImage src={session.data.user.image!} alt={session.data.user.name!} />
                                    <AvatarFallback>{session.data.user.name![0]}</AvatarFallback>
                                </Avatar>

                                <h1 className="text-base font-medium">{session.data.user.name}</h1>
                            </div>
                            <Button variant={"secondary"} className="text-base font-medium" onClick={() => signOut({callbackUrl: '/'})}>
                                Sign Out
                            </Button>
                        </div>
                    )
                    : (
                        <Button className="text-base font-medium">
                            <Link href={'/auth/signin'}>
                                Sign In
                            </Link>
                        </Button>
                    )
                }
            </div>
        </div>
    )
}