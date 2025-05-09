"use client";
import React from "react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal";

type ServerChannelPropsType = {
  channel: Channel;
  server: Server;
  role: MemberRole;
};

const channelIcon = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelPropsType) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const Icon = channelIcon[channel.type];

  const handleNavigate = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const handleModalOpen = (e: React.MouseEvent, type: ModalType) => {
    e.stopPropagation();
    onOpen(type, { server, channel });
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 flex items-center gap-x-2 w-full mb-1 cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50  transition",
        params?.channelId === channel.id && "dark:bg-zinc-700/20 bg-zinc-700"
      )}
      onClick={handleNavigate}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />

      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>

      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Настройки">
            <Edit
              className="hidden group-hover:block w-4 h-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300"
              onClick={(e) => handleModalOpen(e, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label="Удалить">
            <Trash
              className="hidden group-hover:block w-4 h-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300"
              onClick={(e) => handleModalOpen(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
