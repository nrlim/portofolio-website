'use client';

import { Metadata } from "next";
import Link from "next/link";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Shield, 
  Database,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Home
} from "lucide-react";

export default function CRMServicePage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const features = [
    {
      icon: Users,
      title: "Customer Management",
      description: "Centralize all customer data in one place. Track interactions, preferences, and history for personalized experiences."
    },
    {
      icon: TrendingUp,
      title: "Sales Pipeline",
      description: "Visualize your sales process from lead to close. Automate follow-ups and never miss an opportunity."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Real-time insights into customer behavior, sales performance, and business metrics for data-driven decisions."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Integrated email, SMS, and messaging tools. Keep all customer communications organized and accessible."
    },
    {
      icon: Target,
      title: "Marketing Automation",
      description: "Create targeted campaigns, automate workflows, and nurture leads with personalized messaging."
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Seamlessly connect with your existing tools and systems. Import/export data with ease."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Increased Productivity",
      stat: "40%",
      description: "Automation reduces manual tasks"
    },
    {
      icon: TrendingUp,
      title: "Higher Conversion",
      stat: "30%",
      description: "Better lead nurturing and follow-up"
    },
    {
      icon: Users,
      title: "Customer Retention",
      stat: "25%",
      description: "Improved customer satisfaction"
    },
    {
      icon: Shield,
      title: "Data Security",
      stat: "100%",
      description: "Enterprise-grade security standards"
    }
  ];

  const techStack = [
    ".NET Core",
    "React",
    "TypeScript",
    "SQL Server",
    "Azure",
    "RESTful API",
    "Redis Cache",
    "SignalR"
  ];

  const implementations = [
    {
      title: "Small Business",
      features: ["Customer Management", "Email Integration", "Basic Reporting", "Mobile Access"],
      price: "$49/month"
    },
    {
      title: "Growing Business",
      features: ["All Small Business features", "Sales Pipeline", "Analytics & Reporting", "Marketing Automation", "Communication Hub"],
      price: "$149/month",
      popular: true
    },
    {
      title: "Enterprise",
      features: ["All Growing Business features", "Data Integration", "Custom Workflows", "Multi-tenant Architecture", "Advanced Security", "Dedicated Support"],
      price: "Custom Quote"
    }
  ];

  return (
    <>
      {/* Sticky Header with Home Button */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Button asChild variant="ghost" className="gap-2" size="sm">
            <Link href="/">
              <Home size={18} />
              Home
            </Link>
          </Button>
        </div>
      </div>

      <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Zap size={16} />
              CRM Solutions
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Transform Customer Relationships Into Business Growth
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Custom-built CRM solutions that scale with your business. Increase sales, improve customer satisfaction, and streamline operations with modern technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Link href="#packages">
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">View Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our CRM Solution?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with 7+ years of experience in enterprise software development
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption and compliance with industry standards (ISO, GDPR)
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-sm text-muted-foreground">
                Cloud-based infrastructure with automatic backups and disaster recovery
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for speed with sub-second response times across all features
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                <Database size={24} />
              </div>
              <h3 className="font-semibold mb-2">Scalable Infrastructure</h3>
              <p className="text-sm text-muted-foreground">
                Grows with your business from startup to enterprise without performance loss
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage customer relationships effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                      <feature.icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Implementation Section */}
      <section id="packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Packages</h2>
            <p className="text-lg text-muted-foreground">
              Choose the right package for your business size and needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {implementations.map((impl, index) => (
              <Card 
                key={index}
                onClick={() => setSelectedPackage(impl.title)}
                className={`p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  selectedPackage === impl.title
                    ? 'ring-2 ring-blue-500 shadow-xl'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="relative">
                  {impl.popular && selectedPackage !== impl.title && (
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
                      Most Popular
                    </div>
                  )}
                  {selectedPackage === impl.title && (
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
                      Selected
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{impl.title}</h3>
                  
                  <div className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                    {impl.price}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {impl.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    asChild 
                    className={`w-full transition-all duration-300 ${
                      selectedPackage === impl.title
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : ''
                    }`}
                    variant={selectedPackage === impl.title ? 'default' : 'outline'}
                  >
                    <Link href="#contact">Get Started</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Customer Management?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Let's discuss how a custom CRM solution can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/#contact">
                <Mail className="mr-2" size={20} />
                Contact Me
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="https://wa.me/628111441696" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2" size={20} />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
