import { Server as NetServer } from "http";

import { Server as ServerIO } from "socket.io";

import { NextApiRequest } from "next";
import { NextApiResponseSocketIO } from "@/type";

const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseSocketIO) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";

    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
