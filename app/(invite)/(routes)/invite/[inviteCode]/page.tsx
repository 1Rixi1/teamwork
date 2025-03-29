import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { create } from "zustand";

const Page = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await currentProfile();

  if (!profile || !params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const addProfileToServer = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (addProfileToServer) {
    return redirect(`/server/${addProfileToServer.id}`);
  }

  return null;
};

export default Page;
