import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


export default function FriendRequest() {
    
    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-y-auto max-h-[60vh] bg-zinc-700">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandItem>
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                        <span>Calculator</span>
                    </CommandItem>
                </CommandList>
            </Command>
        </div>
    )
}