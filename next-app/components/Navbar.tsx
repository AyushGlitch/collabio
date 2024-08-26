"use client"

import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"


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
    const pathname= usePathname()
    const parentDir= pathname.split('/')[1]
    // console.log(parentDir)
    const session= useSession()

    return (
        <div className="absolute w-full top-0">
            <div className="flex justify-between items-center py-3 px-5 bg-slate-900 rounded-b-3xl">
                <div>
                    <Link href={'/'} className="flex gap-5 justify-center items-center">
                        <Image src="/icon.jpeg" alt="Collabio" width={80} height={80} className="rounded-full" />
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
                            <Button variant={"secondary"} className="text-base font-medium" onClick={() => signOut()}>
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