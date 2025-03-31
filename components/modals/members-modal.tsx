"use client";
import React, { useState } from "react";
import { z } from "zod";

import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { ServerWithChannelsWithProfile } from "@/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Введите имя сервера",
  }),
  imageUrl: z.string().min(1, {
    message: "Загрузите фотографию для сервера",
  }),
});

const roleIcon = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

const MembersModal = () => {
  const router = useRouter();

  const { type, isOpen, onClose, onOpen, data } = useModal();

  const [loadingId, setLoadingId] = useState("");

  const { server } = data as { server: ServerWithChannelsWithProfile };

  const isOpenModal = type === "members" && isOpen;

  const onChangeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const request = await axios.patch(url, { role });
      router.refresh();

      onOpen("members", { server: request.data });
    } catch (err) {
      console.log("onChangeRole err ---", err);
    } finally {
      setLoadingId("");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();

      onOpen("members", { server: response.data });
    } catch (err) {
      console.log("handleDeleteMember err ---", err);
    } finally {
      setLoadingId("");
    }
  };

  if (!server) {
    return null;
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Управление участниками
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Участники {server.members.length}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server.members.map((member) => {
              return (
                <div className="flex items-center gap-x-2 mb-6" key={member.id}>
                  <UserAvatar src={member.profile.imageUrl} />

                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-1 font-semibold text-xs">
                      {member.profile.name}
                      {roleIcon[member.memberRole]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member.profile.email}
                    </p>
                  </div>

                  {member.profileId !== server.profileId &&
                    loadingId !== member.id && (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="w-4 h-4 text-zinc-500 cursor-pointer" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>

                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onChangeRole(member.id, "GUEST")
                                    }
                                  >
                                    <Shield className="w-4 h-4 mr-2" />

                                    <span>GUEST</span>

                                    {member.memberRole === "GUEST" && (
                                      <Check className="w-4 h-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() =>
                                      onChangeRole(member.id, "MODERATOR")
                                    }
                                  >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    <span>MODERATOR</span>

                                    {member.memberRole === "MODERATOR" && (
                                      <Check className="w-4 h-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Gavel className="w-4 h-4 " />
                              Kick
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}

                  {loadingId === member.id && (
                    <Loader2 className="w-4 h-4 ml-auto text-zinc-500 animate-spin" />
                  )}
                </div>
              );
            })}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
