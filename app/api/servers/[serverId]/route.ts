import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    const serverId = params.serverId;

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("SERVER_DELETE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const updateServer = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(updateServer);
  } catch (err) {
    console.log("[SERVER_ID_PATCH]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
