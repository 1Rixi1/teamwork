import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";

type MemberIdProps = {
  params: {
    serverId: string;
    memberId: string;
  };
};

const Page = async ({ params }: MemberIdProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },

    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return null;
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default Page;
