import { Profile, Server, Member } from "@prisma/client";

export type ServerWithChannelsWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
