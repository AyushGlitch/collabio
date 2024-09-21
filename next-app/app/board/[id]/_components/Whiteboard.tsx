"use client"

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as fabric from "fabric";
import { useUserStore } from "@/store/user";
import Toolbar2 from "./Toolbar2";
import VoiceChat2 from "./VoiceChat2";


export default function Whiteboard({socket, boardId} : {socket: Socket|null, boardId: string}) {
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
            // width: canvasWrapperRef.current.offsetWidth +11,
            width:2000,
            // @ts-ignore
            // height: canvasWrapperRef.current.offsetHeight -4,
            height: 2000,
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
        <div className="h-full w-full overflow-auto no-scrollbar" ref={canvasWrapperRef}>
            {/* <Toolbar canvas={canvas} socket={socket} /> */}
            <Toolbar2 canvas={canvas} socket={socket} />
            <VoiceChat2 socket={socket} boardId={boardId} />
            <canvas ref={canvasRef} className="border-8 border-emerald-400 overflow-auto" />
        </div>
    )
}