import { create } from "zustand";

type ModalType = "createServer";

type ModalStoreType = {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export const useModal = create<ModalStoreType>((set) => {
  return {
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, type: null }),
  };
});
