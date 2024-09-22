"use client";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendsStore } from "@/store/friends";
import { useUserStore } from "@/store/user";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

export default function VoiceChat({
    socket,
    boardId,
}: {
    socket: Socket | null;
    boardId: string;
}) {
    const user = useUserStore((state) => state.getUser());
    const [friends, setFriends] = useFriendsStore((state) => [state.getFriends(), state.setFriends]);
    const [onlineFriendIds, setOnlineFriendIds] = useState<string[]>([]);
    const peerInstance = useRef<Peer | null>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!socket || !user.id) return;

        let peer: Peer | null = null;

        // Initialize PeerJS and join the room
        const initializePeer = async () => {
            try {
                // Get user's audio stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                console.log("Got audio stream: ", stream);

                // Create a new Peer instance with the user's ID only if it doesn't exist
                if (!peerInstance.current) {
                    peer = new Peer(user.id);
                    peerInstance.current = peer;
                    console.log("Peer initialized", peer);

                    // Handle incoming calls
                    peer.on("call", (call) => {
                        console.log("Incoming call from: ", call.peer);
                        call.answer(stream);
                        call.on("stream", (userAudioStream) => {
                            playAudioStream(call.peer, userAudioStream);
                        });
                    });
                } else {
                    peer = peerInstance.current;
                }

                // Join the voice room with socket
                socket.emit("join-voice-room", boardId, user.id);

                // Listen for users joining the voice room
                socket.on("user-joined-voice", (users: string[]) => {
                    console.log("Users in room: ", users);
                    const onlineIdsExceptSelf = users.filter((id) => id !== user.id);
                    setOnlineFriendIds(onlineIdsExceptSelf);
                });

                // Handle new users joining and initiate calls
                socket.on("new-user-voice", (userId: string) => {
                    console.log("New user joined: ", userId);
                    if (peer && stream) {
                        const call = peer.call(userId, stream);
                        call?.on("stream", (userAudioStream) => {
                            playAudioStream(userId, userAudioStream);
                        });
                    }
                });
            } catch (err) {
                console.error("Failed to initialize peer or get audio stream", err);
            }
        };

        initializePeer();

        // Clean up function
        return () => {
            if (peerInstance.current) {
                peerInstance.current.destroy();
                peerInstance.current = null;
            }
            if (socket) {
                socket.off("user-joined-voice");
                socket.off("new-user-voice");
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [socket, user.id, boardId]);

    useEffect(() => {
        if (!socket) return;

        // Initialize PeerJS and join the room
        const initializePeer = async () => {
            try {
                // Get user's audio stream
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                console.log("Got audio stream: ", stream);

                // Create a new Peer instance with the user's ID
                const peer = new Peer(user.id);
                peerInstance.current = peer;
                console.log("Peer initialized", peer);

                // Join the voice room with socket
                socket.emit("join-voice-room", boardId, user.id);

                // Handle incoming calls
                peer.on("call", (call) => {
                    console.log("Incoming call from: ", call.peer);
                    call.answer(stream);
                    call.on("stream", (userAudioStream) => {
                        playAudioStream(call.peer, userAudioStream);
                    });
                });

                // Listen for users joining the voice room
                socket.on("user-joined-voice", (users: string[]) => {
                    console.log("Users in room: ", users)
                    const onlineIdsExceptSelf= users.filter((id) => id !== user.id)
                    setOnlineFriendIds(onlineIdsExceptSelf) 
                });

                // Handle new users joining and initiate calls
                socket.on("new-user-voice", (userId: string) => {
                    console.log("New user joined: ", userId);
                    const call = peer.call(userId, stream);
                    call?.on("stream", (userAudioStream) => {
                        playAudioStream(userId, userAudioStream);
                    });
                });

                // Clean up on component unmount
                return () => {
                    peer.destroy();
                    socket.off("user-joined-voice");
                    // socket.off("new-user-voice");
                    // stream.getTracks().forEach((track) => track.stop());
                };
            } catch (err) {
                console.error("Failed to initialize peer or get audio stream", err);
            }
        };

        initializePeer();

        // Ensure clean up if socket changes
    }, []);

    // Function to play audio streams for connected peers
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
            {friends.length === 0 ? (
                <Loader size={50} />
            ) : (
                <div className="flex gap-2">
                    <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {
                        onlineFriendIds.map( (id) => {
                            const friend= friends.find((f) => f.id === id)
                            return (
                                <Avatar key={id}>
                                    <AvatarImage src={friend?.image} alt={friend?.name} />
                                    <AvatarFallback>{friend?.name[0]}</AvatarFallback>
                                </Avatar>
                            )
                        } )
                    }
                </div>
            )}
        </div>
    );
}
