"use client";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendsStore } from "@/store/friends";
import { useUserStore } from "@/store/user";
import { CircleOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Socket } from "socket.io-client";

export default function VoiceChat({
    socket,
    boardId,
}: {
    socket: Socket | null;
    boardId: string;
}) {
    const user = useUserStore((state) => state.getUser());
    const friends = useFriendsStore((state) => state.getFriends());
    const [onlineFriendIds, setOnlineFriendIds] = useState<string[]>([]);
    const peerInstance = useRef<Peer | null>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!socket) return;

        // Initialize PeerJS and join the room
        const initializePeer = async () => {
            try {
                // Get user's audio stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                // Create a new Peer instance
                const peer = new Peer(user.id); // Assuming user.id is unique for Peer ID
                peerInstance.current = peer;

                // Handle peer connection when joining
                socket.emit("join-voice-room", boardId, user.id);

                // Answer incoming calls and play audio streams
                peer.on("call", (call) => {
                    call.answer(stream);
                    call.on("stream", (userAudioStream) => {
                        playAudioStream(call.peer, userAudioStream);
                    });
                });

                // Listen for users joining
                socket.on("user-joined-voice", (users: string[]) => {
                    setOnlineFriendIds(users);
                    // console.log(onlineFriendIds)
                });

                // Listen for new users connecting and call them
                socket.on("new-user-voice", (userId: string) => {
                    console.log(onlineFriendIds)
                    const call = peer.call(userId, stream);
                    call.on("stream", (userAudioStream) => {
                        playAudioStream(userId, userAudioStream);
                    });
                });

                // Cleanup on unmount
                return () => {
                    if (peer) peer.destroy();
                    if (socket) socket.emit("leave-voice-room", boardId, user.id);
                    stream.getTracks().forEach((track) => track.stop());
                };
            } catch (err) {
                console.error("Failed to initialize peer or get audio stream", err);
            }
        };

        initializePeer();
    }, [socket, boardId, user.id]);

    // Function to play audio streams for connected peers
    const playAudioStream = (userId: string, stream: MediaStream) => {
        if (!audioRefs.current[userId]) {
            const audio = new Audio();
            audio.srcObject = stream;
            audio.addEventListener("loadedmetadata", () => {
                audio.play();
            });
            audioRefs.current[userId] = audio;
        }
    };

    return (
        <div className="absolute mt-2 left-4 bg-slate-300 p-1 px-2 rounded-3xl z-30 text-black">
            {!friends ? (
                <Loader size={50} />
            ) : (
                <div className="flex gap-2">
                    <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {friends.map((friend) => {
                        if (onlineFriendIds && onlineFriendIds.includes(friend.id)) {
                            return (
                                <Avatar key={friend.id}>
                                    <AvatarImage src={friend.image} alt={friend.name} />
                                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                </Avatar>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
}
