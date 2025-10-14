"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { education, interests } from "@/data/portfolio";
import { GraduationCap, Calendar } from "lucide-react";

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

export function EducationSection() {
  return (
    <section id="education" className="py-20 sm:py-32">
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
              Pendidikan & Minat
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Education */}
            <div>
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold mb-6 flex items-center gap-3"
              >
                <GraduationCap className="h-7 w-7 text-primary" />
                Pendidikan
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3 flex items-center gap-1 w-fit">
                          <Calendar className="h-3 w-3" />
                          {edu.period}
                        </Badge>
                        <h4 className="text-xl font-semibold mb-2">
                          {edu.degree}
                        </h4>
                        <p className="text-primary font-medium mb-3">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold mb-6"
              >
                Area of Interest
              </motion.h3>

              <motion.div
                variants={containerVariants}
                className="flex flex-wrap gap-3"
              >
                {interests.map((interest) => (
                  <motion.div key={interest} variants={itemVariants}>
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {interest}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
