import React from "react";
import { Hash } from "lucide-react";
import ToggleMenu from "@/components/toggle-menu";
import UserAvatar from "@/components/user-avatar";
import SocketIndicator from "@/components/socket-indicator";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
};

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex items-center font-semibold text-xl h-12 px-3 border-b-2  border-neutral-200 dark:border-neutral-800">
      <ToggleMenu serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar className="w-8 h-8 md:w-8 md:h-8 mr-2" src={imageUrl} />
      )}
      <p className="text-xl font-semibold text-black dark:text-white">{name}</p>

      <div className="flex items-center ml-auto">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
