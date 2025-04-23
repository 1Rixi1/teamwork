import { create } from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export type ModalType =
  | "createServer"
  | "invite"
  | "edit"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel";

type ModalData = {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
};

type ModalStoreType = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, server?: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStoreType>((set) => {
  return {
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null }),
  };
});
