"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/data/portfolio";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
      
      // Show logo when scrolled past hero section (approximately 80vh)
      const heroHeight = window.innerHeight * 0.8;
      setShowLogo(scrollPosition > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b"
          : "bg-transparent"
      )}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Hidden saat di hero section */}
          <Link 
            href="/" 
            className={cn(
              "flex items-center space-x-3 transition-all duration-300",
              showLogo 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-4 pointer-events-none"
            )}
          >
            {/* Photo Profile */}
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/80 flex items-center justify-center ring-2 ring-primary/20">
              {personalInfo.photo && personalInfo.photo.startsWith('http') ? (
                <Image
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : personalInfo.photo ? (
                <Image
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <span className="text-xl font-bold text-white">N</span>
              )}
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              Nuralim
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href="#contact">Hire Me</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button asChild className="w-full mt-4">
                    <Link href="#contact">Hire Me</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
