'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Mail, Plus, FileText, CreditCard, Search, FolderOpen, Printer, Loader2, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { generateDocumentHtml, ProjectData } from '@/lib/template-generator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface ProjectRecord {
  id: string;
  client_name: string;
  project_name: string;
  total_cost: number;
  data: ProjectData;
  created_at: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [clientFilter, setClientFilter] = useState(() => searchParams.get('client') || '');
  const [showSensitive, setShowSensitive] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => Number(searchParams.get('pageSize')) || 8);
  
  // Email Modal States
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailType, setEmailType] = useState<'QUOTATION' | 'INVOICE'>('QUOTATION');
  const [emailLoading, setEmailLoading] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

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

  const clients = useMemo(
    () => Array.from(new Set(projects.map(p => p.client_name).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [projects]
  );

  const filtered = projects.filter(p => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      p.client_name.toLowerCase().includes(keyword) ||
      p.project_name.toLowerCase().includes(keyword);
    const matchesClient = !clientFilter || p.client_name === clientFilter;

    return matchesSearch && matchesClient;
  });

  useEffect(() => {
    setPage(1);
  }, [search, clientFilter, pageSize]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('q', search);
    if (clientFilter) params.set('client', clientFilter);
    if (pageSize !== 8) params.set('pageSize', String(pageSize));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [clientFilter, pageSize, pathname, router, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  const handleExportPDF = (projectData: ProjectData, type: 'QUOTATION' | 'INVOICE' = 'QUOTATION', pId?: string) => {
    const html = generateDocumentHtml(projectData, type, pId, window.location.origin);

    // Use Blob URL to avoid about:blank in browser address bar and PDF footer
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    // Revoke the object URL after 60s to free memory
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    if (!win) {
      URL.revokeObjectURL(url);
      toast.error('Popup diblokir browser. Izinkan popup untuk halaman ini dan coba lagi.');
    }
  };

  const handleSendEmail = async () => {
    if (!emailTarget) return toast.error('Email tujuan harus diisi');
    if (!currentProjectId) return;
    
    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return toast.error('Proyek tidak ditemukan');

    let iframe: HTMLIFrameElement | null = null;
    
    try {
      setEmailLoading(true);

      // 1. Generate HTML document string in email mode (no fixed footer, no print script, no 40mm margin)
      const html = generateDocumentHtml(
        project.data as unknown as ProjectData,
        emailType,
        project.id,
        window.location.origin,
        'email'
      );

      // 2. Render HTML into a hidden iframe and capture via html2canvas
      iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px';
      iframe.style.height = '1123px';
      iframe.style.border = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Wait for iframe content to fully render
      await new Promise<void>(resolve => {
        const checkReady = () => {
          if (iframeDoc.readyState === 'complete') resolve();
          else iframe!.addEventListener('load', () => resolve(), { once: true });
        };
        checkReady();
      });

      // Extra wait for fonts/images inside iframe
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Expand iframe height to fit the entire document so absolutely positioned footers and contents don't get clipped or crushed
      const scrollHeight = iframeDoc.documentElement.scrollHeight;
      iframe.style.height = `${scrollHeight}px`;
      
      // Let the browser reflow after resize
      await new Promise(resolve => setTimeout(resolve, 300));

      // 3. Capture iframe body with html2canvas
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 3, // Increased scale for sharper text
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        onclone: (clonedDoc) => {
          // Force font loading in the cloned document before render
          const link = clonedDoc.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
          clonedDoc.head.appendChild(link);
        }
      });

      // Cleanup iframe immediately after capture
      document.body.removeChild(iframe);
      iframe = null;

      // 4. Generate custom-sized PDF to prevent page breaks cutting through text
      const pdfWidthMm = 210; // A4 width
      const pdfHeightMm = (canvas.height * pdfWidthMm) / canvas.width;
      
      // Create a single continuous page PDF
      const pdf = new jsPDF('p', 'mm', [pdfWidthMm, Math.max(pdfHeightMm, 297)]);
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm);

      // 5. Convert to File
      const pdfBlob = pdf.output('blob');
      const attachmentFilename = `${emailType === 'QUOTATION' ? 'Quotation' : 'Invoice'}_${project.project_name.replace(/\s+/g, '_')}.pdf`;
      const pdfFile = new File([pdfBlob], attachmentFilename, { type: 'application/pdf' });
      
      // 6. Build FormData & send
      const formData = new FormData();
      formData.append('projectId', currentProjectId);
      formData.append('emailType', emailType);
      formData.append('targetEmail', emailTarget);
      if (emailCc) formData.append('ccEmail', emailCc);
      formData.append('pdfFile', pdfFile);

      const res = await fetch('/api/cms/send-email', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success('Email berhasil dikirim!');
        setEmailModalOpen(false);
        setEmailTarget('');
        setEmailCc('');
      } else {
        toast.error(data.error || 'Gagal mengirim email');
      }
    } catch (err) {
      console.error('Send email error:', err);
      toast.error('Terjadi kesalahan saat membuat atau mengirim dokumen');
    } finally {
      // Always cleanup iframe if still attached
      if (iframe && iframe.parentNode) {
        document.body.removeChild(iframe);
      }
      setEmailLoading(false);
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col min-h-[400px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search client or project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-sm bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-0 transition-colors"
            />
          </div>
          <select
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="h-9 w-full sm:w-64 px-3 text-sm rounded-sm bg-muted/30 border-transparent focus-visible:border-primary focus-visible:ring-0 transition-colors"
            aria-label="Filter by client"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowSensitive(prev => !prev)}
            className="h-9 rounded-sm text-sm gap-2"
            title={showSensitive ? 'Hide client names and totals' : 'Show client names and totals'}
          >
            {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSensitive ? 'Hide' : 'Show'}
          </Button>
          {(search || clientFilter) && (
            <Button
              variant="outline"
              onClick={() => { setSearch(''); setClientFilter(''); }}
              className="h-9 rounded-sm text-sm"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-x-auto rounded-sm border border-border/40 bg-background">
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
              <thead className="bg-muted/20 text-xs uppercase tracking-wider font-semibold text-muted-foreground border-b border-border/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium text-right">Grand Total</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginated.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      <span className={showSensitive ? '' : 'inline-block blur-sm select-none'}>
                        {p.client_name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.project_name}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">
                      <span className={showSensitive ? '' : 'inline-block blur-sm select-none'}>
                        {fmt(p.total_cost)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:bg-muted" onClick={() => router.push(`/cms/calculator?id=${p.id}`)} title="Edit Project">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-primary hover:bg-primary/10" onClick={() => router.push(`/cms/report/${p.id}`)} title="View Quotation">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-blue-600 hover:bg-blue-50" onClick={() => router.push(`/cms/invoice/${p.id}`)} title="View Invoice">
                        <CreditCard className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-green-600 hover:bg-green-50" onClick={() => { setCurrentProjectId(p.id); setEmailType('QUOTATION'); setEmailModalOpen(true); }} title="Send Email">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <div className="flex border-l border-border ml-1 pl-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:bg-muted" onClick={() => handleExportPDF(p.data, 'QUOTATION', p.id)} title="Export Quotation PDF">
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:bg-muted" onClick={() => handleExportPDF(p.data, 'INVOICE', p.id)} title="Export Invoice PDF">
                          <CreditCard className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-destructive hover:bg-destructive/10 ml-1" onClick={() => handleDelete(p.id, p.project_name)} title="Delete">
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
          {!loading && projects.length > 0 && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-border/40 text-sm text-muted-foreground">
              <div>
                Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> - <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> projects
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                  className="h-8 rounded-sm bg-muted/30 border-transparent px-2 text-xs text-foreground"
                  aria-label="Rows per page"
                >
                  <option value={5}>5 / page</option>
                  <option value={8}>8 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-sm"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="min-w-20 text-center text-xs font-medium text-foreground">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-sm"
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kirim Email ke Klien</DialogTitle>
            <DialogDescription>
              Kirim quotation atau invoice langsung ke email klien.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emailTarget" className="text-right text-sm font-semibold">
                Email Tujuan
              </label>
              <Input
                id="emailTarget"
                type="email"
                placeholder="client@company.com (koma untuk multi)"
                value={emailTarget}
                onChange={(e) => setEmailTarget(e.target.value)}
                className="col-span-3 rounded-sm bg-muted/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emailCc" className="text-right text-sm font-semibold">
                CC Email
              </label>
              <Input
                id="emailCc"
                type="text"
                placeholder="opsional (koma untuk multi)"
                value={emailCc}
                onChange={(e) => setEmailCc(e.target.value)}
                className="col-span-3 rounded-sm bg-muted/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emailType" className="text-right text-sm font-semibold">
                Jenis Dokumen
              </label>
              <select
                id="emailType"
                value={emailType}
                onChange={(e) => setEmailType(e.target.value as 'QUOTATION' | 'INVOICE')}
                className="col-span-3 h-9 rounded-sm bg-muted/30 border-transparent focus-visible:border-primary px-3 text-sm"
              >
                <option value="QUOTATION">Quotation (Penawaran)</option>
                <option value="INVOICE">Invoice (Tagihan)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModalOpen(false)} disabled={emailLoading} className="rounded-sm">
              Batal
            </Button>
            <Button onClick={handleSendEmail} disabled={emailLoading || !emailTarget} className="rounded-sm">
              {emailLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              Kirim Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
