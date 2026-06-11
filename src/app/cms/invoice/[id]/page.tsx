'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Users, Server, Settings2, Cpu, DollarSign, LucideProps, CreditCard, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoPrint = searchParams.get('print') === 'true';
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
  interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
  interface AdditionalFee { id: string; name: string; type?: 'monthly' | 'yearly' | 'one-time' | 'per-case'; price: number; isIncludedInTotal?: boolean; }
  interface AIService { id: string; name: string; aiModel?: string; pricingModel: string; billingType?: 'monthly' | 'yearly' | 'one-time' | 'quota-based'; price: number; qty?: number; isIncludedInTotal?: boolean; }

  interface ProjectData {
    clientName: string;
    projectName: string;
    projectDate: string;
    validUntil: string;
    timelineStr: string;
    totalFeatures: number;
    devRoles: DevRole[];
    infraItems: InfraItem[];
    additionalFees: AdditionalFee[];
    aiServices: AIService[];
    licensePercent: number;
    complexityPercent?: number;
    dueDateDays?: number;
    notes: string;
    manualGrandTotal?: number;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/cms/projects?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project?.data || null);
        }
      } catch {
        // silently fail — project not found state handled below
      } finally {
        setLoading(false);
        if (shouldAutoPrint) {
          setTimeout(() => { window.print(); }, 500);
        }
      }
    };
    if (id) load();
  }, [id, shouldAutoPrint]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">Loading invoice...</div>
  );
  if (!project) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">Project not found.</div>
  );

  const devRoles      = Array.isArray(project.devRoles)       ? project.devRoles       : [];
  const infraItems    = Array.isArray(project.infraItems)     ? project.infraItems     : [];
  const additionalFees= Array.isArray(project.additionalFees) ? project.additionalFees : [];
  const aiServices    = Array.isArray(project.aiServices)     ? project.aiServices     : [];
  const licensePercent= typeof project.licensePercent === 'number' ? project.licensePercent : 10;

  const parseTimelineDays = (str: string) => {
    if (!str) return 30;
    const num = parseFloat(str.match(/\d+(\.\d+)?/)?.[0] || '1');
    const lower = str.toLowerCase();
    if (lower.includes('tahun') || lower.includes('year')) return num * 365;
    if (lower.includes('bulan') || lower.includes('month')) return num * 30;
    if (lower.includes('minggu') || lower.includes('week')) return num * 7;
    return num;
  };

  const totalInfraCost     = infraItems.reduce((s, i) => s + ((i.type==='yearly'?(i.price||0)*12:(i.price||0))*(1+(i.ppnPercent||0)/100)), 0);
  const totalAdditionalCost= additionalFees.filter((f) => f.isIncludedInTotal !== false).reduce((s, f) => s + (f.price||0), 0);
  const totalAIIncludedCost = aiServices
    .filter(ai => ai.isIncludedInTotal)
    .reduce((sum, ai) => sum + ((ai.price || 0) * (ai.qty || 1)), 0);

  const baseDevCost = devRoles.reduce((s, r) => s + (r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0)), 0);
  const complexityMultiplier = (project.complexityPercent ?? 1) / 100;
  const featureFactor = 1 + ((project.totalFeatures || 0) * complexityMultiplier);
  const standardDays = Math.max(1, (project.totalFeatures || 0) * 3);
  const timelineDays = parseTimelineDays(project.timelineStr);
  let urgencyFactor = 1;
  if (timelineDays < standardDays && timelineDays > 0) {
    urgencyFactor = Math.min(3, standardDays / timelineDays);
  }
  const totalDevCostCalculated = baseDevCost * featureFactor * urgencyFactor;
  const devCostAdjustmentCalculated = totalDevCostCalculated - baseDevCost;
  
  let devCostAdjustment = devCostAdjustmentCalculated;
  if (project.manualGrandTotal !== undefined) {
    const targetSubTotal = project.manualGrandTotal / (1 + licensePercent / 100);
    const targetTotalDevCost = targetSubTotal - totalInfraCost - totalAdditionalCost - totalAIIncludedCost;
    devCostAdjustment = targetTotalDevCost - baseDevCost;
  }
  
  const totalDevCost = baseDevCost + devCostAdjustment;
  const subTotal    = totalDevCost + totalInfraCost + totalAdditionalCost + totalAIIncludedCost;
  const licenseCost = subTotal * (licensePercent / 100);
  const grandTotal  = project.manualGrandTotal !== undefined ? project.manualGrandTotal : (subTotal + licenseCost);




  // Invoice Specifics
  const invoiceId = typeof id === 'string' ? id.slice(0, 8).toUpperCase() : 'INV-TEMP';
  const projectDate = project.projectDate ? new Date(project.projectDate) : new Date();
  const dueDate = new Date(projectDate);
  dueDate.setDate(dueDate.getDate() + (project.dueDateDays ?? 7));
  const invoiceNo = `INV-${projectDate.getFullYear()}${(projectDate.getMonth()+1).toString().padStart(2, '0')}-${invoiceId}`;

  /* ── Sub-components ── */

  interface SectionHeaderProps {
    icon: ComponentType<LucideProps>;
    title: string;
    cost?: number;
    index?: number;
  }

  const SectionHeader = ({ icon: Icon, title, cost, index }: SectionHeaderProps) => (
    <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/20 border-b border-border print:px-4 print:py-2.5 print:bg-gray-50">
      {index !== undefined && (
        <div className="flex items-center justify-center w-6 h-6 rounded-sm bg-primary/10 text-primary text-xs font-bold shrink-0 print:border print:border-primary print:bg-transparent">
          {index}
        </div>
      )}
      <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-primary/10 text-primary shrink-0 print:hidden">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="flex-1 font-semibold text-sm">{title}</span>
      {cost !== undefined && (
        <span className="text-sm font-bold tabular-nums">{fmt(cost)}</span>
      )}
    </div>
  );

  const TableHead = ({ children }: { children: React.ReactNode }) => (
    <thead>
      <tr className="border-b border-border bg-muted/10 print:bg-gray-50">
        {children}
      </tr>
    </thead>
  );

  const Th = ({ children, align = 'left', w }: { children: React.ReactNode; align?: string; w?: string }) => (
    <th
      style={w ? { width: w } : {}}
      className={`px-5 py-2.5 print:px-4 print:py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide text-${align} whitespace-nowrap`}
    >
      {children}
    </th>
  );

  const Td = ({ children, align = 'left', muted = false, bold = false, mono = false, className = '', colSpan }: {
    children: React.ReactNode; align?: string; muted?: boolean; bold?: boolean; mono?: boolean; className?: string; colSpan?: number;
  }) => (
    <td colSpan={colSpan} className={`px-5 py-3 print:px-4 print:py-2 text-sm text-${align} ${muted ? 'text-muted-foreground' : ''} ${bold ? 'font-semibold' : ''} ${mono ? 'tabular-nums' : ''} ${className}`}>
      {children}
    </td>
  );

  const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
    const colors = {
      default: 'bg-muted text-muted-foreground',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
      danger: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
    };
    return (
      <span className={`inline-block text-[11px] px-2 py-0.5 rounded-sm font-medium print:border print:border-gray-300 print:bg-transparent ${colors[variant]}`}>
        {children}
      </span>
    );
  };

  let sectionIndex = 1;

  return (
    <div className="print:bg-white print:text-black min-h-screen pb-20 print:pb-0">
      <style type="text/css" media="print">{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
      `}</style>

      {/* ── Fixed Print Footer ── */}
      <div className="hidden print:flex fixed bottom-0 left-0 right-0 h-[20mm] px-[14mm] pb-[8mm] justify-between items-end bg-white">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '3mm' }}>
          <span style={{ fontSize: '8px', color: '#9ca3af', fontWeight: 600 }}>NuralimDev · nuralimdev.com</span>
          <span style={{ fontSize: '8px', color: '#9ca3af', fontStyle: 'italic' }}>This document is an official billing from NuralimDev. Please ensure payment is made before the due date.</span>
        </div>
      </div>

      {/* PDF layout uses table so thead/tfoot repeat as fixed header/footer on each page */}
      <table className="w-full border-collapse print:mb-[40mm]">

        {/* ── Repeated print header — renders on every page top ── */}
        <thead className="hidden print:table-header-group">
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ padding: '6mm 14mm 4mm', borderBottom: '2px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Image src="/personal-logo.png" alt="Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>Nuralim<span style={{ color: '#2563eb' }}>.Dev</span></div>
                    <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>nuralimdev.com</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: '#1e3a8a', color: '#ffffff', padding: '5px 12px', borderRadius: '4px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>
                      INVOICE
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>{dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          {/* Dedicated spacer row repeated on every page */}
          <tr>
            <td style={{ height: '10mm', padding: 0, border: 'none' }}></td>
          </tr>
        </thead>

        {/* ── Main content ── */}
        <tbody>
          <tr>
            <td className="p-0">
              <main className="p-4 md:p-8 print:px-[14mm] print:pb-5 print:pt-2 w-full space-y-5 print:space-y-4">

                {/* Screen header — hidden on print */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 print:hidden">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-sm shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight">Project Invoice</h1>
                        <Badge variant="warning">UNPAID</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Billing statement for project {project.projectName}.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()} className="gap-2 rounded-sm h-9 px-4 font-semibold text-sm whitespace-nowrap">
                      <Printer className="w-4 h-4" /> Print / Export PDF
                    </Button>
                  </div>
                </div>

                {/* ── Invoice Info Card ── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-muted/10 print:bg-gray-50 border border-border print:border-gray-200 rounded-sm p-4 print:p-4 mb-2 print:break-inside-avoid">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Bill To</div>
                      <div className="text-sm font-bold text-foreground leading-tight text-lg">{project.clientName || '-'}</div>
                      <div className="text-xs text-muted-foreground">Project: <span className="font-semibold text-foreground">{project.projectName || '-'}</span></div>
                    </div>
                    <div className="flex flex-col gap-2.5 md:items-end">
                      <div className="grid grid-cols-2 md:flex md:flex-col gap-2 text-sm md:text-right w-full md:w-auto">
                        <div className="flex justify-between md:justify-end gap-4"><span className="text-muted-foreground font-semibold">Invoice No</span> <span className="font-bold text-foreground tabular-nums">{invoiceNo}</span></div>
                        <div className="flex justify-between md:justify-end gap-4"><span className="text-muted-foreground font-semibold">Date</span> <span className="font-semibold text-foreground tabular-nums">{project.projectDate || '-'}</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Development ── */}
                {devRoles.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                     <SectionHeader icon={Users} title="Application Development Services" cost={totalDevCost} index={sectionIndex++} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="40%">Role</Th>
                          <Th align="center" w="15%">Qty</Th>
                          <Th align="right" w="15%">Duration</Th>
                          <Th align="right" w="15%">Daily Rate</Th>
                          <Th align="right" w="15%">Total</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {devRoles.map((r) => (
                            <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                              <Td bold>{r.role || '-'}</Td>
                              <Td align="center" muted>{r.qty} pax</Td>
                              <Td align="right" muted>{r.days} days</Td>
                              <Td align="right" muted mono>{fmt((r.dailyRate||0)+(r.dailyAllowance||0))}</Td>
                              <Td align="right" bold mono>{fmt((r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0)))}</Td>
                            </tr>
                          ))}
                          {devCostAdjustment !== 0 && (
                            <tr className="bg-amber-50/50 dark:bg-amber-950/20 print:bg-amber-50/50">
                              <Td bold className="text-amber-700 dark:text-amber-400">
                                <div className="flex items-center gap-2">
                                  Complexity & Timeline Adjustment
                                </div>
                              </Td>
                              <Td colSpan={3} align="right" muted className="text-[10px] text-amber-600/80 dark:text-amber-500/80">
                                {project.totalFeatures} Features • {timelineDays} Days Timeline
                              </Td>
                              <Td align="right" bold mono className="text-amber-700 dark:text-amber-400">
                                {devCostAdjustment > 0 ? '+' : '-'}{fmt(Math.abs(devCostAdjustment))}
                              </Td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── Infrastructure ── */}
                {infraItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                    <SectionHeader icon={Server} title="Infrastructure (Server & Domain)" cost={totalInfraCost} index={sectionIndex++} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="40%">Item</Th>
                          <Th align="center" w="15%">Type</Th>
                          <Th align="right" w="15%">Price / Period</Th>
                          <Th align="right" w="15%">VAT</Th>
                          <Th align="right" w="15%">Total</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {infraItems.map((i) => {
                            const base = i.type !== 'one-time' ? (i.price||0)*12 : (i.price||0);
                            return (
                              <tr key={i.id} className="hover:bg-muted/5 transition-colors">
                                <Td bold>{i.name || '-'}</Td>
                                <Td align="center">
                                  <Badge>{i.type==='monthly'?'Monthly':i.type==='yearly'?'Yearly':'One-time'}</Badge>
                                </Td>
                                <Td align="right" muted mono>{fmt(i.price||0)}</Td>
                                <Td align="right" muted>{i.ppnPercent||0}%</Td>
                                <Td align="right" bold mono>{fmt(base*(1+(i.ppnPercent||0)/100))}</Td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── AI Services ── */}
                {aiServices.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                    <SectionHeader icon={Cpu} title="AI Models & API Services" index={sectionIndex++} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="30%">Service</Th>
                          <Th align="center" w="15%">Pricing Model</Th>
                          <Th align="center" w="15%">Billing</Th>
                          <Th align="center" w="10%">Qty</Th>
                          <Th align="right" w="15%">Unit Price</Th>
                          <Th align="right" w="15%">Total</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {aiServices.map((a) => {
                            const qty = a.qty || 1;
                            return (
                              <tr key={a.id} className="hover:bg-muted/5 transition-colors">
                                <Td bold>
                                  <span className="flex items-center gap-2">
                                    {a.name || '-'}
                                    {a.isIncludedInTotal && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-semibold border border-primary/20 print:border-primary/50">
                                        ✓ Selected
                                      </span>
                                    )}
                                  </span>
                                </Td>
                                <Td align="center">
                                  <Badge>{a.pricingModel||'-'}</Badge>
                                </Td>
                                <Td align="center">
                                  <Badge>{a.billingType==='monthly'?'Monthly':a.billingType==='yearly'?'Yearly':a.billingType==='quota-based'?'Quota Based':'One-time'}</Badge>
                                </Td>
                                <Td align="center" muted>{qty}</Td>
                                <Td align="right" muted mono>{fmt(a.price||0)}</Td>
                                <Td align="right" bold mono>{fmt((a.price||0) * qty)}</Td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── Additional Fees ── */}
                {additionalFees.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                    <SectionHeader icon={Settings2} title="Additional Fees (Misc)" cost={totalAdditionalCost} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="70%">Description</Th>
                          <Th align="center" w="15%">Type</Th>
                          <Th align="right" w="15%">Cost</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {additionalFees.map((f) => (
                            <tr key={f.id} className="hover:bg-muted/5 transition-colors">
                              <Td bold>
                                <span className="flex items-center gap-2">
                                  {f.name || '-'}
                                  {f.isIncludedInTotal !== false ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-semibold border border-primary/20 print:border-primary/50">
                                      ✓ Included
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-semibold border border-border print:border-gray-300">
                                      Info Only
                                    </span>
                                  )}
                                </span>
                              </Td>
                              <Td align="center">
                                <Badge>{f.type==='monthly'?'Monthly':f.type==='yearly'?'Yearly':f.type==='per-case'?'Per Case':'One-time'}</Badge>
                              </Td>
                              <Td align="right" bold mono className={f.isIncludedInTotal === false ? "line-through text-muted-foreground font-normal" : ""}>{fmt(f.price||0)}</Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── Summary & Payment (Side-by-side) ── */}
                <div className="flex flex-col md:flex-row print:flex-row gap-6 items-start mt-6 print:mt-4 print:break-inside-avoid">
                  
                  {/* Left Side: Payment Details */}
                  <div className="flex-1 w-full flex flex-col gap-4">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="rounded-sm border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 print:bg-blue-50 print:border-blue-200 overflow-hidden">
                      <div className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="w-4 h-4 text-blue-700" />
                          <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Payment Instructions</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" width={60} height={20} className="h-5 mt-1 w-auto" />
                            <div>
                              <p className="text-sm font-bold text-foreground tabular-nums">5485087858</p>
                              <p className="text-xs text-muted-foreground">a.n Nuralim</p>
                              <p className="text-xs text-blue-600/80 mt-1 font-medium italic">Please include &quot;{invoiceNo}&quot; in the transfer description.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 border-t border-blue-100 dark:border-blue-900/50 pt-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Payment Status</span>
                              </div>
                              <Badge variant="warning">UNPAID</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* ── Notes ── */}
                    {project.notes && (
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Additional Notes
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed italic">{project.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Grand Total Summary */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="w-full md:w-[360px] print:w-[340px] shrink-0 bg-card rounded-sm border border-primary/20 shadow-sm print:shadow-none overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-primary/5 border-b border-border print:px-4 print:py-2.5 print:bg-gray-50">
                      <DollarSign className="w-3.5 h-3.5 text-primary print:hidden" />
                      <span className="text-sm font-semibold">Invoice Total</span>
                    </div>

                    <div className="divide-y divide-border">
                      {[
                        { label: 'Services Subtotal',   value: totalDevCost,        show: totalDevCost > 0 },
                        { label: 'Infrastructure',      value: totalInfraCost,      show: totalInfraCost > 0 },
                        { label: 'AI Services',         value: totalAIIncludedCost, show: totalAIIncludedCost > 0 },
                        { label: 'Additional Fees',     value: totalAdditionalCost, show: totalAdditionalCost > 0 },
                      ].filter(r => r.show).map(row => (
                        <div key={row.label} className="flex justify-between items-center px-5 py-3 print:px-4 print:py-2 text-sm">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-medium tabular-nums">{fmt(row.value)}</span>
                        </div>
                      ))}

                      <div className="flex justify-between items-center px-5 py-3 print:px-4 print:py-2 text-sm bg-muted/30 print:bg-gray-50">
                        <span className="font-semibold">Subtotal</span>
                        <span className="font-semibold tabular-nums">{fmt(subTotal)}</span>
                      </div>

                      <div className="flex justify-between items-center px-5 py-3 print:px-4 print:py-2 text-sm">
                        <span className="text-muted-foreground">Management Fee ({licensePercent}%)</span>
                        <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400 print:text-emerald-700">{fmt(licenseCost)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-5 py-4 print:px-4 print:py-3 bg-primary text-primary-foreground print:bg-black print:text-white">
                      <span className="font-bold text-base tracking-wide">TOTAL DUE</span>
                      <span className="font-extrabold text-2xl print:text-xl tabular-nums">{fmt(grandTotal)}</span>
                    </div>
                  </motion.div>
                </div>

              </main>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
