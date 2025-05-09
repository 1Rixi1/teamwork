"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";

type ServerMemberPropsType = {
  member: Member & { profile: Profile };
  server: Server;
};

const roleIcon = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerMember = ({ member, server }: ServerMemberPropsType) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIcon[member.memberRole];

  const handleNavigate = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
  };

  return (
    <button
      className={cn(
        "group flex items-center px-2 py-2 gap-x-2 w-full cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params.memberId === member.id && "bg-zinc-700 dark:bg-zinc-700/20"
      )}
      onClick={handleNavigate}
    >
      <UserAvatar className="w-8  h-8" src={member.profile.imageUrl} />

      <p
        className={cn(
          "font-semibold text-sm text-zinc-500" +
            "group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params.memberId === member.id &&
            "dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
};

export default ServerMember;
