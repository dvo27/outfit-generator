"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Atom, DoorClosed, Bookmark, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Hide sidebar on login page
  if (pathname === "/api/auth/signin" || !session) {
    return null;
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileSidebar}
          className="bg-white"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar className="border-r transition-all duration-300 flex flex-col items-stretch w-64">
          <SidebarHeader className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 w-full justify-center">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded" />
              <span className="font-bold text-lg">Alphet</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/"}>
                      <Link href="/" className="flex items-center gap-2">
                        <Atom className="h-4 w-4" />
                        <span>Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/closet"}>
                      <Link href="/closet" className="flex items-center gap-2">
                        <DoorClosed className="h-4 w-4" />
                        <span>Closet</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/saved"}>
                      <Link href="/saved" className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        <span>Saved Outfits</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            {session?.user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {session.user.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded" />
            <span className="font-bold text-lg">Alphet</span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeMobileSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            <Link
              href="/"
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                pathname === "/" ? "bg-gray-100" : ""
              }`}
              onClick={closeMobileSidebar}
            >
              <Atom className="h-4 w-4" />
              <span>Generator</span>
            </Link>
            <Link
              href="/closet"
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                pathname === "/closet" ? "bg-gray-100" : ""
              }`}
              onClick={closeMobileSidebar}
            >
              <DoorClosed className="h-4 w-4" />
              <span>Closet</span>
            </Link>
            <Link
              href="/saved"
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                pathname === "/saved" ? "bg-gray-100" : ""
              }`}
              onClick={closeMobileSidebar}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved Outfits</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                pathname === "/settings" ? "bg-gray-100" : ""
              }`}
              onClick={closeMobileSidebar}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {session?.user && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {session.user.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}