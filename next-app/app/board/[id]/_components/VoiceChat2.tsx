"use client";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendsStore } from "@/store/friends";
import { useUserStore } from "@/store/user";
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

        const initializePeer = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const peer = new Peer(user.id);
                peerInstance.current = peer;

                peer.on('open', (id) => {
                    console.log('My peer ID is: ' + id);
                    socket.emit("join-voice-room", boardId, id);
                });

                peer.on("call", (call) => {
                    call.answer(stream);
                    call.on("stream", (userAudioStream) => {
                        playAudioStream(call.peer, userAudioStream);
                    });
                });

                socket.on("user-joined-voice", (users: string[]) => {
                    console.log("Users in voice chat:", users);
                    setOnlineFriendIds(users);
                });

                socket.on("new-user-voice", (userId: string) => {
                    console.log("New user joined voice:", userId);
                    const call = peer.call(userId, stream);
                    call.on("stream", (userAudioStream) => {
                        playAudioStream(userId, userAudioStream);
                    });
                });

                return () => {
                    peer.destroy();
                    socket.off("user-joined-voice");
                    socket.off("new-user-voice");
                    stream.getTracks().forEach((track) => track.stop());
                };
            } catch (err) {
                console.error("Failed to initialize peer or get audio stream", err);
            }
        };

        initializePeer();
    }, [socket, boardId, user]);

    const playAudioStream = (userId: string, stream: MediaStream) => {
        if (!audioRefs.current[userId]) {
            const audio = new Audio();
            audio.srcObject = stream;
            audio.addEventListener("loadedmetadata", () => {
                audio.play().catch((e) => console.error("Audio playback failed", e));
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
                        if (onlineFriendIds.includes(friend.id)) {
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