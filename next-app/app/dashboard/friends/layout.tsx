"use client"

import { RecoilRoot } from "recoil";


export default function FriendsLayout({children} : {children: React.ReactNode}) {
    
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}