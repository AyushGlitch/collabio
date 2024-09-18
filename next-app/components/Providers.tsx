"use client"

import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil"
import { Toaster } from "sonner"


export const Providers= ({children}: {children: React.ReactNode}) => {
    return (
        <SessionProvider>
                {children}
            <Toaster richColors={true} duration={3000} />
        </SessionProvider>
    )
}