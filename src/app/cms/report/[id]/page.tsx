'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Users, Server, Settings2, Cpu, DollarSign, LucideProps, AlertCircle, FileText } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoPrint = searchParams.get('print') === 'true';
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
  interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
  interface AdditionalFee { id: string; name: string; price: number; }
  interface AIService { id: string; name: string; aiModel?: string; pricingModel: string; billingType?: 'monthly' | 'yearly' | 'one-time'; price: number; }

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
    notes: string;
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
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">Loading report...</div>
  );
  if (!project) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">Project not found.</div>
  );

  const devRoles      = Array.isArray(project.devRoles)       ? project.devRoles       : [];
  const infraItems    = Array.isArray(project.infraItems)     ? project.infraItems     : [];
  const additionalFees= Array.isArray(project.additionalFees) ? project.additionalFees : [];
  const aiServices    = Array.isArray(project.aiServices)     ? project.aiServices     : [];
  const licensePercent= typeof project.licensePercent === 'number' ? project.licensePercent : 10;

  const totalDevCost       = devRoles.reduce((s, r) => s + (r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0)), 0);
  const totalInfraCost     = infraItems.reduce((s, i) => s + ((i.type==='monthly'?(i.price||0)*12:(i.price||0))*(1+(i.ppnPercent||0)/100)), 0);
  const totalAdditionalCost= additionalFees.reduce((s, f) => s + (f.price||0), 0);
  const totalAICost        = aiServices.reduce((s, a) => {
    const basePrice = (a.price || 0) * (a.qty || 1);
    return s + (a.billingType === 'monthly' ? basePrice * 12 : basePrice);
  }, 0);
  const subTotal    = totalDevCost + totalInfraCost + totalAdditionalCost + totalAICost;
  const licenseCost = subTotal * (licensePercent / 100);
  const grandTotal  = subTotal + licenseCost;

  const recurringInfra = infraItems.filter(i => i.type === 'monthly' || i.type === 'yearly');
  const recurringAI    = aiServices.filter(a => a.billingType === 'monthly' || a.billingType === 'yearly');
  const hasRecurring   = recurringInfra.length > 0 || recurringAI.length > 0;

  /* ── Sub-components ── */

  interface SectionHeaderProps {
    icon: ComponentType<LucideProps>;
    title: string;
    cost?: number;
  }

  const SectionHeader = ({ icon: Icon, title, cost }: SectionHeaderProps) => (
    <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/20 border-b border-border print:px-4 print:py-2.5 print:bg-gray-50">
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

  const Td = ({ children, align = 'left', muted = false, bold = false, mono = false, className = '' }: {
    children: React.ReactNode; align?: string; muted?: boolean; bold?: boolean; mono?: boolean; className?: string;
  }) => (
    <td className={`px-5 py-3 print:px-4 print:py-2 text-sm text-${align} ${muted ? 'text-muted-foreground' : ''} ${bold ? 'font-semibold' : ''} ${mono ? 'tabular-nums' : ''} ${className}`}>
      {children}
    </td>
  );

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block text-[11px] px-2 py-0.5 bg-muted rounded-sm font-medium text-muted-foreground print:border print:border-gray-300 print:bg-transparent">
      {children}
    </span>
  );

  return (
    <div className="print:bg-white print:text-black">
      <style type="text/css" media="print">{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        /* Suppress browser-generated header/footer text (URL, date, page no.) */
        /* This works by using margin:0 so there is no space for browser footer  */
        /* User must uncheck "Headers and footers" in Chrome print dialog        */
      `}</style>

      {/* PDF layout uses table so thead/tfoot repeat as fixed header/footer on each page */}
      <table className="w-full border-collapse">

        {/* ── Repeated print header — renders on every page top ── */}
        <thead className="hidden print:table-header-group">
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ padding: '10mm 14mm 4mm' }} className="flex justify-between items-end border-b-2 border-black">
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>NuralimDev</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>nuralimdev.com</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>Estimasi Biaya Proyek</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>{project.projectDate || ''}</div>
                </div>
              </div>
            </td>
          </tr>
        </thead>

        {/* ── Repeated print footer — renders on every page bottom ── */}
        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td style={{ padding: 0 }}>
              <div style={{ padding: '3mm 14mm 8mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '8px', color: '#9ca3af', fontWeight: 600 }}>NuralimDev · nuralimdev.com</span>
                <span style={{ fontSize: '8px', color: '#9ca3af', fontStyle: 'italic' }}>Dokumen ini bersifat rahasia dan hanya untuk pihak yang dituju.</span>
              </div>
            </td>
          </tr>
        </tfoot>

        {/* ── Main content ── */}
        <tbody>
          <tr>
            <td className="p-0">
              <main className="p-4 md:p-8 print:px-[14mm] print:py-5 w-full space-y-5 print:space-y-4">

                {/* Screen header — hidden on print */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 print:hidden">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-sm shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">Project Report</h1>
                      <p className="text-xs text-muted-foreground mt-0.5">Ringkasan estimasi biaya proyek secara lengkap.</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => window.print()} className="gap-2 rounded-sm h-9 px-4 font-semibold text-sm whitespace-nowrap">
                    <Printer className="w-4 h-4" /> Print / Export PDF
                  </Button>
                </div>

                {/* ── Project Info Card ── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-sm border border-border shadow-sm print:shadow-none print:break-inside-avoid overflow-hidden">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/20 border-b border-border print:bg-gray-50 print:px-4 print:py-2.5">
                    <FileText className="w-3.5 h-3.5 text-primary print:hidden" />
                    <span className="text-sm font-semibold">Informasi Proyek</span>
                  </div>
                  <div className="p-5 print:p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">
                      {[
                        { label: 'Klien',            value: project.clientName  || '-' },
                        { label: 'Nama Proyek',      value: project.projectName || '-' },
                        { label: 'Tanggal Estimasi', value: project.projectDate || '-' },
                        { label: 'Berlaku Hingga',   value: project.validUntil  || '-' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      ))}
                      {project.timelineStr && (
                        <div className="col-span-2">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Timeline & Scope</p>
                          <p className="text-sm font-medium">
                            {project.timelineStr}
                            {project.totalFeatures > 0 && (
                              <span className="text-muted-foreground font-normal"> · {project.totalFeatures} fitur</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ── Development ── */}
                {devRoles.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                    <SectionHeader icon={Users} title="Jasa Pembuatan Aplikasi (Development)" cost={totalDevCost} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="36%">Peran / Role</Th>
                          <Th align="center" w="12%">Qty</Th>
                          <Th align="center" w="14%">Durasi</Th>
                          <Th align="right" w="19%">Daily Rate</Th>
                          <Th align="right" w="19%">Total</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {devRoles.map((r) => (
                            <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                              <Td bold>{r.role || '-'}</Td>
                              <Td align="center" muted>{r.qty} org</Td>
                              <Td align="center" muted>{r.days} hari</Td>
                              <Td align="right" muted mono>{fmt((r.dailyRate||0)+(r.dailyAllowance||0))}</Td>
                              <Td align="right" bold mono>{fmt((r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0)))}</Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── Infrastructure ── */}
                {infraItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-card rounded-sm border border-border shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                    <SectionHeader icon={Server} title="Infrastruktur (Server & Domain)" cost={totalInfraCost} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="34%">Item</Th>
                          <Th align="center" w="14%">Tipe</Th>
                          <Th align="right" w="18%">Harga / Periode</Th>
                          <Th align="right" w="10%">PPN</Th>
                          <Th align="right" w="24%">Total / Tahun</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {infraItems.map((i) => {
                            const base = i.type === 'monthly' ? (i.price||0)*12 : (i.price||0);
                            return (
                              <tr key={i.id} className="hover:bg-muted/5 transition-colors">
                                <Td bold>{i.name || '-'}</Td>
                                <Td align="center">
                                  <Badge>{i.type==='monthly'?'Bulanan':i.type==='yearly'?'Tahunan':'Sekali Bayar'}</Badge>
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
                    <SectionHeader icon={Cpu} title="AI Models & API Services" cost={totalAICost} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="30%">Layanan</Th>
                          <Th align="center" w="16%">Pricing Model</Th>
                          <Th align="center" w="14%">Tipe Billing</Th>
                          <Th align="right" w="20%">Harga / Periode</Th>
                          <Th align="right" w="20%">Total / Tahun</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {aiServices.map((a) => {
                            const qty = a.qty || 1;
                            const base = a.billingType === 'monthly' ? (a.price || 0) * 12 : (a.price || 0);
                            const total = base * qty;
                            // Pricing models that are usage-based and may grow into recurring costs
                            const isUsageBased = ['per_page','per_1k_requests','per_1k_tokens','per_1m_tokens'].includes(a.pricingModel);
                            return (
                              <tr key={a.id} className="hover:bg-muted/5 transition-colors">
                                <Td bold>
                                  <span className="flex items-center gap-2">
                                    {a.name || '-'}
                                    {isUsageBased && (
                                      <span
                                        title="Harga berbasis penggunaan — berpotensi menjadi biaya recurring tergantung volume"
                                        className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800 print:hidden cursor-help"
                                      >
                                        <span>⚠</span> Usage-based
                                      </span>
                                    )}
                                  </span>
                                </Td>
                                <Td align="center">
                                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-sm font-medium print:border print:border-gray-300 print:bg-transparent ${
                                    isUsageBased
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {a.pricingModel||'-'}
                                  </span>
                                </Td>
                                <Td align="center">
                                  <Badge>{a.billingType==='monthly'?'Bulanan':a.billingType==='yearly'?'Tahunan':'Sekali Bayar'}</Badge>
                                </Td>
                                <Td align="right">
                                  {isUsageBased ? (
                                    <div className="flex flex-col justify-end items-end">
                                      <span>{fmt(a.price || 0)}</span>
                                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">x {qty} qty</span>
                                    </div>
                                  ) : (
                                    fmt(a.price || 0)
                                  )}
                                </Td>
                                <Td align="right" bold>{fmt(total)}</Td>
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
                    <SectionHeader icon={Settings2} title="Biaya Tambahan (Lain-lain)" cost={totalAdditionalCost} />
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHead>
                          <Th w="82%">Deskripsi</Th>
                          <Th align="right" w="18%">Biaya</Th>
                        </TableHead>
                        <tbody className="divide-y divide-border">
                          {additionalFees.map((f) => (
                            <tr key={f.id} className="hover:bg-muted/5 transition-colors">
                              <Td bold>{f.name || '-'}</Td>
                              <Td align="right" bold mono>{fmt(f.price||0)}</Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* ── Grand Total Summary ── */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-card rounded-sm border border-primary/20 shadow-sm print:shadow-none overflow-hidden print:break-inside-avoid">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 bg-primary/5 border-b border-border print:px-4 print:py-2.5 print:bg-gray-50">
                    <DollarSign className="w-3.5 h-3.5 text-primary print:hidden" />
                    <span className="text-sm font-semibold">Ringkasan Total Biaya</span>
                  </div>

                  <div className="divide-y divide-border">
                    {[
                      { label: 'Development Cost',   value: totalDevCost,        show: totalDevCost > 0 },
                      { label: 'Infrastructure Cost', value: totalInfraCost,      show: totalInfraCost > 0 },
                      { label: 'Additional Fees',     value: totalAdditionalCost, show: totalAdditionalCost > 0 },
                      { label: 'AI Services',         value: totalAICost,         show: totalAICost > 0 },
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
                      <span className="text-muted-foreground">License / Margin ({licensePercent}%)</span>
                      <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400 print:text-emerald-700">{fmt(licenseCost)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-5 py-4 print:px-4 print:py-3 bg-primary text-primary-foreground print:bg-black print:text-white">
                    <span className="font-bold text-base tracking-wide">GRAND TOTAL</span>
                    <span className="font-extrabold text-2xl print:text-xl tabular-nums">{fmt(grandTotal)}</span>
                  </div>
                </motion.div>

                {/* ── Recurring Alert ── */}
                {hasRecurring && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                    className="rounded-sm border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 p-5 print:p-4 print:break-inside-avoid print:bg-orange-50 print:border-orange-300">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                          Perhatian: Biaya Operasional Berlangganan (Recurring)
                        </p>
                        <p className="text-sm text-orange-800/80 dark:text-orange-300/80">
                          Selain biaya pembuatan awal, terdapat komponen yang membutuhkan biaya perpanjangan secara rutin untuk menjaga sistem tetap berjalan:
                        </p>
                        <ul className="space-y-1 pl-4">
                          {recurringInfra.map(i => (
                            <li key={i.id} className="text-sm text-orange-800/90 dark:text-orange-300/90 list-disc">
                              <span className="font-semibold">{i.name}</span>
                              {' — '}{fmt(i.price)} / {i.type==='monthly'?'Bulan':'Tahun'}
                              {i.ppnPercent > 0 && ` (+ PPN ${i.ppnPercent}%)`}
                            </li>
                          ))}
                          {recurringAI.map(a => (
                            <li key={a.id} className="text-sm text-orange-800/90 dark:text-orange-300/90 list-disc">
                              <span className="font-semibold">{a.name} (AI Service)</span>
                              {' — '}{fmt(a.price)} / {a.billingType==='monthly'?'Bulan':'Tahun'}
                            </li>
                          ))}
                        </ul>
                        <p className="text-[11px] text-orange-700/60 dark:text-orange-400/60 italic pt-1">
                          * Biaya berlangganan tahun pertama sudah diakumulasikan ke dalam Grand Total estimasi di atas. Biaya untuk tahun-tahun berikutnya mengikuti siklus tagihan layanan masing-masing.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Notes ── */}
                {project.notes && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="inline-block w-auto max-w-full rounded-sm border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 print:block print:break-inside-avoid print:bg-blue-50 print:border-blue-200">
                    <div className="px-4 py-3 print:px-4 print:py-3">
                      <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1.5">
                        Catatan / Syarat & Ketentuan
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{project.notes}</p>
                    </div>
                  </motion.div>
                )}

              </main>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
