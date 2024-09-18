import { Button } from '@/components/ui/button'
import { PenIcon, EraserIcon, CircleIcon, TriangleIcon, SquareIcon, Undo2Icon, Redo2Icon, SquareDashedMousePointer } from 'lucide-react'
import { Socket } from 'socket.io-client'
import * as fabric from 'fabric'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/user'
import { cn } from '@/lib/utils'


export default function Toolbar({canvas, socket}: {canvas: fabric.Canvas|null, socket: Socket|null}) {
    const [currSelected, setCurrSelected]= useState<"pen"|"square"|"circle"|"triangle"|"eraser"|"select"|null>(null)
    const userColour= useUserStore( state => state.userColour )


    const emitObjectData = (action: any, object: any) => {
        console.log("Emitting object data: ", object)
        socket!.emit('object-data', { action, object: object });
    };
    

    const handleReceivedObjectData = (data: any, canvas: fabric.Canvas) => {
        if (data.action === 'add') {
            const newObj= new fabric.FabricObject(data.object)
            canvas.add(newObj)
            canvas.renderAll()
        } 
        else if (data.action === 'modify') {
            const obj = canvas.getObjects().find((o) => o.get('id') === data.object.id);
            if (obj) {
                obj.set(data.object);
                canvas.renderAll();
            }
        }
    };


    useEffect( () => {
        if (!canvas || !socket) {
            return
        }

        canvas!.on('object:added', (e) => {
            if (!e.target.get('id')) {
                e.target.set('id', new Date().getTime());
            }
            console.log("Object added: ", e.target)
            emitObjectData('add', e.target)
        });
        canvas!.on('object:modified', (e) => emitObjectData('modify', e.target));

        canvas!.on('path:created', (e) => emitObjectData('add', e.path));

        socket!.on('object-data', (data) => {
            console.log("Received object data: ", data)
            handleReceivedObjectData(data, canvas!);
        });
    }, [canvas, socket] )


    function handleSelectIconClick() {
        setCurrSelected("select")
        canvas!.isDrawingMode= false
    }

    function handlePenIconClick() {
        setCurrSelected("pen")
        canvas!.isDrawingMode= !canvas!.isDrawingMode
    }

    function handleSquareIconClick() {
        setCurrSelected("square")
        const rect= new fabric.Rect({
            left: Math.random()*500,
            top: Math.random()*500,
            fill: "transparent",
            stroke: userColour,
            width: 50,
            height: 50,
        })
        canvas!.add(rect)
        canvas!.isDrawingMode= false
    }

    function handleCircleIconClick() {
        setCurrSelected("circle")
        const circle= new fabric.Circle({
            left: Math.random()*500,
            top: Math.random()*500,
            fill: "transparent",
            stroke: userColour,
            radius: 25
        })
        canvas!.add(circle)
        canvas!.isDrawingMode= false
    }

    function handleTriangleIconClick() {
        setCurrSelected("triangle")
        const triangle= new fabric.Triangle({
            left: Math.random()*500,
            top: Math.random()*500,
            fill: "transparent",
            stroke: userColour,
            width: 50,
            height: 50,
        })
        canvas!.add(triangle)
        canvas!.isDrawingMode= false
    }

    function handleUndoIconClick() {
        
    }

    function handleRedoIconClick() {
        
    }

    return (
        <div className="absolute flex gap-2 mt-2 left-1/3 z-30 text-black">
            <Button variant="ghost" size="icon" title="Select" onClick={() => handleSelectIconClick()} className={cn(!canvas?.isDrawingMode ? 'text-white bg-black' : '')}> 
                <SquareDashedMousePointer className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Pen" onClick={() => handlePenIconClick()} className={cn(canvas?.isDrawingMode ? 'text-white bg-black' : '')}> 
                <PenIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Square" onClick={() => handleSquareIconClick()}>
                <SquareIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Cicle" onClick={() => handleCircleIconClick()}>
                <CircleIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" title="Triangle" onClick={() => handleTriangleIconClick()}>
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