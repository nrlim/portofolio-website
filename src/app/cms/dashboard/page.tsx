'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Search, FolderOpen, Printer, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface ProjectRecord {
  id: string;
  client_name: string;
  project_name: string;
  total_cost: number;
  data: any;
  created_at: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      // silently fail — list will remain empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus proyek ${name}?`)) return;
    try {
      const res = await fetch(`/api/cms/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch {
      // silently fail
    }
  };

  const filtered = projects.filter(p => 
    p.client_name.toLowerCase().includes(search.toLowerCase()) || 
    p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPDF = (projectData: any) => {
    const project = projectData || {};
    const win = window.open('', '_blank');
    if (!win) return;

    // Defensive arrays
    const devRoles = Array.isArray(project.devRoles) ? project.devRoles : [];
    const infraItems = Array.isArray(project.infraItems) ? project.infraItems : [];
    const additionalFees = Array.isArray(project.additionalFees) ? project.additionalFees : [];
    const aiServices = Array.isArray(project.aiServices) ? project.aiServices : [];
    const licensePercent = typeof project.licensePercent === 'number' ? project.licensePercent : 10;
    const notes = project.notes || '';

    // Recalculate totals for PDF
    const totalDevCost = devRoles.reduce((sum: number, role: any) => sum + ((role.qty || 0) * (role.days || 0) * ((role.dailyRate || 0) + (role.dailyAllowance || 0))), 0);
    const totalInfraCost = infraItems.reduce((sum: number, item: any) => sum + (((item.type === 'monthly' ? (item.price || 0) * 12 : (item.price || 0))) * (1 + (item.ppnPercent || 0) / 100)), 0);
    const totalAdditionalCost = additionalFees.reduce((sum: number, fee: any) => sum + (fee.price || 0), 0);
    const totalAICost = aiServices.reduce((sum: number, ai: any) => sum + (ai.price || 0), 0);
    const subTotalCost = totalDevCost + totalInfraCost + totalAdditionalCost + totalAICost;
    const licenseCost = subTotalCost * (licensePercent / 100);
    const grandTotal = subTotalCost + licenseCost;

    const devRows = devRoles.map((item: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.role || '-'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.qty || 0} Org</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.days || 0} Hr</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt((item.qty || 0) * (item.days || 0) * ((item.dailyRate || 0) + (item.dailyAllowance || 0)))}</td></tr>`).join('');
    const infraRows = infraItems.map((item: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name || '-'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.type === 'monthly' ? 'Bulanan' : 'Tahunan'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${item.ppnPercent || 0}%</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(((item.type === 'monthly' ? (item.price || 0) * 12 : (item.price || 0))) * (1 + (item.ppnPercent || 0) / 100))}</td></tr>`).join('');
    const aiRows = aiServices.map((item: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name || '-'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.pricingModel || '-'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(item.price || 0)}</td></tr>`).join('');

    win.document.write(`<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8"><title>Estimasi Biaya Proyek - ${project.projectName || 'Tanpa Nama'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;color:#1e293b;background:#fff;padding:40px;font-size:13px;line-height:1.5}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #2563eb}
  .brand{font-size:24px;font-weight:800;color:#1e293b} .brand span{color:#2563eb}
  .doc-label h1{font-size:24px;font-weight:800;color:#2563eb;text-align:right}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px;background:#f8fafc;padding:15px;border-radius:4px}
  .section-title{font-size:14px;font-weight:700;color:#1e40af;margin:20px 0 10px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:5px}
  table{width:100%;border-collapse:collapse;margin-bottom:15px}
  thead th{background:#f1f5f9;padding:8px;color:#475569;font-size:11px;font-weight:700;text-transform:uppercase;text-align:left}
  .summary-box{width:350px;float:right;border:1px solid #e2e8f0;margin-top:20px}
  .sum-row{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #e2e8f0}
  .sum-row.bold{font-weight:700;background:#f8fafc}
  .sum-row.total{background:#2563eb;color:#fff;font-size:16px;font-weight:800;border:none;padding:12px}
  .clearfix::after{content:"";clear:both;display:table}
  .notes{margin-top:40px;padding:15px;background:#f0f9ff;border-left:4px solid #2563eb;clear:both}
  .notes h3{font-size:12px;font-weight:700;color:#1e40af;margin-bottom:5px;text-transform:uppercase}
</style></head><body>
<div class="header"><div class="brand">Nuralim<span>Dev</span></div><div class="doc-label"><h1>ESTIMASI BIAYA</h1></div></div>
<div class="meta">
  <div><p><strong>Klien:</strong> ${project.clientName || '-'}</p><p><strong>Proyek:</strong> ${project.projectName || '-'}</p></div>
  <div><p><strong>Tanggal:</strong> ${project.projectDate || '-'}</p><p><strong>Timeline:</strong> ${project.timelineStr || '-'} | <strong>Total Fitur:</strong> ${project.totalFeatures || 0}</p></div>
</div>
<h2 class="section-title">1. Jasa Pembuatan Aplikasi (Development)</h2><table><thead><tr><th>Peran (Role)</th><th style="text-align:center">Qty</th><th style="text-align:center">Durasi</th><th style="text-align:right">Total Biaya</th></tr></thead><tbody>${devRows}</tbody></table>
<h2 class="section-title">2. Infrastruktur (Server & Domain 1 Tahun Pertama)</h2><table><thead><tr><th>Item</th><th style="text-align:center">Tipe</th><th style="text-align:right">PPN</th><th style="text-align:right">Total Biaya</th></tr></thead><tbody>${infraRows}</tbody></table>
${additionalFees.length > 0 ? `<h2 class="section-title">3. Biaya Tambahan (Lain-lain)</h2><table><thead><tr><th>Deskripsi</th><th style="text-align:right">Biaya</th></tr></thead><tbody>${additionalFees.map((fee: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${fee.name || '-'}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(fee.price || 0)}</td></tr>`).join('')}</tbody></table>` : ''}
${aiServices.length > 0 ? `<h2 class="section-title">4. AI Models / API Services</h2><table><thead><tr><th>Deskripsi Layanan AI</th><th style="text-align:center">Model Pricing</th><th style="text-align:right">Biaya (Est)</th></tr></thead><tbody>${aiRows}</tbody></table>` : ''}
<div class="clearfix"><div class="summary-box">
  <div class="sum-row"><span>Total Jasa Development</span><span>${fmt(totalDevCost)}</span></div>
  <div class="sum-row"><span>Total Infrastruktur</span><span>${fmt(totalInfraCost)}</span></div>
  <div class="sum-row"><span>Biaya Tambahan</span><span>${fmt(totalAdditionalCost)}</span></div>
  ${aiServices.length > 0 ? `<div class="sum-row"><span>AI Services</span><span>${fmt(totalAICost)}</span></div>` : ''}
  <div class="sum-row bold"><span>Subtotal</span><span>${fmt(subTotalCost)}</span></div>
  <div class="sum-row"><span>License Cost (${licensePercent}%)</span><span>${fmt(licenseCost)}</span></div>
  <div class="sum-row total"><span>GRAND TOTAL</span><span>${fmt(grandTotal)}</span></div>
</div></div>
${notes ? `<div class="notes"><h3>Catatan / Syarat & Ketentuan</h3><p>${notes.replace(/\n/g, '<br/>')}</p></div>` : ''}
<script>window.onload=()=>{window.print()}<\/script></body></html>`);
    win.document.close();
  };

  return (
    <main className="p-4 md:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Manage your saved project estimations.</p>
        </div>
        
        <Link href="/cms/calculator">
          <Button className="gap-2 shadow-sm rounded-sm h-9 text-sm font-semibold whitespace-nowrap">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-sm border border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search client or project..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
              <FolderOpen className="w-10 h-10 opacity-50" />
              <p>No projects saved yet.</p>
              <Link href="/cms/calculator">
                <Button variant="outline" className="rounded-sm mt-2">Create One</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium text-right">Grand Total</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-5 py-3 font-medium">{p.client_name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.project_name}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(p.total_cost)}</td>
                    <td className="px-5 py-3 text-right flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:bg-muted" onClick={() => router.push(`/cms/calculator?id=${p.id}`)} title="Edit Project">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-primary hover:bg-primary/10" onClick={() => router.push(`/cms/report/${p.id}`)} title="View Report">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-primary hover:bg-primary/10" onClick={() => handleExportPDF(p.data)} title="Export PDF">
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id, p.project_name)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && projects.length > 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No matches found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

    </main>
  );
}
