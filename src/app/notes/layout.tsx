import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <div className="m-auto max-w-7xl">{children}</div>
      </main>
    </>
  );
}
