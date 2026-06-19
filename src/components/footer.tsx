"use client";

import * as React from "react";
import Link from "next/link";
import { personalInfo } from "@/data/portfolio";
import { Linkedin, Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "LinkedIn",
    href: personalInfo.social.linkedin,
    icon: Linkedin,
  },
  {
    name: "TikTok",
    href: personalInfo.social.tiktok,
    icon: TikTokIcon,
  },
  {
    name: "Instagram",
    href: personalInfo.social.instagram,
    icon: Instagram,
  },
];

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-background" suppressHydrationWarning>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="text-2xl font-black tracking-tight mb-4 text-foreground">
              Nuralim<span className="text-primary">.Dev</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Product & Technology Development Manager. Membangun software yang
              adaptif dan tim yang berdaya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { name: "About", href: "#about" },
                { name: "Skills", href: "#skills" },
                { name: "Experience", href: "#experience" },
                { name: "Projects", href: "#projects" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Nuralim.Dev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
