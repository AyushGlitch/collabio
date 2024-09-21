"use client";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendsStore } from "@/store/friends";
import { useUserStore } from "@/store/user";
import { CircleOffIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from 'peerjs';

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
    const [isRecording, setIsRecording] = useState(true);
    const peerRef = useRef<Peer | null>(null);
    const streamsRef = useRef<Record<string, MediaStream>>({});
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!socket) return;

        const peer = new Peer(user.id, {
            host: '/', // assuming your client is served from the same origin
            port: 8000,
            path: '/peerjs/myapp'
        });
        peerRef.current = peer;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                localStreamRef.current = stream;

                peer.on('open', (id) => {
                    console.log('My peer ID is: ' + id);
                    socket.emit('join-room', { boardId, userId: id });
                });

                peer.on('call', (call) => {
                    call.answer(stream);
                    call.on('stream', (remoteStream) => {
                        streamsRef.current[call.peer] = remoteStream;
                        const audio = new Audio();
                        audio.srcObject = remoteStream;
                        audio.play();
                    });
                });

                socket.on('user-joined', (users: string[]) => {
                    setOnlineFriendIds(users);
                    users.forEach(userId => {
                        if (userId !== peer.id && !streamsRef.current[userId]) {
                            const call = peer.call(userId, stream);
                            call.on('stream', (remoteStream) => {
                                streamsRef.current[userId] = remoteStream;
                                const audio = new Audio();
                                audio.srcObject = remoteStream;
                                audio.play();
                            });
                        }
                    });
                });

                socket.on('user-disconnected', (userId: string) => {
                    if (streamsRef.current[userId]) {
                        delete streamsRef.current[userId];
                    }
                    setOnlineFriendIds(prev => prev.filter(id => id !== userId));
                });
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
            });

        return () => {
            Object.values(streamsRef.current).forEach(stream => {
                stream.getTracks().forEach(track => track.stop());
            });
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            peer.destroy();
        };
    }, [socket, boardId, user.id]);

    const toggleRecording = useCallback(() => {
        setIsRecording((prev) => {
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach(track => {
                    track.enabled = !prev;
                });
            }
            return !prev;
        });
    }, []);

    return (
        <div className="absolute mt-2 left-4 bg-slate-300 p-1 px-2 rounded-3xl z-30 text-black">
            {!friends ? (
                <Loader size={50} />
            ) : (
                <div className="flex gap-2">
                    <Avatar className="hover:scale-110 duration-300 cursor-pointer" onClick={toggleRecording}>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                        <CircleOffIcon
                            className={`absolute h-full w-full bottom-0 right-0 text-red-500 ${
                                isRecording ? 'opacity-0' : 'opacity-100'
                            }`}
                        />
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