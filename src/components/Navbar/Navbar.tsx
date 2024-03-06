"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import ThemeToggle from "@/components/Themetoggle";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function Navbar() {
  const [openCreateNoteDialog, setOpenCreateNoteDialog] =
    useState<boolean>(false);

  const { theme } = useTheme();

  return (
    <>
      <div className="border-b p-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href={"/"} className="flex items-center gap-x-3">
            <Image
              src={"/assets/NoteBot-logo.svg"}
              width={40}
              height={40}
              alt="logo"
            />
            <span className="text-2xl">NoteBot</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2rem", height: "2rem" } },
              }}
            />
            <Button
              className="flex items-center gap-x-2"
              onClick={() => setOpenCreateNoteDialog(true)}
            >
              <PlusIcon />
              <span>Add Note</span>
            </Button>
          </div>
        </div>
      </div>

      <CreateNoteDialog
        open={openCreateNoteDialog}
        setOpen={setOpenCreateNoteDialog}
        type="Add"
      />
    </>
  );
}
