"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle } from "lucide-react";
import { hero, personalInfo } from "@/data/portfolio";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="order-2 lg:order-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
                    Nuralim
                  </span>
                </h1>
              </motion.div>

              {/* Title dengan styling khusus */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                  <Badge 
                    variant="outline" 
                    className="border-primary/50 text-primary font-semibold px-4 py-1.5 text-sm"
                  >
                    ROLE
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Product & Technology
                  <br />
                  <span className="text-primary">Development Manager</span>
                </h2>
              </motion.div>

              {/* Value Proposition - Lebih concise */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground/90">
                  Building <span className="text-primary font-bold">scalable software</span> and 
                  <span className="text-accent font-bold"> empowering teams</span> to deliver excellence.
                </p>
                
                {/* Key Stats/Highlights */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      6+ Years Experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      10+ Projects Delivered
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      Multi-Industry Expert
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons - Redesigned */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button 
                  size="lg" 
                  asChild 
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href={personalInfo.whatsapp} target="_blank">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Let's Talk
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-2 hover:bg-accent/10 hover:border-accent transition-all"
                >
                  <Link href="#projects">
                    View Projects
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Lanyard ID Card */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                {/* Lanyard String */}
                <motion.div
                  animate={{
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-1/2 -translate-x-1/2 -top-32 w-1 h-32 bg-gradient-to-b from-muted/50 to-muted origin-bottom"
                  style={{
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  }}
                />

                {/* ID Card Container with Swing Animation */}
                <motion.div
                  animate={{
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  {/* ID Card */}
                  <div className="relative w-72 sm:w-80 bg-card rounded-2xl shadow-2xl overflow-hidden border-2 border-border">
                    {/* Card Header with Company Color */}
                    <div className="h-24 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-grid-pattern" />
                      </div>
                      
                      {/* Company/Brand Name */}
                      <div className="relative z-10 p-4 text-white">
                        <div className="text-xs font-medium opacity-90">EMPLOYEE ID</div>
                        <div className="text-lg font-bold">PT Quadrant</div>
                      </div>

                      {/* Hole for Lanyard */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-background rounded-full border-4 border-card shadow-inner" />
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Photo Circle */}
                      <div className="flex justify-center -mt-16 mb-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/80 flex items-center justify-center shadow-xl border-4 border-card ring-4 ring-background">
                          {personalInfo.photo && personalInfo.photo.startsWith('http') ? (
                            <Image
                              src={personalInfo.photo}
                              alt={personalInfo.name}
                              fill
                              className="object-cover"
                              priority
                            />
                          ) : personalInfo.photo ? (
                            <Image
                              src={personalInfo.photo}
                              alt={personalInfo.name}
                              fill
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-5xl font-bold text-white mb-1">N</div>
                              <div className="text-xs text-white/80 font-medium">Nuralim</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold">Nuralim</h3>
                        <div className="text-sm text-muted-foreground font-medium px-4 leading-tight">
                          Product & Technology Development Manager
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <Badge variant="secondary" className="text-xs px-3 py-1">
                            6+ Years
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-3 py-1">
                            Engineering
                          </Badge>
                        </div>
                      </div>

                      {/* Barcode/ID Number */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(40)].map((_, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-foreground/70"
                              style={{
                                height: i % 3 === 0 ? "24px" : i % 2 === 0 ? "18px" : "12px",
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-center text-xs font-mono text-muted-foreground">
                          EMP-2019-001
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Accent */}
                    <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                  </div>

                  {/* Shadow below card */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-foreground/5 rounded-full blur-xl" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
          />
        </div>
      </motion.div>
    </section>
  );
}
