import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import { LogInIcon } from "lucide-react";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/notes");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div>
        <Image
          src={"/assets/landing-page-image.png"}
          width={1920}
          height={1080}
          alt="landing page image"
          className="h-96 w-96"
        />
      </div>
      <h1 className="pb-6 pt-8 text-5xl font-semibold">
        Talk Notes with chatbot.
      </h1>
      <Link
        href={"/notes"}
        className="inline-flex h-10 items-center justify-center gap-x-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <LogInIcon />
        Sign in
      </Link>
    </div>
  );
}
