"use client";
import React, { useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
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

const InviteModal = () => {
  const router = useRouter();

  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { type, isOpen, onClose, onOpen, data } = useModal();

  const { server } = data;

  const origin = useOrigin();

  const inviteLink = `${origin}/invite/${server && server.inviteCode}`;

  const isOpenModal = type === "invite" && isOpen;

  const handleCopiedLink = () => {
    console.log(123);
    setCopiedLink(true);

    window.navigator.clipboard.writeText(inviteLink);

    setTimeout(() => {
      setCopiedLink(false);
    }, 1500);
  };

  const generateNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (err) {
      console.log("err invite-code", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Создайте свой сервер
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-sm text-black dark:text-zinc-500 font-semibold">
            Пригласить пользователя
          </Label>

          <div className="flex items-center gap-x-2 mt-2">
            <Input
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50"
              value={inviteLink}
            />
            <Button
              className="cursor-pointer"
              size="icon"
              onClick={handleCopiedLink}
              disabled={isLoading}
            >
              {copiedLink ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            className="text-xs text-zinc-500 mt-4 cursor-pointer"
            variant="link"
            size="sm"
            onClick={generateNewLink}
            disabled={isLoading}
          >
            Создать новую ссылку
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
