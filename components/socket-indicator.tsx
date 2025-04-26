"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { SocketContext } from "@/components/provider/socket-provider";
const SocketIndicator = () => {
  const { isConnected } = SocketContext();

  if (!isConnected) {
    return (
      <Badge className="bg-yellow-600 text-white border-none" variant="outline">
        Fallback: Polling 1s
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-600 text-white border-none" variant="outline">
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;
