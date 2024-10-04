"use client"

import { MessagesSquareIcon, NotepadTextIcon, PresentationIcon } from "lucide-react"
import Image from "next/image"
import { useMotionTemplate, useMotionValue, motion, animate, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"


const featuresList= [
    {
        title: "Collaborative Board",
        content: "Work together on a shared canvas in real-time. Sketch ideas, create diagrams, and brainstorm visually.",
        icon: <PresentationIcon size={40} />
    },
    {
        title: "Real-Time Chat",
        content: "Communicate instantly with your team members using our integrated chat feature.",
        icon: <MessagesSquareIcon size={40} />
    },
    {
        title: "Collaborative Notes",
        content: "Create, edit, and organize notes together in real-time. Perfect for meeting minutes and project documentation.",
        icon: <NotepadTextIcon size={40} />
    },
]


export default function Features () {
    const imageRef= useRef(null)
    const { scrollYProgress }= useScroll({
        target: imageRef,
        offset: ['start end', 'end end']
    })

    const rotateX= useTransform(scrollYProgress, [0, 1], [30, 0])
    const opacity= useTransform(scrollYProgress, [0, 1], [0.5, 1])

    const xPercentage= useMotionValue(0)
    const yPercentage= useMotionValue(0)

    const maskImage= useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}% ,black ,transparent)`

    useEffect( () => {
        animate(xPercentage, [0, 100, 100, 0, 0], {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
        })

        animate(yPercentage, [0, 0, 100, 100, 0], {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
        })
    }, [] )

    return (
        <section>
            <div className="container py-20">
                <div className="flex flex-col gap-14 justify-center items-center">
                    <h1 className="text-5xl font-semibold tracking-tight">
                        Key Features
                    </h1>

                    <div className="flex flex-col w-full gap-3">
                        {
                            featuresList.map( (feature, i) => (
                                <div className="relative grid grid-cols-5 border border-slate-400 p-1 px-4 rounded-2xl h-20" key={feature.title}>
                                    <motion.div
                                        style={{ maskImage }}
                                        className="absolute inset-0 border-2 border-violet-600 rounded-2xl" 
                                    />
                                    <div className="col-span-2 flex px-4 gap-10 items-center" >
                                        {feature.icon}
                                        <p className="text-2xl font-bold">
                                            {feature.title}
                                        </p>
                                    </div>

                                    <div className="flex text-wrap col-span-3 text-lg font-medium items-center">
                                        {feature.content}
                                    </div>
                                </div>
                            ) )
                        }
                    </div>

                    <div className="aspect-video border border-slate-400 rounded-3xl relative overflow-hidden w-full -mt-10 flex justify-center items-center">
                        <motion.div
                            style={{ 
                                maskImage,
                            }}
                            className="absolute inset-0 border-2 border-violet-600 rounded-3xl" 
                        />
                        <motion.img
                            src="/boardSS.png"
                            alt="Board Screenshot"
                            ref={imageRef}
                            style={{
                                opacity: opacity,
                                rotateX: rotateX,
                                transformPerspective: "800px" 
                            }}
                            className="w-[98%] h-[98%] rounded-3xl"
                        />
                    </div>              
                </div>
            </div>
        </section>
    )
}