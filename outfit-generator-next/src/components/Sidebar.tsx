"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo and Title */}
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded" />
          <span className="font-bold text-xl">Alphet</span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link href="/" className="font-medium hover:text-indigo-600">Generator</Link>
          <Link href="/closet" className="font-medium hover:text-indigo-600">Closet</Link>
          <Link href="/saved" className="font-medium hover:text-indigo-600">Saved Outfits</Link>
          <Link href="/settings" className="font-medium hover:text-indigo-600">Settings</Link>
        </nav>
      </div>
      {/* User Info */}
      {session?.user && (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{session.user.name}</div>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}