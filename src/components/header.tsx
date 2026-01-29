"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, ChevronDown, ArrowRight, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { personalInfo } from "@/data/portfolio";
import { featureFlags } from "@/config/features";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CVPreviewDialog } from "@/components/cv/CVPreviewDialog";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  // { name: "Articles", href: "/articles" },
  { name: "Contact", href: "#contact" },
];

const servicesMenu = [
  { name: "CRM Solutions", href: "/services/crm", description: "Customer Relationship Management" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

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

            {/* Services Dropdown - Hidden by feature flag */}
            {featureFlags.SHOW_SERVICES_MENU && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50 flex items-center gap-1">
                    Services
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[220px] bg-background border rounded-md shadow-lg p-1 z-50"
                    sideOffset={5}
                  >
                    {servicesMenu.map((service) => (
                      <DropdownMenu.Item key={service.name} asChild>
                        <Link
                          href={service.href}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer outline-none"
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.description}</div>
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <CVPreviewDialog />
            <ThemeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href="#contact">Hire Me</Link>
            </Button>


            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" suppressHydrationWarning>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l">
                <div className="flex flex-col h-full bg-background">
                  <SheetHeader className="p-6 text-left border-b">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/80 flex items-center justify-center ring-2 ring-primary/20">
                        {personalInfo.photo && personalInfo.photo.startsWith('http') ? (
                          <Image
                            src={personalInfo.photo}
                            alt={personalInfo.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : personalInfo.photo ? (
                          <Image
                            src={personalInfo.photo}
                            alt={personalInfo.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">N</span>
                        )}
                      </div>
                      <span className="font-bold text-lg">Nuralim</span>
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground mt-1">
                      Product & Technology Development Manager
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto py-6 px-6">
                    <nav className="flex flex-col space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-all group"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {item.name}
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}

                      {featureFlags.SHOW_SERVICES_MENU && (
                        <div className="pt-4 mt-2">
                          <div className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Services
                          </div>
                          {servicesMenu.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="flex flex-col px-4 py-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                              onClick={() => setIsSheetOpen(false)}
                            >
                              <span className="font-medium">{service.name}</span>
                              <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {service.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </nav>
                  </div>

                  <div className="p-6 border-t bg-muted/10 space-y-4">
                    <Button asChild className="w-full shadow-md" size="lg">
                      <Link href="#contact" onClick={() => setIsSheetOpen(false)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Hire Me
                      </Link>
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-muted-foreground">
                      <Link
                        href={personalInfo.social.linkedin}
                        target="_blank"
                        className="hover:text-primary transition-colors p-2 hover:bg-accent rounded-full"
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link
                        href={personalInfo.social.instagram}
                        target="_blank"
                        className="hover:text-primary transition-colors p-2 hover:bg-accent rounded-full"
                      >
                        <Instagram className="h-5 w-5" />
                      </Link>
                      <Link
                        href={personalInfo.whatsapp}
                        target="_blank"
                        className="hover:text-primary transition-colors p-2 hover:bg-accent rounded-full"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
