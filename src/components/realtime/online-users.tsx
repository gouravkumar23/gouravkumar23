"use client";
import React, { useContext, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

import { SocketContext, type User } from "@/contexts/socketio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Check, Edit, X } from "lucide-react";
import { Socket } from "socket.io-client";
import { cn } from "@/lib/utils";

const OnlineUsers = () => {
  const { socket, users: _users, msgs } = useContext(SocketContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const users = Array.from(_users.values());

  const containerScrollBottom = () => {
    const t = setTimeout(() => {
      if (chatContainer.current) {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
      }
      clearTimeout(t);
    }, 1);
  };
  useEffect(containerScrollBottom, [msgs]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const sendMessage = () => {
    if (!inputRef.current?.value) return;
    const msg = inputRef.current.value;
    inputRef.current.value = "";

    if (msg.trim() === "") return;
    socket?.emit("msg-send", {
      content: msg,
    });
  };
  const updateUsername = (newName: string) => {
    socket?.emit("username-change", {
      username: newName,
    });
    localStorage.setItem("username", newName);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "p-0 m-0 mr-4 h-fit w-fit transition-opacity duration-150",
            users.length <= 1 ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2 h-fit">
              <div className="w-2 h-2 animate-pulse rounded-full bg-green-400"></div>
              <span className="text-xs md:text-sm">{users.length} online</span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-32px)] sm:w-80 mx-4 sm:mx-0">
        <Tabs
          defaultValue="users"
          className="w-full h-[30rem] flex flex-col items-center no-hover-zone"
          onValueChange={(activeTab) => {
            if (activeTab === "chat") containerScrollBottom();
          }}
        >
          <TabsList className="w-full h-8">
            <TabsTrigger className="w-1/2 h-full" value="users">
              Users
            </TabsTrigger>
            <TabsTrigger className="w-1/2 h-full" value="chat">
              Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="w-full h-full overflow-auto">
            <ScrollArea className="w-full h-full modall">
              <motion.div>
                <div className="space-y-2 mb-8">
                  <p className="text-sm text-muted-foreground text-center">
                    There {users.length === 1 ? "is" : "are"} {users.length}{" "}
                    user
                    {users.length === 1 ? "" : "s"} online here!
                  </p>
                </div>
                <motion.ul
                  className="grid gap-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {users.map((user, i) => (
                    <UserItem
                      key={i}
                      user={user}
                      socket={socket}
                      updateUsername={updateUsername}
                    />
                  ))}
                </motion.ul>
              </motion.div>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="chat"
            className="w-full flex-1 overflow-auto flex flex-col"
          >
            <div
              className="w-full h-full modall overflow-auto p-2"
              ref={chatContainer}
            >
              {msgs.map((msg, i) => (
                <div key={i} className="mb-2 text-sm">
                  <span>
                    <span
                      style={{
                        color:
                          users.find((u) => u.socketId === msg.socketId)
                            ?.color || "#777",
                      }}
                      className="mr-2 font-bold"
                    >
                      {msg.username} {msg.socketId === socket?.id && "(you)"}:
                    </span>
                    <span className="font-mono break-words">{msg.content}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full h-20 flex items-center gap-2 p-2 border-t border-zinc-800">
              <Input
                className="flex-1 h-9 text-sm"
                ref={inputRef}
                placeholder="Enter message"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button size="sm" onClick={sendMessage}>Send</Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default OnlineUsers;

const UserItem = ({
  user,
  socket,
  updateUsername,
}: {
  user: User;
  socket: Socket | null;
  updateUsername: (username: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState(user.name);
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  useEffect(() => {
    if (inputRef.current && isEditingName) inputRef.current.focus();
  }, [isEditingName]);
  const cancelEditing = () => {
    setNewUsername(user.name);
    setIsEditingName(false);
  };
  const saveEdit = () => {
    updateUsername(newUsername);
    setIsEditingName(false);
  };
  return (
    <motion.li
      key={user.socketId}
      className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
      variants={item}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
          style={{ backgroundColor: user.color }}
        ></div>
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <Input
              value={newUsername}
              ref={inputRef}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-32 h-8 text-xs"
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
            <Button variant={"ghost"} size="icon" className="h-8 w-8" onClick={cancelEditing}>
              <X className="w-3 h-3" />
            </Button>
            <Button variant={"ghost"} size="icon" className="h-8 w-8 text-green-500" onClick={saveEdit}>
              <Check className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {user.name} {user.socketId === socket?.id && <span className="text-zinc-500 text-[10px]">(you)</span>}
            </span>
            {user.socketId === socket?.id && (
              <Button
                variant={"ghost"}
                size="icon"
                className="h-6 w-6 text-zinc-500 hover:text-white"
                onClick={() => setIsEditingName(true)}
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );
};