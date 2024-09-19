import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { Socket } from "socket.io-client";



export default function Notes ({socket} : {socket: Socket|null}) {
    return (
        <div className="h-full flex flex-col gap-2 py-1 w-full">
            <div className="text-xl py-0.5 font-semibold text-center underline bg-slate-800 mx-2 rounded-3xl">Notes</div>

            <div className="h-full">
                <Carousel className="w-full h-full max-w-xs mx-auto">
                    <CarouselContent className="">
                        <CarouselItem>
                            <Card className="bg-slate-800">
                                <CardContent className="flex aspect-square p-1">
                                    <Textarea placeholder="Write your notes here..." className="h-full w-full" />
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card className="bg-slate-800">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">2</span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        {/* {[1, 2, 3, 4, 5].map((item) => (
                        <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{item}</span>
                                </CardContent>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))} */}
                    </CarouselContent>
                    <CarouselPrevious className="-left-9  bg-zinc-600" />
                    <CarouselNext className="-right-9 bg-zinc-600" />
                </Carousel>
            </div>
        </div>
    )
}