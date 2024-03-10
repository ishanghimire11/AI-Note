"use client";

import React, { useState } from "react";
import { Bot, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Chatbox from "@/components/Chatbox";

export const ChatButton = () => {
  const [chatboxOpen, setChatBoxOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        className={cn(
          "fixed bottom-8 right-4 h-16 w-16 rounded-full transition-all duration-300 md:right-8",
        )}
        onClick={() => setChatBoxOpen((prev) => !prev)}
        aria-label="open-chat"
      >
        {!chatboxOpen && (
          <span className="absolute -top-1 left-2 z-auto h-5 w-5 animate-pulse rounded-full bg-teal-600"></span>
        )}
        {chatboxOpen ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
      </Button>
      <Chatbox open={chatboxOpen} />
    </>
  );
};
