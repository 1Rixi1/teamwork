"use client";
import React from "react";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type NavigationItemType = {
  id: string;
  name: string;
  imageUrl: string;
};

const NavigationItem = ({ id, name, imageUrl }: NavigationItemType) => {
  const params = useParams();

  const router = useRouter();

  const handleClickButton = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <button
      className="relative group flex items-center cursor-pointer"
      onClick={handleClickButton}
    >
      <div
        className={cn(
          "absolute left-[0px] w-[4px] bg-white rounded-r-full transition-all",
          id !== params.serverId && "group-hover:h-[20px]",
          id === params.serverId ? "h-[36px]" : "h-[8px]"
        )}
      />
      <ActionTooltip label={name} side={"right"} align={"center"}>
        <div
          className={cn(
            "relative left-[12px] w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            id === params.serverId && "rounded-[16px] text-white/10 bg-white"
          )}
        >
          <Image fill src={imageUrl} alt={name} />
        </div>
      </ActionTooltip>
    </button>
  );
};

export default NavigationItem;
