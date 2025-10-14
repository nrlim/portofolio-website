"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/portfolio";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 sm:py-32">
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
              Pengalaman Profesional
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Perjalanan karir saya dalam membangun software dan memimpin tim
              engineering
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto space-y-12">
            {experience.map((company, companyIndex) => (
              <motion.div key={companyIndex} variants={itemVariants}>
                {/* Company Header */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{company.company}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Positions */}
                <div className="ml-6 border-l-2 border-primary/20 pl-8 space-y-8">
                  {company.positions.map((position, posIndex) => (
                    <div key={posIndex}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                            <h4 className="text-xl font-semibold">
                              {position.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="w-fit flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              {position.period}
                            </Badge>
                          </div>
                          
                          {/* Achievement Narrative - Story format */}
                          {position.achievementNarrative && (
                            <p className="text-muted-foreground leading-relaxed text-justify">
                              {position.achievementNarrative}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
