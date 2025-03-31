import { create } from "zustand";
import { Server } from "@prisma/client";

type ModalType = "createServer" | "invite" | "edit" | "members";

type ModalData = {
  server?: Server;
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
