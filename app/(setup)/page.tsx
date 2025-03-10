import React from "react";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModel from "@/components/models/initial-model";

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

  return <InitialModel />;
};

export default Page;
