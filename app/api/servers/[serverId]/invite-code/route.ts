import React from "react";

import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const updateServerInviteCode = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            memberRole: "asc",
          },
        },
      },
    });

    return NextResponse.json(updateServerInviteCode);
  } catch (err) {
    console.log("[SERVER_ID_PATCH_INVITE_CODE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
