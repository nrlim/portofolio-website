"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { skills } from "@/data/portfolio";
import { Code2, Database, Cloud, Layout, Boxes } from "lucide-react";

const skillCategories = [
  {
    title: "Languages & Framework",
    icon: Code2,
    items: skills.languages,
    color: "text-blue-500",
  },
  {
    title: "Tech Stack",
    icon: Boxes,
    items: skills.backend,
    color: "text-purple-500",
  },
  {
    title: "Database",
    icon: Database,
    items: skills.databases,
    color: "text-green-500",
  },
  {
    title: "DevOps & Tools",
    icon: Cloud,
    items: skills.devops,
    color: "text-orange-500",
  },
  {
    title: "Architecture & Patterns",
    icon: Layout,
    items: skills.architecture,
    color: "text-cyan-500",
  }
];

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

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 sm:py-32 bg-muted/30">
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
              Tech Stack & Skills
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Teknologi dan tools yang saya kuasai untuk membangun solusi
              software yang scalable dan maintainable
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div key={category.title} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className={`${category.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-lg">{category.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
