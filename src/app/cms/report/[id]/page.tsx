'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Users, Server, Settings2, Cpu, DollarSign, LucideProps } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
  interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
  interface AdditionalFee { id: string; name: string; price: number; }
  interface AIService { id: string; name: string; pricingModel: string; price: number; }

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

  const devRoles = Array.isArray(project.devRoles) ? project.devRoles : [];
  const infraItems = Array.isArray(project.infraItems) ? project.infraItems : [];
  const additionalFees = Array.isArray(project.additionalFees) ? project.additionalFees : [];
  const aiServices = Array.isArray(project.aiServices) ? project.aiServices : [];
  const licensePercent = typeof project.licensePercent === 'number' ? project.licensePercent : 10;

  const totalDevCost = devRoles.reduce((s: number, r: DevRole) => s + ((r.qty || 0) * (r.days || 0) * ((r.dailyRate || 0) + (r.dailyAllowance || 0))), 0);
  const totalInfraCost = infraItems.reduce((s: number, i: InfraItem) => s + ((i.type === 'monthly' ? (i.price || 0) * 12 : (i.price || 0)) * (1 + (i.ppnPercent || 0) / 100)), 0);
  const totalAdditionalCost = additionalFees.reduce((s: number, f: AdditionalFee) => s + (f.price || 0), 0);
  const totalAICost = aiServices.reduce((s: number, a: AIService) => s + (a.price || 0), 0);
  const subTotal = totalDevCost + totalInfraCost + totalAdditionalCost + totalAICost;
  const licenseCost = subTotal * (licensePercent / 100);
  const grandTotal = subTotal + licenseCost;

  const handlePrint = () => window.print();

  interface SectionHeaderProps {
    icon: ComponentType<LucideProps>;
    title: string;
    subtitle?: string;
    cost?: number;
  }
  const SectionHeader = ({ icon: Icon, title, subtitle, cost }: SectionHeaderProps) => (
    <div className="flex items-center gap-3 px-6 py-4 bg-muted/10 border-b border-border">
      <div className="p-2 bg-primary/10 rounded-sm text-primary"><Icon className="w-4 h-4" /></div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {cost !== undefined && (
        <span className="text-sm font-semibold tabular-nums">{fmt(cost)}</span>
      )}
    </div>
  );

  return (
    <main className="p-4 md:p-8 w-full space-y-6 print:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Project Report</h1>
          </div>
          <p className="text-sm text-muted-foreground pl-11">Ringkasan estimasi biaya proyek secara lengkap.</p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="gap-2 shadow-sm rounded-sm h-10 px-4 font-semibold whitespace-nowrap">
          <Printer className="w-4 h-4" /> Print / Export PDF
        </Button>
      </div>

      {/* Print Header (shown only when printing) */}
      <div className="hidden print:flex justify-between items-center border-b-2 border-primary pb-4 mb-6">
        <div className="text-2xl font-extrabold">NuralimDev</div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Estimasi Biaya Proyek</p>
        </div>
      </div>

      {/* Project Meta */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-sm border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {[
            { label: 'Client', value: project.clientName || '-' },
            { label: 'Project', value: project.projectName || '-' },
            { label: 'Tanggal', value: project.projectDate || '-' },
            { label: 'Timeline', value: project.timelineStr ? `${project.timelineStr} | ${project.totalFeatures || 0} Fitur` : '-' },
          ].map((item) => (
            <div key={item.label} className="px-6 py-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">

        {/* Development */}
        {devRoles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
            <SectionHeader icon={Users} title="Jasa Pembuatan Aplikasi (Development)" cost={totalDevCost} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-left">Peran (Role)</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-center">Qty</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-center">Durasi</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Daily Rate</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {devRoles.map((r: DevRole) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-5 py-3 font-medium">{r.role || '-'}</td>
                      <td className="px-5 py-3 text-center text-muted-foreground">{r.qty} org</td>
                      <td className="px-5 py-3 text-center text-muted-foreground">{r.days} hari</td>
                      <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{fmt((r.dailyRate || 0) + (r.dailyAllowance || 0))}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt((r.qty || 0) * (r.days || 0) * ((r.dailyRate || 0) + (r.dailyAllowance || 0)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Infrastructure */}
        {infraItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
            <SectionHeader icon={Server} title="Infrastruktur (Server & Domain)" cost={totalInfraCost} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-left">Item</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-center">Tipe</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Harga / Periode</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">PPN</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Total / Tahun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {infraItems.map((i: InfraItem) => {
                    const base = i.type === 'monthly' ? (i.price || 0) * 12 : (i.price || 0);
                    return (
                      <tr key={i.id} className="hover:bg-muted/5 transition-colors">
                        <td className="px-5 py-3 font-medium">{i.name || '-'}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-sm font-medium">
                            {i.type === 'monthly' ? 'Bulanan' : i.type === 'yearly' ? 'Tahunan' : 'Sekali Bayar'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{fmt(i.price || 0)}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground">{i.ppnPercent || 0}%</td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(base * (1 + (i.ppnPercent || 0) / 100))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* AI Services */}
        {aiServices.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
            <SectionHeader icon={Cpu} title="AI Models & API Services" cost={totalAICost} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-left">Layanan</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-center">Pricing Model</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Estimasi Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {aiServices.map((a: AIService) => (
                    <tr key={a.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-5 py-3 font-medium">{a.name || '-'}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-sm font-medium">{a.pricingModel || '-'}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(a.price || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Additional Fees */}
        {additionalFees.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
            <SectionHeader icon={Settings2} title="Biaya Tambahan (Lain-lain)" cost={totalAdditionalCost} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-left">Deskripsi</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-muted-foreground text-right">Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {additionalFees.map((f: AdditionalFee) => (
                    <tr key={f.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-5 py-3 font-medium">{f.name || '-'}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(f.price || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-sm border border-primary/20 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-2 text-primary">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-sm">Grand Total Summary</span>
          </div>
          <div className="divide-y divide-border">
            {totalDevCost > 0 && (
              <div className="flex justify-between px-6 py-3.5 text-sm">
                <span className="text-muted-foreground">Development Cost</span>
                <span className="font-medium tabular-nums">{fmt(totalDevCost)}</span>
              </div>
            )}
            {totalInfraCost > 0 && (
              <div className="flex justify-between px-6 py-3.5 text-sm">
                <span className="text-muted-foreground">Infrastructure Cost</span>
                <span className="font-medium tabular-nums">{fmt(totalInfraCost)}</span>
              </div>
            )}
            {totalAdditionalCost > 0 && (
              <div className="flex justify-between px-6 py-3.5 text-sm">
                <span className="text-muted-foreground">Additional Fees</span>
                <span className="font-medium tabular-nums">{fmt(totalAdditionalCost)}</span>
              </div>
            )}
            {totalAICost > 0 && (
              <div className="flex justify-between px-6 py-3.5 text-sm">
                <span className="text-muted-foreground">AI Services</span>
                <span className="font-medium tabular-nums">{fmt(totalAICost)}</span>
              </div>
            )}
            <div className="flex justify-between px-6 py-3.5 text-sm bg-muted/30 font-semibold">
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(subTotal)}</span>
            </div>
            <div className="flex justify-between px-6 py-3.5 text-sm">
              <span className="text-muted-foreground">License / Margin ({licensePercent}%)</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{fmt(licenseCost)}</span>
            </div>
          </div>
          <div className="flex justify-between px-6 py-5 bg-primary text-primary-foreground">
            <span className="font-bold text-lg">GRAND TOTAL</span>
            <span className="font-bold text-2xl tabular-nums">{fmt(grandTotal)}</span>
          </div>
        </motion.div>

        {/* Notes */}
        {project.notes && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-sm p-5">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">Catatan / Syarat & Ketentuan</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{project.notes}</p>
          </motion.div>
        )}

      </div>
    </main>
  );
}
