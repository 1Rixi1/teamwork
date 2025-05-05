"use client";
import React from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

import axios from "axios";

import qs from "query-string";
import { useModal } from "@/hooks/use-modal";
import EmojiPicket from "@/components/emoji-picket";
import { useRouter } from "next/navigation";

type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter();

  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    className="absolute top-7 left-8 h-[24px] w-[24px] flex items-center justify-center 
                  bg-zinc-600 hover:bg-zinc-500 dark:bg-zinc-400 dark:hover:bg-zinc-300 
                  rounded-full p-1 transition"
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>

                  <Input
                    className="px-14 py-6 border-none border-0 bg-zinc-200/90 text-zinc-600 dark:bg-zinc-700/75 dark:text-zinc-200
                  focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                    disabled={isLoading}
                    placeholder={`Messages ${
                      type === "channel" ? "#" + name : name
                    }`}
                  />

                  <div className="absolute top-7 right-8">
                    <EmojiPicket
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
