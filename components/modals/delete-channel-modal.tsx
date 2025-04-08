"use client";
import React, { useState } from "react";
import { z } from "zod";

import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Введите имя сервера",
  }),
  imageUrl: z.string().min(1, {
    message: "Загрузите фотографию для сервера",
  }),
});

const DeleteChannelModal = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { type, isOpen, onClose, data } = useModal();

  const { server, channel } = data;

  const isOpenModal = type === "deleteChannel" && isOpen;
  console.log("channel", channel);
  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });

      await axios.delete(url);

      router.refresh();
      router.push(`/servers/${server?.id}`);
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
            Вы действительно хотите удалить канал{" "}
            <span className="font-semibold text-indigo-500">
              #{channel?.name} ?
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
              onClick={handleDeleteChannel}
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

export default DeleteChannelModal;
