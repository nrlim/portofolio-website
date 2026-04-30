"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { skills } from "@/data/portfolio";
import { Code2, Database, Terminal, Shield, Workflow, Users, MonitorSmartphone, BrainCircuit, Rocket, Briefcase } from "lucide-react";

const techStackCategories = [
  {
    title: "Languages",
    icon: Code2,
    items: skills.techStack.languages,
    color: "text-blue-500",
  },
  {
    title: "Frontend",
    icon: MonitorSmartphone,
    items: skills.techStack.frontend,
    color: "text-pink-500",
  },
  {
    title: "Backend & AI",
    icon: BrainCircuit,
    items: skills.techStack.backend,
    color: "text-purple-500",
  },
  {
    title: "Database & Storage",
    icon: Database,
    items: skills.techStack.databases,
    color: "text-green-500",
  },
  {
    title: "DevOps & Cloud",
    icon: Rocket,
    items: skills.techStack.devops,
    color: "text-orange-500",
  }
];

const profSkillCategories = [
  {
    title: "Architecture & Design",
    icon: Workflow,
    items: skills.professionalSkills.architecture,
    color: "text-cyan-500",
  },
  {
    title: "Leadership & Strategy",
    icon: Users,
    items: skills.professionalSkills.leadership,
    color: "text-red-500",
  },
  {
    title: "Domain Expertise",
    icon: Briefcase,
    items: skills.professionalSkills.domain,
    color: "text-amber-500",
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
              Skills & Tech Stack
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kombinasi keahlian teknis (Hard Skills) dan kemampuan kepemimpinan (Soft Skills)
              untuk membangun produk software yang bernilai bisnis.
            </p>
          </motion.div>

          {/* Tech Stack Group */}
          <div className="mb-16">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Tech Stack</h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStackCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.title} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
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
                              className="px-3 py-1 font-medium"
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
          </div>

          {/* Professional Skills Group */}
          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Professional Expertise</h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profSkillCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.title} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg border-primary/20 bg-primary/5 transition-all hover:-translate-y-1">
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
                              className="px-3 py-1 bg-background text-foreground hover:bg-background/80"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
