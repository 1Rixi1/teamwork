"use client";
import React, { useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { Label } from "@/components/ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Введите имя сервера",
  }),
  imageUrl: z.string().min(1, {
    message: "Загрузите фотографию для сервера",
  }),
});

const DeleteServerModal = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { type, isOpen, onClose, onOpen, data } = useModal();

  const { server } = data;

  const isOpenModal = type === "deleteServer" && isOpen;

  const handleDeleteServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);

      router.refresh();
      router.push("/");
      onClose();
    } catch (err) {
      console.log("handleLeaveServer err ---", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Выйти с сервера
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Вы действительно хотите удалить сервер{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name} ?
              <br />
            </span>
            Он будет удален безвозвратно
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={isLoading}
              onClick={onClose}
            >
              Отмена
            </Button>

            <Button
              className="cursor-pointer"
              variant="primary"
              onClick={handleDeleteServer}
              disabled={isLoading}
            >
              Подтвердить
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
