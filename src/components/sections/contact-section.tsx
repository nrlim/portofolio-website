"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personalInfo } from "@/data/portfolio";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: Phone,
      label: "Telepon",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: personalInfo.address,
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Mari Berkolaborasi
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tertarik untuk diskusi proyek atau sekadar ngobrol tentang teknologi?
              Hubungi saya melalui kontak di bawah ini.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* WhatsApp CTA (Left Side) */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-2 border-accent bg-accent/5 h-full flex flex-col justify-center">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-accent" />
                    Hubungi via WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Cara tercepat untuk menghubungi saya
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Link href={personalInfo.whatsapp} target="_blank">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat di WhatsApp
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Details (Right Side) */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                  <CardDescription>
                    Detail informasi yang dapat Anda hubungi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/10 transition-colors border border-transparent hover:border-accent/20">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-muted-foreground">
                            {info.label}
                          </p>
                          <p className="text-base font-semibold break-words">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    );

                    return info.href ? (
                      <Link key={info.label} href={info.href} className="block">
                        {content}
                      </Link>
                    ) : (
                      <div key={info.label}>{content}</div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
