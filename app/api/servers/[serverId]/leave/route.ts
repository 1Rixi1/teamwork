import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    console.log(8888);
    const profile = await currentProfile();

    const serverId = params.serverId;

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("LEAVE_SERVER_DELETE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
