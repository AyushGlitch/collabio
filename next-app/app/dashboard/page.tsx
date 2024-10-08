import { auth } from "@/auth";
import { LayoutDashboardIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";


export default async function Dashboard() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }


    return (
        <div className="flex flex-col h-full justify-center items-center gap-14">
            <LayoutDashboardIcon size={100} className="text-white" />
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-5xl font-serif font-semibold italic">
                    Dashboard
                </h1>
                <p className="text-2xl italic font-semibold text-slate-500 animate-pulse">
                    Not sure what to do here?
                </p>
            </div>
        </div>
    );
}
