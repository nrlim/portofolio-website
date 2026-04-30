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
  data: ProjectData;
  created_at: string;
}

interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
interface AdditionalFee { id: string; name: string; price: number; }
interface AIService { id: string; name: string; aiModel?: string; pricingModel: string; price: number; qty?: number; }

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
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus proyek ${name}?`)) return;
    try {
      const res = await fetch(`/api/cms/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch { /* silently fail */ }
  };

  const filtered = projects.filter(p =>
    p.client_name.toLowerCase().includes(search.toLowerCase()) ||
    p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPDF = (projectData: ProjectData) => {
    const project = projectData || {};

    const devRoles      = Array.isArray(project.devRoles)       ? project.devRoles       : [];
    const infraItems    = Array.isArray(project.infraItems)     ? project.infraItems     : [];
    const additionalFees= Array.isArray(project.additionalFees) ? project.additionalFees : [];
    const aiServices    = Array.isArray(project.aiServices)     ? project.aiServices     : [];
    const licensePercent= typeof project.licensePercent === 'number' ? project.licensePercent : 10;
    const notes         = project.notes || '';

    const totalDevCost        = devRoles.reduce((s: number, r: DevRole) => s + (r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0)), 0);
    const totalInfraCost      = infraItems.reduce((s: number, i: InfraItem) => s + ((i.type==='monthly'?(i.price||0)*12:(i.price||0))*(1+(i.ppnPercent||0)/100)), 0);
    const totalAdditionalCost = additionalFees.reduce((s: number, f: AdditionalFee) => s + (f.price||0), 0);
    const totalAICost = aiServices.reduce((s: number, a: AIService) => {
      const basePrice = (a.price || 0) * (a.qty || 1);
      return s + (a.billingType === 'monthly' ? basePrice * 12 : basePrice);
    }, 0);
    const subTotal     = totalDevCost + totalInfraCost + totalAdditionalCost + totalAICost;
    const licenseCost  = subTotal * (licensePercent / 100);
    const grandTotal   = subTotal + licenseCost;

    // Helper: table cell
    const td = (val: string, align = 'left', bold = false) =>
      `<td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:${align};${bold?'font-weight:600;':''}">${val}</td>`;

    // Helper: table header cell
    const th = (label: string, align = 'left', w = '') =>
      `<th style="padding:7px 10px;background:#f1f5f9;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;text-align:${align};${w?`width:${w};`:''}white-space:nowrap">${label}</th>`;

    // Helper: section heading
    const sec = (n: string, t: string) =>
      `<div style="margin:18px 0 8px;padding-bottom:5px;border-bottom:1.5px solid #e2e8f0"><span style="font-size:13px;font-weight:700;color:#1e40af;text-transform:uppercase">${n}. ${t}</span></div>`;

    const devRows = devRoles.map((r: DevRole) =>
      `<tr>${td(r.role||'-')}${td(`${r.qty||0} org`,'center')}${td(`${r.days||0} hari`,'center')}${td(fmt((r.dailyRate||0)+(r.dailyAllowance||0)),'right')}${td(fmt((r.qty||0)*(r.days||0)*((r.dailyRate||0)+(r.dailyAllowance||0))),'right',true)}</tr>`
    ).join('');

    const infraRows = infraItems.map((i: InfraItem) => {
      const base = i.type==='monthly'?(i.price||0)*12:(i.price||0);
      const tipe = i.type==='monthly'?'Bulanan':i.type==='yearly'?'Tahunan':'Sekali Bayar';
      return `<tr>${td(i.name||'-')}${td(tipe,'center')}${td(fmt(i.price||0),'right')}${td(`${i.ppnPercent||0}%`,'right')}${td(fmt(base*(1+(i.ppnPercent||0)/100)),'right',true)}</tr>`;
    }).join('');

    const feeRows = additionalFees.map((f: AdditionalFee) =>
      `<tr>${td(f.name||'-')}${td(fmt(f.price||0),'right',true)}</tr>`
    ).join('');

    const aiRows = aiServices.map((a: AIService) => {
      const isUsageBased = ['per_page','per_1k_requests','per_1k_tokens','per_1m_tokens'].includes(a.pricingModel);
      const qtyText = isUsageBased ? `(${a.qty||1} x ${fmt(a.price||0)})` : fmt(a.price||0);
      const base = a.billingType === 'monthly' ? (a.price||0) * 12 : (a.price||0);
      const total = base * (a.qty||1);
      return `<tr>${td(a.name||'-')}${td(a.pricingModel||'-','center')}${td(qtyText,'right')}${td(fmt(total),'right',true)}</tr>`;
    }).join('');

    const sumRow = (label: string, val: string, cls = '') =>
      `<div style="display:flex;justify-content:space-between;padding:7px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;${cls}">${label}<span>${val}</span></div>`;

    const html = `<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8">
<title>Estimasi Biaya Proyek - ${project.projectName||'Tanpa Nama'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @page { size: A4 portrait; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; color:#1e293b; background:#fff; font-size:12px; line-height:1.5; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  table { width:100%; border-collapse:collapse; }
</style></head><body>
<table>
  <thead style="display:table-header-group">
    <tr><td style="padding:0">
      <div style="padding:10mm 14mm 5mm;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1e293b">
        <div>
          <div style="font-size:20px;font-weight:900;letter-spacing:-0.5px;line-height:1;color:#1e293b">Nuralim<span style="color:#2563eb">Dev</span></div>
          <div style="font-size:9px;color:#94a3b8;margin-top:2px">nuralimdev.com</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:22px;font-weight:800;color:#2563eb">ESTIMASI BIAYA</div>
          <div style="font-size:9px;color:#94a3b8;margin-top:2px">${project.projectDate||''}</div>
        </div>
      </div>
    </td></tr>
  </thead>
  <tfoot style="display:table-footer-group">
    <tr><td style="padding:0">
      <div style="padding:3mm 14mm 8mm;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0">
        <span style="font-size:8px;color:#94a3b8;font-weight:600">NuralimDev · nuralimdev.com</span>
        <span style="font-size:8px;color:#94a3b8;font-style:italic">Dokumen ini bersifat rahasia dan hanya untuk pihak yang dituju.</span>
      </div>
    </td></tr>
  </tfoot>
  <tbody><tr><td style="padding:0">
    <div style="padding:6mm 14mm 4mm">

      <!-- Project Meta -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 32px;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:3px;margin-bottom:14px">
        <div style="font-size:12px"><strong>Klien:</strong> ${project.clientName||'-'}</div>
        <div style="font-size:12px"><strong>Tanggal:</strong> ${project.projectDate||'-'}</div>
        <div style="font-size:12px"><strong>Proyek:</strong> ${project.projectName||'-'}</div>
        <div style="font-size:12px"><strong>Timeline:</strong> ${project.timelineStr||'-'} &nbsp;&middot;&nbsp; <strong>Total Fitur:</strong> ${project.totalFeatures||0}</div>
      </div>

      <!-- Development -->
      ${devRoles.length > 0 ? `${sec('1','Jasa Pembuatan Aplikasi (Development)')}
      <table><thead><tr>${th('Peran / Role','left','40%')}${th('Qty','center','10%')}${th('Durasi','center','12%')}${th('Daily Rate','right','19%')}${th('Total','right','19%')}</tr></thead>
      <tbody>${devRows}</tbody></table>` : ''}

      <!-- Infrastructure -->
      ${infraItems.length > 0 ? `${sec('2','Infrastruktur (Server & Domain)')}
      <table><thead><tr>${th('Item','left','32%')}${th('Tipe','center','13%')}${th('Harga / Periode','right','18%')}${th('PPN','right','8%')}${th('Total / Tahun','right','19%')}</tr></thead>
      <tbody>${infraRows}</tbody></table>` : ''}

      <!-- Additional Fees -->
      ${additionalFees.length > 0 ? `${sec('3','Biaya Tambahan (Lain-lain)')}
      <table><thead><tr>${th('Deskripsi','left','82%')}${th('Biaya','right','18%')}</tr></thead>
      <tbody>${feeRows}</tbody></table>` : ''}

      <!-- AI Services -->
      ${aiServices.length > 0 ? `${sec('4','AI Models / API Services')}
      <table><thead><tr>${th('Layanan','left','36%')}${th('Pricing Model','center','20%')}${th('Harga / Periode','right','22%')}${th('Total / Tahun','right','22%')}</tr></thead>
      <tbody>${aiRows}</tbody></table>` : ''}

      <!-- Summary -->
      <div style="width:340px;margin-left:auto;margin-top:16px;border:1px solid #e2e8f0;border-radius:3px;overflow:hidden">
        ${totalDevCost > 0 ? sumRow('<span>Development Cost</span>',fmt(totalDevCost)) : ''}
        ${totalInfraCost > 0 ? sumRow('<span>Infrastructure Cost</span>',fmt(totalInfraCost)) : ''}
        ${totalAdditionalCost > 0 ? sumRow('<span>Additional Fees</span>',fmt(totalAdditionalCost)) : ''}
        ${totalAICost > 0 ? sumRow('<span>AI Services</span>',fmt(totalAICost)) : ''}
        ${sumRow('<span style="font-weight:600">Subtotal</span>',fmt(subTotal),'background:#f8fafc;font-weight:600')}
        ${sumRow(`<span style="color:#475569">License / Margin (${licensePercent}%)</span>`,fmt(licenseCost))}
        <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#1e293b;color:#fff;font-size:14px;font-weight:800">
          <span>GRAND TOTAL</span><span>${fmt(grandTotal)}</span>
        </div>
      </div>

      <!-- Notes -->
      ${notes ? `<div style="display:inline-block;max-width:100%;margin-top:16px">
        <div style="padding:10px 14px;background:#eff6ff;border-left:3px solid #2563eb;border-radius:2px">
          <div style="font-size:10px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Catatan / Syarat &amp; Ketentuan</div>
          <div style="font-size:12px;color:#475569;white-space:pre-line;line-height:1.6">${notes.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>')}</div>
        </div>
      </div>` : ''}

    </div>
  </td></tr></tbody>
</table>
<script>window.onload=()=>{window.print()}<\/script>
</body></html>`;

    // Use Blob URL to avoid about:blank in browser address bar and PDF footer
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    // Revoke the object URL after 60s to free memory
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    if (!win) {
      URL.revokeObjectURL(url);
      alert('Popup diblokir browser. Izinkan popup untuk halaman ini dan coba lagi.');
    }
  };

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Manage your saved project estimations.</p>
        </div>
        <Link href="/cms/calculator">
          <Button className="gap-2 shadow-sm rounded-sm h-9 text-sm font-semibold whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Project
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
