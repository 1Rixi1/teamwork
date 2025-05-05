"use client";

import React from "react";

import Picker from "@emoji-mart/react";

import data from "@emoji-mart/data";

import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

type EmojiPicketProps = {
  onChange: (value: string) => void;
};

const EmojiPicket = ({ onChange }: EmojiPicketProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zink-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>

      <PopoverContent
        className="mb-16 bg-transparent border-none shadow-none drop-shadow-none"
        side="right"
        sideOffset={40}
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicket;
