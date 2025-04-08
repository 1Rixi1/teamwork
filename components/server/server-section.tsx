"use client";

import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithChannelsWithProfile } from "@/type";
import ActionTooltip from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

type ServerSection = {
  label: string;
  sectionType: "members" | "channels";
  role?: MemberRole;
  channelType?: ChannelType;
  server?: ServerWithChannelsWithProfile;
};

const ServerSection = ({
  label,
  sectionType,
  role,
  channelType,
  server,
}: ServerSection) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Создать канал" side="top">
          <button
            className="cursor-pointer text-zinc-500 hover:text-zinc-600
           dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Управление участниками" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("members", { server })}
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
