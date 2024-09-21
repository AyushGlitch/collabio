export default function BoardLayout({children} : {children: React.ReactNode}) {
    

    return (
        <div className="no-scrollbar">
            {children}
        </div>
    )
}