"use client";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BotIcon, SendHorizonalIcon } from "lucide-react";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import LoadingDots from "@/components/LoadingDots";

interface ChatBoxProps {
  open: boolean;
  onClose?: () => void;
}

export const Chatbox = ({ open, onClose }: ChatBoxProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat();

  const { user } = useUser();

  return (
    <>
      <div
        className={cn(
          "h-[500px] w-full max-w-80 rounded-lg border bg-background px-4 py-6 shadow-xl md:max-w-[450px]",
          `${open ? "fixed bottom-28 right-4 z-50 flex flex-col md:right-8" : "hidden"}`,
        )}
      >
        <div className="mb-4 flex-1 overflow-y-scroll pr-4">
          <div className="mb-4 flex gap-x-2">
            <div className="h-fit w-fit self-end rounded-full border p-2">
              <BotIcon className="h-5 w-5" />
            </div>
            <div className="rounded-lg bg-gray-200 px-4 py-2">
              <span>How can I assist you today?</span>
            </div>
          </div>

          {messages.map((message) => (
            <ChatMessage
              message={message}
              key={message.id}
              imageUrl={user?.imageUrl}
            />
          ))}
          {isLoading && (
            <div className="flex gap-x-2">
              <div className="h-fit w-fit self-end rounded-full border p-2">
                <BotIcon className="h-5 w-5" />
              </div>
              <div className="flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-auto flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something"
          />
          <Button type="submit" className="gap-x-1">
            Send <SendHorizonalIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
};

function ChatMessage({
  message: { role, content },
  imageUrl,
}: {
  message: Message;
  imageUrl?: string;
}) {
  return (
    <div
      className={`mb-6 flex gap-x-2 ${role === "assistant" ? "flex-row-reverse justify-end" : "row justify-end"}`}
    >
      <div
        className={`rounded-lg px-4 py-2 ${role === "assistant" ? "bg-gray-200" : "bg-teal-700 text-white"}`}
      >
        {content}
      </div>
      <div>
        {role === "assistant" ? (
          <div className="h-fit w-fit self-end rounded-full border p-2">
            <BotIcon className="h-5 w-5" />
          </div>
        ) : (
          imageUrl && (
            <Image
              loader={() => imageUrl}
              src={imageUrl}
              width={38}
              height={38}
              alt="user"
              className="h-[38px] w-[38px] self-end rounded-full object-cover"
            />
          )
        )}
      </div>
    </div>
  );
}
