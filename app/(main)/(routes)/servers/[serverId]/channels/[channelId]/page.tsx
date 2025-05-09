import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";

type ChannelIdProps = {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
};

const Page = async ({ params }: ChannelIdProps) => {
  const { serverId, channelId } = await params;

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#313338]">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />
      <div className="flex-1"></div>
      <ChatInput
        name={channel.name}
        type="channel"
        query={{
          serverId: channel.serverId,
          channelId: channel.id,
        }}
        apiUrl="/api/socket/messages"
      />
    </div>
  );
};

export default Page;
