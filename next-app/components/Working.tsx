"use client"

import Image from "next/image";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
    {
        number: 1,
        title: "Create a Board",
        description:
            "Start a new collaborative space for your project or team.",
    },
    {
        number: 2,
        title: "Invite Team Members",
        description: "Add your colleagues to collaborate in real-time.",
    },
    {
        number: 3,
        title: "Collaborate",
        description:
            "Work together on the board, chat, and create notes simultaneously.",
    },
];

export default function HowItWorks() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end']
    });

    // Transform scroll progress to x position for the steps
    const xTransform = useTransform(scrollYProgress, [0, 1], [200, 0]); // Move from right to left
    const opacity= useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 1])

    return (
        <section>
            <div className="container mx-auto py-14 px-4">
                <div 
                    ref={containerRef} 
                    className="relative mx-auto max-w-4xl border border-slate-400 rounded-3xl p-10"
                >
                    <div className="absolute inset-0 bg-violet-700 [mask-image:radial-gradient(50%_60%_at_50%_50%,black,transparent)]"></div>
                    <Image
                        src="/grid.svg"
                        alt="Grid background"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-50"
                    />
                    <h2 className="relative text-4xl md:text-5xl font-semibold text-white text-center mb-12">
                        How It Works
                    </h2>
                    <div className="relative flex flex-col gap-10 justify-center items-center">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                className="flex items-start space-x-4 w-4/5"
                                style={{
                                    x: xTransform,
                                    opacity: opacity, // Fade in effect // Smooth transition
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
                                    {step.number}
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-violet-100">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
