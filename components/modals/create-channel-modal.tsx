"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChannelType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import qs from "query-string";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Введите имя сервера",
    })
    .refine((name) => name !== "general", {
      message: "Вы не можете назвать канал 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
  const router = useRouter();

  const params = useParams();

  const { type, isOpen, onClose } = useModal();

  const isOpenModal = isOpen && type === "createChannel";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverId: params.serverId,
        },
      });

      await axios.post(url, values);

      router.refresh();
    } catch (err) {
      console.log("err -", err);
    }
  };

  const handleOpenChange = () => {
    form.reset();

    onClose();
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Создайте канал
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                        Введите название сервера
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 border-none"
                          placeholder="Ввдите название сервера"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel></FormLabel>

                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-300/50 w-full border-0 outline-none text-black ring-offset-0 focus:ring-offset-0 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {Object.values(ChannelType).map((type) => {
                            return (
                              <SelectItem
                                className="capitalize"
                                key={type}
                                value={type}
                              >
                                {type.toLowerCase()}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="cursor-pointer"
                variant="primary"
                disabled={isLoading}
              >
                Создать сервер
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
