"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import logo from "../../public/logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const menuLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Services",
    href: "/services",
    subLinks: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Development", slug: "mobile-development" },
      { name: "SEO Services", slug: "seo-services" },
      { name: "Consulting", slug: "consulting" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Create Post",
    href: "/create-post",
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <>
      <div className="bg-white py-2 border-b border-slate-200">
        <nav className="container flex items-center gap-4">
          <div className="logo flex-1">
            <Image src={logo} alt="logo" width={130} height={100} />
          </div>
          <div className="nav-center hidden lg:block">
            <ul className="flex items-center justify-start gap-6">
              {menuLinks.map((link) => (
                <li key={link.name} className="font-semibold">
                  {link.subLinks ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus-visible:outline-none">
                        <span className="cursor-pointer flex items-center gap-1">
                          {link.name} <MdKeyboardArrowDown />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mt-3">
                        {link.subLinks.map((subLink) => (
                          <DropdownMenuItem key={subLink.slug}>
                            <Link href={`/${link.name.toLowerCase()}/${subLink.slug}`}>
                              {subLink.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={link.href} className="">{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-right flex items-center gap-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session?.user?.image || "../../public/logo.png"}
                        alt={session?.user?.name ?? "User"}
                        onError={(e) => {
                          e.currentTarget.src = "../../public/logo.png"; // Fallback image on error
                        }}
                      />

                      <AvatarFallback>{session.user.name ? session.user.name[0] : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => signIn('google')}>
                Sign In
              </Button>
            )}
            <div className="menu-btn lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button><HiMenuAlt3 className="w-6 h-6" /></Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <ul className="flex flex-col items-start justify-start divide-y-2 w-full">
                      {menuLinks.map((link) => (
                        <li key={link.name} className="w-full py-3 font-semibold">
                          {link.subLinks ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="focus-visible:outline-none">
                                <span className="cursor-pointer flex items-center gap-1">
                                  {link.name} <MdKeyboardArrowDown />
                                </span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="mt-3 w-64">
                                {link.subLinks.map((subLink) => (
                                  <DropdownMenuItem key={subLink.slug}>
                                    <Link href={`/${link.name.toLowerCase()}/${subLink.slug}`}>
                                      {subLink.name}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Link href={link.href}>{link.name}</Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <SheetFooter>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
