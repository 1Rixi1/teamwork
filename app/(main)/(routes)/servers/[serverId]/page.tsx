import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { channel } from "diagnostics_channel";

type ServerIdProps = {
  params: Promise<{ serverId: string }>;
};

const Page = async ({ params }: ServerIdProps) => {
  const { serverId } = await params;

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },

    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannels = server?.channels[0];

  if (initialChannels?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannels.id}`);
};

export default Page;
