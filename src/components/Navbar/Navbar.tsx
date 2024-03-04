import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function Navbar() {
  return (
    <div className="p-4 shadow">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link href={"/"} className="flex items-center gap-x-2">
          <span className="text-2xl">NoteBot</span>
        </Link>

        <div className="flex items-center gap-6">
          <Button className="flex items-center gap-x-2">
            <PlusIcon />
            <span>Add Note</span>
          </Button>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: { width: "2rem", height: "2rem" } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
