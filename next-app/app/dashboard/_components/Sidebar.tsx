"use client"

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Presentation, CircleUserRound, NotebookPen } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'


const sidebarList= [
    {
        title: 'Boards',
        icon: <Presentation height={40} width={40} />,
        curr: 'boards'
    },
    {
        title: 'Friends',
        icon: <CircleUserRound height={40} width={40} />,
        curr: 'friends'
    },
    {
        title: 'Notes',
        icon: <NotebookPen height={40} width={40} />,
        curr: 'notes'
    }
]


export default function Sidebar() {
    const pathname= usePathname()
    const pathSections= pathname.split('/')
    
    const router= useRouter()
    let currSection: string= '' 

    if (pathSections.length > 2) {
        currSection= pathSections[2]
    }


    return (
        <div className="bg-slate-800 py-5 px-2 flex flex-col gap-5 rounded-3xl">
                {
                    sidebarList.map( (item, i) => (
                        <Button className={cn("rounded-3xl flex gap-5 justify-start pl-7 py-6", currSection== item.curr ? "bg-slate-400" : "bg-slate-600" )} key={item.title} onClick={() => router.push(`/dashboard/${item.curr}`)}>
                            {item.icon}
                            <h1 className='text-xl font-semibold'>{item.title}</h1>
                        </Button>
                    ) )
                }
        </div>
    )
}