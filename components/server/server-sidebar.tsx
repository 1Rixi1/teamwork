import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ServerSection from "@/components/server/server-section";
import ServerChannel from "@/components/server/server-channel";
import ServerMember from "@/components/server/server-member";

const channelIcons = {
  [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIcons = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        orderBy: {
          memberRole: "asc",
        },
        include: {
          profile: true,
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const currentProfileRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.memberRole;

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} currentProfileRole={currentProfileRole!} />

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Текстовые каналы",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Голосовые каналы",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Видео каналы",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons[channel.type],
                })),
              },
              {
                label: "Участники",
                type: "member",
                data: members.map((member) => ({
                  id: member.profile.id,
                  name: member.profile.name,
                  icon: roleIcons[member.memberRole],
                })),
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Текстовые каналы"
              sectionType="channels"
              role={currentProfileRole}
              channelType={ChannelType.TEXT}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentProfileRole!}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Голосовые каналы"
              sectionType="channels"
              role={currentProfileRole}
              channelType={ChannelType.AUDIO}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentProfileRole!}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Видео каналы"
              sectionType="channels"
              role={currentProfileRole}
              channelType={ChannelType.VIDEO}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={currentProfileRole!}
                />
              ))}
            </div>
          </div>
        )}

        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              label="Участники"
              sectionType="members"
              role={currentProfileRole}
              server={server}
            />

            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
