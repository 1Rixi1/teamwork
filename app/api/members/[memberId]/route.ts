import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
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

    return NextResponse.json(server);
  } catch (err) {
    console.log("[MEMBER_ID_DELETE]", err);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    const { role } = await req.json();

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!role) {
      return new NextResponse("Role Missing", { status: 400 });
    }

    const updateServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              memberRole: role,
            },
          },
        },
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

    return NextResponse.json(updateServer);
  } catch (err) {
    console.log("[MEMBER_ID_PATCH]", err);
    return new NextResponse("Server Internal", { status: 500 });
  }
}
