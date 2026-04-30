'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FileText, ChevronDown, ChevronUp, Server, Users, Settings2, DollarSign, Save, Cpu } from 'lucide-react';

interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
interface AdditionalFee { id: string; name: string; price: number; }
interface AIService { id: string; name: string; pricingModel: string; price: number; }

interface MasterDataConfig {
  devRoles: DevRole[];
  infraItems: InfraItem[];
  additionalFees: AdditionalFee[];
  aiServices: AIService[];
  licensePercent: number;
}

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

const genId = () => crypto.randomUUID();
const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function ComboboxInput<T>({
  value, onChange, onSelect, options, placeholder
}: {
  value: string; onChange: (val: string) => void; onSelect: (item: T) => void;
  options: { label: string; data: T }[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = options.filter(o => o.label.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className={`bg-background transition-colors ${open && filtered.length > 0 ? 'rounded-t-sm rounded-b-none focus-visible:ring-0 focus-visible:border-primary' : 'rounded-sm'}`}
        placeholder={placeholder}
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="absolute z-50 w-full bg-popover text-popover-foreground border border-t-0 border-border rounded-b-sm shadow-md max-h-48 overflow-y-auto">
            {filtered.map((opt, i) => (
              <div 
                key={i} 
                className="px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                onClick={() => { onSelect(opt.data); setOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CalculatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;
  
  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>('info');
  const [saving, setSaving] = useState(false);

  const [project, setProject] = useState<ProjectData>({
    clientName: '', projectName: '', projectDate: new Date().toISOString().split('T')[0],
    validUntil: '', timelineStr: '', totalFeatures: 0,
    devRoles: [], infraItems: [], additionalFees: [], aiServices: [], licensePercent: 10,
    notes: '',
  });

  const [masterData, setMasterData] = useState<MasterDataConfig | null>(null);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const res = await fetch('/api/cms/master-data');
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
            setMasterData(data.config);
            if (!isEditMode) {
              setProject(p => ({ ...p, licensePercent: data.config.licensePercent || 10 }));
            }
          }
        }
      } catch {
        // silently fail — master data will be empty
      }
    };
    loadMasterData();
  }, [isEditMode]);

  useEffect(() => {
    if (!editId) return;
    const loadProject = async () => {
      try {
        const res = await fetch(`/api/cms/projects?id=${editId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.project?.data) {
            setProject(data.project.data);
          }
        }
      } catch {
        // silently fail — project will not be pre-filled
      }
    };
    loadProject();
  }, [editId]);

  const toggleSection = (id: string) => setOpenSection(prev => prev === id ? null : id);

  const updateDevRole = <K extends keyof DevRole>(id: string, field: K, value: DevRole[K]) => setProject(p => ({ ...p, devRoles: p.devRoles.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  const updateInfra = <K extends keyof InfraItem>(id: string, field: K, value: InfraItem[K]) => setProject(p => ({ ...p, infraItems: p.infraItems.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  const updateFee = <K extends keyof AdditionalFee>(id: string, field: K, value: AdditionalFee[K]) => setProject(p => ({ ...p, additionalFees: p.additionalFees.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  const updateAI = <K extends keyof AIService>(id: string, field: K, value: AIService[K]) => setProject(p => ({ ...p, aiServices: p.aiServices.map(i => i.id === id ? { ...i, [field]: value } : i) }));

  const totalDevCost = project.devRoles.reduce((sum, role) => sum + (role.qty * role.days * (role.dailyRate + role.dailyAllowance)), 0);
  const totalInfraCost = project.infraItems.reduce((sum, item) => sum + ((item.type === 'monthly' ? item.price * 12 : item.price) * (1 + item.ppnPercent / 100)), 0);
  const totalAdditionalCost = project.additionalFees.reduce((sum, fee) => sum + fee.price, 0);
  const totalAICost = project.aiServices.reduce((sum, ai) => sum + ai.price, 0);
  const subTotalCost = totalDevCost + totalInfraCost + totalAdditionalCost + totalAICost;
  const licenseCost = subTotalCost * (project.licensePercent / 100);
  const grandTotal = subTotalCost + licenseCost;

  const handleSaveProject = async () => {
    if (!project.clientName || !project.projectName) return alert("Client Name dan Project Name wajib diisi.");
    setSaving(true);
    try {
      const payload = { client_name: project.clientName, project_name: project.projectName, total_cost: grandTotal, data: project };
      const res = await fetch(
        isEditMode ? `/api/cms/projects?id=${editId}` : '/api/cms/projects',
        { method: isEditMode ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (res.ok) { alert(isEditMode ? 'Project updated!' : 'Project saved!'); router.push('/cms/dashboard'); }
      else alert('Failed to save project.');
    } catch { alert('Error saving project.'); }
    finally { setSaving(false); }
  };


  return (
    <main className="p-4 md:p-8 w-full space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {isEditMode ? 'Edit Project' : 'Project Calculator'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Perbarui estimasi biaya project yang sudah tersimpan.' : 'Kalkulasi biaya project berdasarkan Master Data.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSaveProject} disabled={saving} className="gap-2 shadow-sm rounded-sm h-10 px-6 font-semibold whitespace-nowrap">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : (isEditMode ? 'Update Project' : 'Save Project')}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Section 1: Info */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('info')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><FileText className="w-5 h-5" /></div>
              <div className="text-left"><h2 className="font-semibold text-sm">Project Scope</h2><p className="text-xs text-muted-foreground">Detail klien dan proyek</p></div>
            </div>
            {openSection === 'info' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {openSection === 'info' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Client Name</label><Input value={project.clientName} onChange={e => setProject(p => ({ ...p, clientName: e.target.value }))} className="rounded-sm bg-background" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Project Name</label><Input value={project.projectName} onChange={e => setProject(p => ({ ...p, projectName: e.target.value }))} className="rounded-sm bg-background" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Date</label><Input type="date" value={project.projectDate} onChange={e => setProject(p => ({ ...p, projectDate: e.target.value }))} className="rounded-sm bg-background" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Timeline Str</label><Input value={project.timelineStr} onChange={e => setProject(p => ({ ...p, timelineStr: e.target.value }))} className="rounded-sm bg-background" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Total Features</label><Input type="number" value={project.totalFeatures} onChange={e => setProject(p => ({ ...p, totalFeatures: Number(e.target.value) }))} className="rounded-sm bg-background" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">License Margin (%)</label><Input type="number" step="0.1" value={project.licensePercent} onChange={e => setProject(p => ({ ...p, licensePercent: Number(e.target.value) }))} className="rounded-sm bg-background" /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 2: Developers */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('dev')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Users className="w-5 h-5" /></div>
              <div className="text-left"><h2 className="font-semibold text-sm">Developer Roles & Timeline</h2><p className="text-xs text-muted-foreground">Kalkulasi: {fmt(totalDevCost)}</p></div>
            </div>
            {openSection === 'dev' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {openSection === 'dev' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-4">
                  {project.devRoles.map(role => (
                    <div key={role.id} className="relative p-5 bg-muted/5 border border-border rounded-sm group">
                      <div className="absolute top-3 right-3"><Button variant="ghost" size="icon" onClick={() => setProject(p => ({ ...p, devRoles: p.devRoles.filter(r => r.id !== role.id) }))} className="text-destructive h-8 w-8 hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-4 pr-10">
                        <div className="md:col-span-4">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Role</label>
                          <ComboboxInput 
                            value={role.role} 
                            onChange={val => updateDevRole(role.id, 'role', val)}
                            onSelect={match => setProject(p => ({ ...p, devRoles: p.devRoles.map(i => i.id === role.id ? { ...i, role: match.role, dailyRate: match.dailyRate, dailyAllowance: match.dailyAllowance } : i) }))}
                            options={masterData?.devRoles?.map((r: DevRole) => ({ label: r.role, data: r })) || []}
                            placeholder="Pilih atau ketik role..."
                          />
                        </div>
                        <div className="md:col-span-2"><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Qty</label><Input type="number" value={role.qty} onChange={e => updateDevRole(role.id, 'qty', Number(e.target.value))} className="rounded-sm bg-background" /></div>
                        <div className="md:col-span-2"><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Days</label><Input type="number" value={role.days} onChange={e => updateDevRole(role.id, 'days', Number(e.target.value))} className="rounded-sm bg-background" /></div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Daily Rate</label>
                          <Input 
                            type="text" 
                            value={role.dailyRate === 0 ? '' : new Intl.NumberFormat('id-ID').format(role.dailyRate)} 
                            onChange={e => updateDevRole(role.id, 'dailyRate', Number(e.target.value.replace(/\D/g, '')))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Daily Allow.</label>
                          <Input 
                            type="text" 
                            value={role.dailyAllowance === 0 ? '' : new Intl.NumberFormat('id-ID').format(role.dailyAllowance)} 
                            onChange={e => updateDevRole(role.id, 'dailyAllowance', Number(e.target.value.replace(/\D/g, '')))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                      </div>
                      <div className="bg-background border border-border px-4 py-2 rounded-sm text-right text-sm"><span className="text-muted-foreground mr-2">Total Role Cost:</span><span className="font-semibold tabular-nums">{fmt(role.qty * role.days * (role.dailyRate + role.dailyAllowance))}</span></div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setProject(p => ({ ...p, devRoles: [...p.devRoles, { id: genId(), role: '', qty: 1, days: 22, dailyRate: 0, dailyAllowance: 0 }] }))} className="w-full gap-2 border-dashed"><Plus className="w-4 h-4" /> Add Role</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 3: Infra */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('infra')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Server className="w-5 h-5" /></div>
              <div className="text-left"><h2 className="font-semibold text-sm">Infrastructure</h2><p className="text-xs text-muted-foreground">Kalkulasi: {fmt(totalInfraCost)}</p></div>
            </div>
            {openSection === 'infra' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {openSection === 'infra' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-4">
                  {project.infraItems.map(item => (
                    <div key={item.id} className="relative p-5 bg-muted/5 border border-border rounded-sm group">
                      <div className="absolute top-3 right-3"><Button variant="ghost" size="icon" onClick={() => setProject(p => ({ ...p, infraItems: p.infraItems.filter(r => r.id !== item.id) }))} className="text-destructive h-8 w-8 hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button></div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-4 pr-10">
                        <div className="md:col-span-5">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Item</label>
                          <ComboboxInput 
                            value={item.name} 
                            onChange={val => updateInfra(item.id, 'name', val)}
                            onSelect={match => setProject(p => ({ ...p, infraItems: p.infraItems.map(i => i.id === item.id ? { ...i, name: match.name, type: match.type, price: match.price, ppnPercent: match.ppnPercent } : i) }))}
                            options={masterData?.infraItems?.map((r: InfraItem) => ({ label: r.name, data: r })) || []}
                            placeholder="Pilih atau ketik infrastruktur..."
                          />
                        </div>
                        <div className="md:col-span-3"><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Billing</label><select value={item.type} onChange={e => updateInfra(item.id, 'type', e.target.value as InfraItem['type'])} className="h-9 w-full px-3 text-sm rounded-sm border border-input bg-background"><option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="one-time">One-Time</option></select></div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price (Rp)</label>
                          <Input 
                            type="text" 
                            value={item.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(item.price)} 
                            onChange={e => updateInfra(item.id, 'price', Number(e.target.value.replace(/\D/g, '')))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                        <div className="md:col-span-2"><label className="text-xs font-semibold text-muted-foreground mb-1.5 block">PPN (%)</label><Input type="number" value={item.ppnPercent} onChange={e => updateInfra(item.id, 'ppnPercent', Number(e.target.value))} className="rounded-sm bg-background" /></div>
                      </div>
                      <div className="bg-background border border-border px-4 py-2 rounded-sm text-right text-sm"><span className="text-muted-foreground mr-2">Total Item Cost:</span><span className="font-semibold tabular-nums">{fmt((item.type === 'monthly' ? item.price * 12 : item.price) * (1 + item.ppnPercent / 100))}</span></div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setProject(p => ({ ...p, infraItems: [...p.infraItems, { id: genId(), name: '', type: 'monthly', price: 0, ppnPercent: 11 }] }))} className="w-full gap-2 border-dashed"><Plus className="w-4 h-4" /> Add Infrastructure</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 4: AI & Other */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          
          <div className="bg-card rounded-sm border border-border shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-muted/10"><h2 className="font-semibold text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-muted-foreground" /> AI Models & APIs</h2></div>
            <div className="p-6 flex-1 space-y-4">
              {project.aiServices.map(ai => (
                <div key={ai.id} className="flex flex-col gap-3 p-4 border border-border rounded-sm bg-muted/5 relative">
                  <Button variant="ghost" size="icon" onClick={() => setProject(p => ({ ...p, aiServices: p.aiServices.filter(r => r.id !== ai.id) }))} className="absolute top-2 right-2 text-destructive h-8 w-8 hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                  <div className="pr-10">
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Service</label>
                    <ComboboxInput 
                      value={ai.name} 
                      onChange={val => updateAI(ai.id, 'name', val)}
                      onSelect={match => setProject(p => ({ ...p, aiServices: p.aiServices.map(i => i.id === ai.id ? { ...i, name: match.name, pricingModel: match.pricingModel, price: match.price } : i) }))}
                      options={masterData?.aiServices?.map((r: AIService) => ({ label: r.name, data: r })) || []}
                      placeholder="Pilih atau ketik AI service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Pricing Model</label>
                      <select 
                        value={ai.pricingModel} 
                        onChange={e => updateAI(ai.id, 'pricingModel', e.target.value)} 
                        className="h-9 w-full px-3 text-sm rounded-sm border border-input bg-background shadow-sm"
                      >
                        <option value="per_1k_tokens">Per 1k Tokens</option>
                        <option value="per_1m_tokens">Per 1M Tokens</option>
                        <option value="per_1k_requests">Per 1k Requests</option>
                        <option value="per_page">Per Page</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price (Rp)</label>
                      <Input 
                        type="text" 
                        value={ai.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(ai.price)} 
                        onChange={e => updateAI(ai.id, 'price', Number(e.target.value.replace(/\D/g, '')))} 
                        className="rounded-sm h-9 bg-background" 
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => setProject(p => ({ ...p, aiServices: [...p.aiServices, { id: genId(), name: '', pricingModel: 'monthly', price: 0 }] }))} className="w-full gap-2 border-dashed"><Plus className="w-4 h-4" /> Add AI Service</Button>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/5 flex justify-between"><span className="text-sm text-muted-foreground">Subtotal AI</span><span className="text-sm font-semibold">{fmt(totalAICost)}</span></div>
          </div>

          <div className="bg-card rounded-sm border border-border shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-muted/10"><h2 className="font-semibold text-sm flex items-center gap-2"><Settings2 className="w-4 h-4 text-muted-foreground" /> Additional Fees</h2></div>
            <div className="p-6 flex-1 space-y-4">
              {project.additionalFees.map(fee => (
                <div key={fee.id} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description</label>
                    <ComboboxInput 
                      value={fee.name} 
                      onChange={val => updateFee(fee.id, 'name', val)}
                      onSelect={match => setProject(p => ({ ...p, additionalFees: p.additionalFees.map(i => i.id === fee.id ? { ...i, name: match.name, price: match.price } : i) }))}
                      options={masterData?.additionalFees?.map((r: AdditionalFee) => ({ label: r.name, data: r })) || []}
                      placeholder="Pilih atau ketik fee..."
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price</label>
                    <Input 
                      type="text" 
                      value={fee.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(fee.price)} 
                      onChange={e => updateFee(fee.id, 'price', Number(e.target.value.replace(/\D/g, '')))} 
                      className="rounded-sm h-9" 
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setProject(p => ({ ...p, additionalFees: p.additionalFees.filter(r => r.id !== fee.id) }))} className="text-destructive h-9 w-9 mb-[1px] hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setProject(p => ({ ...p, additionalFees: [...p.additionalFees, { id: genId(), name: '', price: 0 }] }))} className="w-full gap-2 border-dashed mt-2"><Plus className="w-4 h-4" /> Add Fee</Button>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/5 flex justify-between"><span className="text-sm text-muted-foreground">Subtotal Fees</span><span className="text-sm font-semibold">{fmt(totalAdditionalCost)}</span></div>
          </div>
        </div>

        {/* Notes & Summary block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 items-start">
          <div className="bg-card rounded-sm border border-border shadow-sm p-6">
            <label className="text-sm font-semibold flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-muted-foreground" /> Catatan Tambahan (PDF)</label>
            <textarea value={project.notes} onChange={e => setProject(p => ({ ...p, notes: e.target.value }))} rows={8} className="w-full p-4 text-sm rounded-sm border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>

          {/* Final Summary Card */}
          <div className="bg-card rounded-sm border border-primary/20 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-primary/5 text-primary"><span className="font-semibold text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" /> Grand Total Summary</span></div>
            <div className="divide-y divide-border">
              <div className="flex justify-between px-6 py-4 text-sm"><span className="text-muted-foreground">Development Cost</span><span className="font-medium tabular-nums">{fmt(totalDevCost)}</span></div>
              <div className="flex justify-between px-6 py-4 text-sm"><span className="text-muted-foreground">Infrastructure Cost</span><span className="font-medium tabular-nums">{fmt(totalInfraCost)}</span></div>
              <div className="flex justify-between px-6 py-4 text-sm"><span className="text-muted-foreground">Additional Fees</span><span className="font-medium tabular-nums">{fmt(totalAdditionalCost)}</span></div>
              {project.aiServices.length > 0 && <div className="flex justify-between px-6 py-4 text-sm"><span className="text-muted-foreground">AI Services</span><span className="font-medium tabular-nums">{fmt(totalAICost)}</span></div>}
              <div className="flex justify-between px-6 py-4 text-sm bg-muted/30 font-semibold"><span>Subtotal Cost</span><span className="tabular-nums">{fmt(subTotalCost)}</span></div>
              <div className="flex justify-between px-6 py-4 text-sm"><span className="text-muted-foreground">License Cost ({project.licensePercent}%)</span><span className="font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{fmt(licenseCost)}</span></div>
            </div>
            <div className="flex justify-between px-6 py-6 bg-primary text-primary-foreground"><span className="font-bold text-lg">GRAND TOTAL</span><span className="font-bold text-2xl tabular-nums">{fmt(grandTotal)}</span></div>
          </div>
        </div>

      </div>
    </main>
  );
}
