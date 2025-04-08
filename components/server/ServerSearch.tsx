"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

type ServerSearchProps = {
  data: {
    label: string;
    type: "member" | "channel";
    data: {
      id: string;
      name: string;
      icon: React.ReactNode;
    }[];
  }[];
};

const ServerSearch = ({ data }: ServerSearchProps) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prevState) => !prevState);
      }
    };

    document.addEventListener("keydown", handleDown);

    return () => document.removeEventListener("keydown", handleDown);
  }, []);

  const handleRedirect = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "channel") {
      return router.push(`/servers/${params.serverId}/conversations/${id}`);
    }

    if (type === "member") {
      return router.push(`/servers/${params.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        className="group flex items-center px-2 py-2 gap-x-2 w-full cursor-pointer bg-zinc-700/10 dark:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="inline-flex items-center pointer-events-none select-none border px-1.5 text-[10px] ml-auto font-medium ">
          <span className="text-xs mr-1">ALT</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Начните поиск по каналам или участникам" />

        <CommandList>
          <CommandEmpty>Поиск не дал результата</CommandEmpty>

          {data.map(({ data, type, label }) => {
            if (data.length === 0) {
              return null;
            }

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => handleRedirect({ id, type })}
                  >
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
