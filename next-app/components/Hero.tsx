import Image from "next/image";

export default async function Hero() {
    return (
        <section>
            <div className="container relative text-center h-screen pt-12 flex flex-col justify-center items-center overflow-hidden">
                <h1 className="text-9xl font-semibold tracking-tighter bg-gradient-to-br from-white from-50% to-purple-700 to-90% text-transparent bg-clip-text">
                    Collabio
                </h1>

                <h2 className="text-2xl font-semibold mt-7 w-1/2">
                    Collaborate in Real-Time to boost productivity of your team
                    with our real-time collaborative board, chat, and
                    note-making platform.
                </h2>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 mt-12">
                    <Image
                        src="/collabioCircle.svg"
                        alt="Rotating Collabio Circle"
                        width={450}
                        height={450}
                        className="opacity-20 animate-spin-slow"
                    />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 -rotate-90 mt-12">
                    <Image
                        src={"/collabioCircle.svg"}
                        alt="Circle"
                        width={650}
                        height={650}
                        className="opacity-10 animate-spin-reverse-slow"
                    />
                </div>
                <div className="absolute w-[900px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 -rotate-180 mt-12">
                    <Image
                        src={"/collabioCircle.svg"}
                        alt="Circle"
                        width={900}
                        height={900}
                        className="opacity-5 animate-spin-slow"
                    />
                </div>

                <div className="absolute -z-10 bg-purple-500 h-72 w-72 rounded-full mt-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_16.8%_18.3%,white,rgb(184,148,255)_35%,rgb(24,0,66))] border border-white/50 shadow-[-20px_-20px_50px_rgba(255,255,255,0.5),-20px_-20px_80px_rgba(255,255,255,0.1),0_0_50px_rgb(140,70,255)]"></div>

                <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,70,255,.5)_15%,rgb(14,0,36,.5)_75%,transparent)] -z-20" />
            </div>
        </section>
    );
}
