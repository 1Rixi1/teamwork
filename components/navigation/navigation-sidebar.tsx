import React from "react";
import NavigationAction from "@/components/navigation/navigation-action";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/navigation-item";
import { ModeToggle } from "@/components/toggle-theme";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="h-full w-full flex flex-col items-center py-3 space-y-4 dark:bg-[#1E1F22] bg-[#e2e3e8]">
      <NavigationAction />
      <Separator className="h-[2px] w-10 bg-zinc-300 dark:bg-zinc-700 px-3 rounded-md" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => {
          return (
            <div key={server.id} className="mb-4">
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </div>
          );
        })}
      </ScrollArea>

      <div className="flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />

        <UserButton afterSignOutUrl={"/"} />
      </div>
    </div>
  );
};

export default NavigationSidebar;
