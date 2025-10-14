"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projects, projectCategories } from "@/data/portfolio";
import { ExternalLink, FileText } from "lucide-react";

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

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="projects" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Proyek & Portfolio
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Koleksi proyek yang telah saya kerjakan di berbagai domain
              industri
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {projectCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="min-w-[100px]"
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* Debug info */}
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Menampilkan {filteredProjects.length} proyek
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="h-full"
              >
                <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group overflow-hidden border-2 hover:border-primary/30">
                  {/* Project Image */}
                  <div className="relative w-full h-56 sm:h-64 md:h-72 bg-card overflow-hidden flex items-center justify-center p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain object-center transition-all duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 95vw, (max-width: 768px) 48vw, (max-width: 1024px) 31vw, 380px"
                        quality={95}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <CardHeader className="flex-grow">
                    <div className="mb-2">
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs px-2 py-0"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          +{project.tech.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Case Study Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileText className="mr-2 h-4 w-4" />
                          Detail Studi Kasus
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl mb-2">
                            {project.title}
                          </DialogTitle>
                          <DialogDescription>
                            <Badge variant="secondary">{project.category}</Badge>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                          {/* Problem */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm">
                                1
                              </span>
                              Problem
                            </h4>
                            <p className="text-muted-foreground pl-10">
                              {project.caseStudy.problem}
                            </p>
                          </div>

                          {/* Solution */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm">
                                2
                              </span>
                              Solution
                            </h4>
                            <p className="text-muted-foreground pl-10">
                              {project.caseStudy.solution}
                            </p>
                          </div>

                          {/* Result */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-sm">
                                3
                              </span>
                              Result & Impact
                            </h4>
                            <p className="text-muted-foreground pl-10">
                              {project.caseStudy.result}
                            </p>
                          </div>

                          {/* Tech Stack */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3">
                              Technology Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
            >
              Tidak ada proyek di kategori ini
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
