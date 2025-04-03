import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";


export async function POST(req: Request) {
  const { name, imageUrl } = await req.json();
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ profileId: profile.id, name: "general" }],
        },
        members: {
          create: [{ profileId: profile.id, memberRole: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("[SERVERS_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
