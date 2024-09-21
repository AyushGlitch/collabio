import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PenIcon, EraserIcon, CircleIcon, TriangleIcon, SquareIcon, Undo2Icon, Redo2Icon, SquareDashedMousePointer } from 'lucide-react'
import { Socket } from 'socket.io-client'
import * as fabric from 'fabric'
import { useUserStore } from '@/store/user'
import { cn } from '@/lib/utils'

type ToolType = "pen" | "square" | "circle" | "triangle" | "eraser" | "select" | null

interface Toolbar2Props {
    canvas: fabric.Canvas | null
    socket: Socket | null
}

export default function Toolbar2({ canvas, socket }: Toolbar2Props) {
    const [currSelected, setCurrSelected] = useState<ToolType>(null)
    const userColour = useUserStore(state => state.userColour)
    const currPathRef = useRef<number | null>(null)

    const emitObjectData = (action: string, modifiedObject: any) => {
        socket?.emit('object-data-to-server', { action, modifiedObject });

        if (action === 'add' && canvas) {
            let state = canvas.toJSON()
            const canvasObjects = canvas.getObjects()
            state.objectIds = canvasObjects.map((obj) => obj.get('id'))
            socket?.emit('save-state-on-server', { action, canvasState: state })
        }
    };

    const handleReceivedObjectData = (data: any, canvas: fabric.Canvas) => {
        if (data.action === 'add') {
            const shape = data.modifiedObject.shape
            const objId = data.modifiedObject.id

            let newObj: fabric.Object
            switch(shape) {
                case "square":
                    newObj = new fabric.Rect(data.modifiedObject.obj)
                    break
                case "circle":
                    newObj = new fabric.Circle(data.modifiedObject.obj)
                    break
                case "triangle":
                    newObj = new fabric.Triangle(data.modifiedObject.obj)
                    break
                case "path":
                    newObj = new fabric.Path(data.modifiedObject.obj.path, data.modifiedObject.obj)
                    break
                default:
                    return
            }
            newObj.set({ 'id': objId, 'shape': shape });
            canvas.add(newObj)
            canvas.renderAll()
        } 
        else if (data.action === 'modify') {
            const obj = canvas.getObjects().find((o) => o.get('id') === data.modifiedObject.id);
            if (obj) {
                obj.set(data.modifiedObject.obj);
                obj.setCoords();
                canvas.renderAll();
            }
        }
    };

    async function handleCanvasLoad(data: any) {
        await canvas?.loadFromJSON(data, 
            () => {
                canvas?.requestRenderAll()
            }, 
        )
        if (canvas) {
            canvas._objects = canvas._objects.map((obj, i) => {
                obj.set({ 'id': data.objectIds[i] })
                return obj
            })
        }
    }

    useEffect(() => {
        if (!canvas || !socket) {
            return
        }

        socket.emit('get-initial-state', (data: any) => {
            if (data) {
                handleCanvasLoad(data)
            }
        })

        // @ts-ignore
        const handleObjectModified = (e: fabric.IEvent) => {
            if (e.target) {
                const modifiedObj = {
                    obj: e.target,
                    id: e.target.get('id')
                }
                emitObjectData("modify", modifiedObj)

                let state = canvas.toJSON()
                const canvasObjects = canvas.getObjects()
                state.objectIds = canvasObjects.map((obj) => obj.get('id'))
                socket.emit('save-state-on-server', { action: "modified", canvasState: state })
            }
        }

        // @ts-ignore
        const handleObjectMoving = (e: fabric.IEvent) => {
            if (e.target) {
                const modifiedObj = {
                    obj: e.target,
                    id: e.target.get('id')
                }
                emitObjectData("modify", modifiedObj)
            }
        }

        // @ts-ignore
        const handleBeforePathCreated = (e: fabric.IEvent) => {
            const objId = new Date().getTime()
            currPathRef.current = objId
            if (e.path) {
                e.path.set({ 'id': objId, 'shape': "path" });
            }
        }

        // @ts-ignore
        const handlePathCreated = (e: fabric.IEvent) => {
            if (e.path) {
                const objId = currPathRef.current
                e.path.set({ 'id': objId, 'shape': "path" });
                const pathData = e.path.toJSON()
                const modifiedObj = {
                    obj: pathData,
                    id: objId,
                    shape: "path"
                }
                emitObjectData("add", modifiedObj)
            }
        }

        canvas.on("object:modified", handleObjectModified)
        canvas.on("object:moving", handleObjectMoving)
        canvas.on("before:path:created", handleBeforePathCreated)
        canvas.on("path:created", handlePathCreated)

        socket.on('object-data-from-server', (data) => {
            handleReceivedObjectData(data, canvas);
        });

        socket.on("undo-redo-state", (state) => {
            if (state && canvas) {
                canvas._objects = []
                handleCanvasLoad(state)
            }
        })

        socket.on("erase-board-client", () => {
            canvas.clear()
            canvas.backgroundColor = "white"
            canvas.renderAll()
        })

        return () => {
            canvas.off("object:modified", handleObjectModified)
            canvas.off("object:moving", handleObjectMoving)
            canvas.off("before:path:created", handleBeforePathCreated)
            canvas.off("path:created", handlePathCreated)
            socket.off('object-data-from-server')
            socket.off("undo-redo-state")
            socket.off("erase-board-client")
        }
    }, [canvas, socket])


    function handleToolbarIconsClick(shape: "square"|"circle"|"triangle") {
        setCurrSelected(shape)

        let obj: fabric.FabricObject
        switch(shape) {
            case "square":
                obj= new fabric.Rect({
                    left: Math.random()*500,
                    top: Math.random()*500,
                    fill: "transparent",
                    stroke: userColour,
                    width: 50,
                    height: 50,
                    strokeWidth: 3
                })
                break
            case "circle":
                obj= new fabric.Circle({
                    left: Math.random()*500,
                    top: Math.random()*500,
                    fill: "transparent",
                    stroke: userColour,
                    radius: 25,
                    strokeWidth: 3
                })
                break
            case "triangle":
                obj= new fabric.Triangle({
                    left: Math.random()*500,
                    top: Math.random()*500,
                    fill: "transparent",
                    stroke: userColour,
                    width: 50,
                    height: 50,
                    strokeWidth: 3  
                })
                break
        }
        obj.set({'id': new Date().getTime(), 'shape': shape});
        const modifiedObj= {
            obj: obj,
            id: obj.get('id'),
            shape: shape
        }
        canvas!.add(obj)
        emitObjectData('add', modifiedObj)
        canvas!.isDrawingMode= false
    }


    function handleSelectIconClick() {
        setCurrSelected("select")
        canvas!.isDrawingMode= false
    }

    function handlePenIconClick() {
        setCurrSelected("pen")
        canvas!.isDrawingMode= !canvas!.isDrawingMode
    }

    function handleUndoIconClick() {
        socket?.emit("undo-initialized")
    }

    function handleRedoIconClick() {
        socket?.emit("redo-initialized")
    }

    function handleEraseBoard() {
        socket?.emit("erase-board")
    }

    return (
        <div className="absolute flex gap-2 mt-2 left-1/4 z-30 text-black">
            <Button variant="ghost" size="icon" title="Select" onClick={() => handleSelectIconClick()} className={cn(!canvas?.isDrawingMode ? 'text-white bg-black' : '')}> 
                <SquareDashedMousePointer className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Pen" onClick={() => handlePenIconClick()} className={cn(canvas?.isDrawingMode ? 'text-white bg-black' : '')}> 
                <PenIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Square" onClick={() => handleToolbarIconsClick("square")}>
                <SquareIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Cicle" onClick={() => handleToolbarIconsClick("circle")}>
                <CircleIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Triangle" onClick={() => handleToolbarIconsClick("triangle")}>
                <TriangleIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Undo" onClick={() => handleUndoIconClick()}>
                <Undo2Icon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Redo" onClick={() => handleRedoIconClick()}>
                <Redo2Icon className="h-6 w-6" />
            </Button>
            <Button variant={"ghost"} size={"icon"} title={"Erase All"} onClick={() => handleEraseBoard()}>
                <EraserIcon className="h-6 w-6" />
            </Button>
        </div>
    )
}