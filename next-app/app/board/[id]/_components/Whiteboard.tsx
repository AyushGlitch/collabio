"use client"

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as fabric from "fabric";
import Toolbar from "./Toolbar";
import { useUserStore } from "@/store/user";
import Toolbar2 from "./Toolbar2";


export default function Whiteboard({socket} : {socket: Socket|null}) {
    const canvasRef= useRef(null)
    const canvasWrapperRef= useRef(null)
    const [canvas, setCanvas]= useState<fabric.Canvas|null>(null)
    const userColour= useUserStore( state => state.userColour )

    useEffect( () => {
        if (!canvasRef.current || !canvasWrapperRef.current) {
            return
        }
        const fabricCanvas= new fabric.Canvas(canvasRef.current!, {
            backgroundColor: "white",
            // @ts-ignore
            width: canvasWrapperRef.current.offsetWidth +11,
            // @ts-ignore
            height: canvasWrapperRef.current.offsetHeight -4,
            allowTouchScrolling: true,
        })
        setCanvas(fabricCanvas)

        const brush= new fabric.PencilBrush(fabricCanvas)
        brush.width= 3
        brush.color= userColour
        fabricCanvas.freeDrawingBrush= brush

        const circle= new fabric.Circle({
            radius: 0,
            fill: "transparent",
        })
        fabricCanvas.add(circle)

        // console.log("Fabric Canvas: ", fabricCanvas)

        return () => {
            setCanvas(null)
            fabricCanvas.dispose()
        }
    }, [] )


    return (
        <div className="h-full w-full bg-red-300" ref={canvasWrapperRef}>
            {/* <Toolbar canvas={canvas} socket={socket} /> */}
            <Toolbar2 canvas={canvas} socket={socket} />
            <canvas ref={canvasRef} className="border-4 border-emerald-400 overflow-auto" />
        </div>
    )
}