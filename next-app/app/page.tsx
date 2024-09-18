"use client"

import Image from 'next/image';

export default function Home() {

    return (
        <div className="flex flex-col mt-40 mb-10 mx-10 gap-16 justify-center items-center min-h-screen no-scrollbar">
            <h1 className="text-6xl font-bold">Welcome to Collabio...!!!</h1>
            <section className="flex mx-16 gap-10 mt-10 justify-between items-center relative">
                <Image src="/collabio2.jpeg" alt="Collabio" width={500} height={300} className="rounded-3xl" />
                <h1 className="text-3xl font-medium text-center">White board application for collaborative work & discusstion with realtime drawing, text & voice chat.</h1>

                <div className="absolute bg-red-500 h-72 w-72 rounded-full left-[50%] top-3 mix-blend-exclusion -z-10 filter blur-xl opacity-70 animate-blob "></div>
                <div className="absolute bg-cyan-500 h-72 w-72 rounded-full left-[50%] bottom-3 mix-blend-exclusion -z-10 filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bg-emerald-500 h-72 w-72 rounded-full left-[60%] top-20 mix-blend-exclusion -z-10 filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </section>

            <section className="flex mx-16 mt-20 gap-14 justify-between items-center text-2xl font-medium relative">
                <div className="flex flex-col gap-3">
                    <h1>Create and join in rooms with your team members.</h1>
                    <h1>Draw on realtime whiteboard with each other.</h1>
                    <h1>Have discusstion with your team mates over text & voice chat.</h1>
                </div>
                <Image src="/collabio1.jpeg" alt="Collabio" width={500} height={300} className="rounded-3xl" />

                <div className="absolute bg-orange-500 h-72 w-72 rounded-full left-[25%] top-0 mix-blend-exclusion -z-10 filter blur-xl animate-blob opacity-70 "></div>
                <div className="absolute bg-pink-400 h-72 w-72 rounded-full left-[25%] bottom-0 mix-blend-exclusion -z-10 filter blur-xl animate-blob opacity-70  animation-delay-2000"></div>
                <div className="absolute bg-teal-500 h-72 w-72 rounded-full left-[10%] top-20 mix-blend-exclusion -z-10 filter blur-xl animate-blob opacity-70  animation-delay-4000"></div>
            </section>
        </div>
    );
}
