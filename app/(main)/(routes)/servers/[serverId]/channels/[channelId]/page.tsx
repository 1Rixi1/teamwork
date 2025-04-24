import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/chat-header";

type ChannelIdProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const Page = async ({ params }: ChannelIdProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default Page;
