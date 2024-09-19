import { Button } from '@/components/ui/button'
import { PenIcon, EraserIcon, CircleIcon, TriangleIcon, SquareIcon, Undo2Icon, Redo2Icon, SquareDashedMousePointer } from 'lucide-react'
import { Socket } from 'socket.io-client'
import * as fabric from 'fabric'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@/store/user'
import { cn } from '@/lib/utils'


export default function Toolbar2({canvas, socket}: {canvas: fabric.Canvas|null, socket: Socket|null}) {
    const [currSelected, setCurrSelected]= useState<"pen"|"square"|"circle"|"triangle"|"eraser"|"select"|null>(null)
    const userColour= useUserStore( state => state.userColour )
    const currPathRef= useRef<number|null>(null)


    const emitObjectData = (action: any, modifiedObject: any) => {
        // console.log("Emitting object data: ", modifiedObject)
        socket!.emit('object-data-to-server', { action, modifiedObject: modifiedObject });

        if (action === 'add') {
            let state= canvas!.toJSON()
            const canvasObjects= canvas!.getObjects()
            // console.log("Canvas Objects: ", canvasObjects)
            state.objectIds= canvasObjects.map( (obj) => obj.get('id')) 
            // console.log("Canvas State: ", state)

            socket!.emit('save-state-on-server', {action, canvasState: state})
        }
    };
    

    const handleReceivedObjectData = (data: any, canvas: fabric.Canvas) => {
        if (data.action === 'add') {
            const shape= data.modifiedObject.shape
            const objId= data.modifiedObject.id
            // console.log("Shape: ", shape)
            // console.log("Object ID: ", objId)
            // console.log("Modified object: ", data.modifiedObject)

            let newObj: fabric.FabricObject
            switch(shape) {
                case "square":
                    newObj= new fabric.Rect(data.modifiedObject.obj)
                    break
                case "circle":
                    newObj= new fabric.Circle(data.modifiedObject.obj)
                    break
                case "triangle":
                    newObj= new fabric.Triangle(data.modifiedObject.obj)
                    break
                case "path":
                    newObj= new fabric.Path(data.modifiedObject.obj.path, data.modifiedObject.obj)
                    break
            }
            newObj!.set({'id': objId, 'shape': shape});
            // console.log("New object: ", newObj)
            canvas.add(newObj!)
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
        await canvas!.loadFromJSON(data, 
            () => {
                canvas!.requestRenderAll()
                // console.log("Canvas Objects: ", canvas!._objects)
            }, 
        )
        canvas!._objects= canvas!._objects.map( (obj, i) => {
            obj.set({'id': data.objectIds[i]})
            return obj
        } )
    }


    useEffect( () => {
        if (!canvas || !socket) {
            return
        }

        socket.emit('get-initial-state', (data: any) => {
            // console.log("Initial state: ", data)
            if (data) {
                handleCanvasLoad(data)
            }
            // console.log("Objects: ", canvas._objects)
        })

        canvas!.on("object:modified", (e) => {
            if (e.target) {
                // console.log("Object modified: ", e.target.toJSON())
                const modifiedObj= {
                    obj: e.target,
                    id: e.target.get('id')
                }
                emitObjectData("modify", modifiedObj)

                // console.log(canvas)
                let state= canvas!.toJSON()
                const canvasObjects= canvas.getObjects()
                // console.log("Canvas Objects: ", canvasObjects)
                state.objectIds= canvasObjects.map( (obj) => obj.get('id')) 
                // console.log("Canvas State: ", state)
                socket!.emit('save-state-on-server', {action: "modified", canvasState: state})
            }
        })

        canvas!.on("object:moving", (e) => {
            if (e.target) {
                const modifiedObj= {
                    obj: e.target,
                    id: e.target.get('id')
                }
                emitObjectData("modify", modifiedObj)
            }
        })

        canvas!.on("before:path:created", (e) => {
            const objId= new Date().getTime()
            currPathRef.current= objId
            e.path.set({'id': objId, 'shape': "path"});
            // console.log("Path Before Created: ", e.path)
        })

        canvas!.on("path:created", (e) => {
            if (e.path) {
                const objId= currPathRef.current
                e.path.set({'id': objId, 'shape': "path"});
                const pathData= e.path.toJSON()
                const modifiedObj= {
                    obj: pathData,
                    id: objId,
                    shape: "path"
                }
                // console.log("Path data: ", pathData)
                emitObjectData("add", modifiedObj)
            }
        })

        socket!.on('object-data-from-server', (data) => {
            handleReceivedObjectData(data, canvas!);
        });

        // socket!.on('initial-state', (state) => {
        //     canvas!.loadFromJSON(state, canvas?.renderAll.bind(canvas))
        //     console.log("Initial state: ", state)
        // })

        socket.on("undo-redo-state", (state) => {
            if (state) {
                canvas!.clear()
                handleCanvasLoad(state)
            }
        })
    }, [canvas, socket] )


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

    return (
        <div className="absolute flex gap-2 mt-2 left-1/3 z-30 text-black">
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
        </div>
    )
}