import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


export default function FriendList() {
    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-y-auto bg-zinc-700 max-h-[60vh]">
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