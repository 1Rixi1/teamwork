import React from "react";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });

  if (server) {
    redirect(`servers/${server.id}`);
  }

  return <div>Create new Server !</div>;
};

export default Page;
