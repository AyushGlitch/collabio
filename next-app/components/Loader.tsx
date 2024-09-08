import { LoaderIcon } from "lucide-react";



export default function Loader ( {className, size} : {className?: string, size: number} ) {
    return (
        <LoaderIcon className={`text-white animate-spin m-auto ${className}`} size={`${size}`} />
    )
}