import { NextApiRequest } from "next";
import { NextApiResponseSocketIO } from "@/type";
import { currentProfilePage } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

const sendMessage = async (
  req: NextApiRequest,
  res: NextApiResponseSocketIO,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePage(req);

    const { content, fileUrl } = req.body;

    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "UnAuthorized" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content Missing" });
    }

    if (!serverId) {
      return res.status(400).json({ message: "ServerId Missing" });
    }
    if (!channelId) {
      return res.status(400).json({ message: "ChannelId Missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server Not Found" });
    }

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel Not Found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ message: "Member Not Found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:message`;

    res.socket.server.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGE_POST]", err);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export default sendMessage;
