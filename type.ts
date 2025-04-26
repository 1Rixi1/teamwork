import { Server as NetServer, Socket } from "net";

import { Server as ServerSocketIO } from "socket.io";

import { NextApiResponse } from "next";

import { Member, Profile, Server } from "@prisma/client";

export type ServerWithChannelsWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseSocketIO = NextApiResponse & {
  socket: Socket & {
    server: Server & {
      io: ServerSocketIO;
    };
  };
};
