import Sidebar from "./_components/Sidebar";


export default function DashboardLayout({children} : {children: React.ReactNode}) {
    

    return (
        <div className="grid grid-cols-5 gap-10 pt-40 pb-5 min-h-screen no-scrollbar">
            <Sidebar />
            <div className="bg-slate-800 rounded-3xl p-4 col-span-4">
                {children}
            </div>
        </div>
    )
}