"use client";

import React from "react";
import { Plus } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";

const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip label="Добавить сервер" side="right" align={"center"}>
        <button className="group cursor-pointer">
          <div className="w-[48px] h-[48px] rounded-[24px] flex items-center justify-center transition-all dark:bg-neutral-500 bg-[#F2F3F5] group-hover:rounded-[16px] group-hover:bg-emerald-500 group-hover:text-emerald-500">
            <Plus
              className="text-emerald-500 group-hover:text-white transition-all"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
