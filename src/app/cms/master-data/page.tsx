'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Settings2, Save, Server, Users, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

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

const genId = () => crypto.randomUUID();

export default function MasterDataPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>('dev');

  const [config, setConfig] = useState<MasterDataConfig>({
    devRoles: [],
    infraItems: [],
    additionalFees: [],
    aiServices: [],
    licensePercent: 10,
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch('/api/cms/master-data');
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
            setConfig({
              devRoles: data.config.devRoles || [],
              infraItems: data.config.infraItems || [],
              additionalFees: data.config.additionalFees || [],
              aiServices: data.config.aiServices || [],
              licensePercent: data.config.licensePercent || 10,
            });
          }
        }
      } catch {
        // silently fail — form will be empty
      } finally {
        setLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/master-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      if (res.ok) alert("Master Data saved successfully!");
      else alert("Failed to save Master Data.");
    } catch {
      alert("Error saving master data.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => setOpenSection(prev => prev === id ? null : id);

  if (loading) return <div className="p-6 text-muted-foreground flex items-center justify-center h-64">Loading master data...</div>;

  return (
    <main className="p-4 md:p-8 w-full space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Master Data Settings</h1>
          <p className="text-sm text-muted-foreground">Atur konfigurasi harga standar yang akan digunakan pada Project Calculator.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-sm rounded-sm h-10 px-6 font-semibold whitespace-nowrap">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="space-y-4">
        
        {/* Developers */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('dev')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Users className="w-5 h-5" /></div>
              <div className="text-left">
                <h2 className="font-semibold text-sm">Developer Roles & Rates</h2>
                <p className="text-xs text-muted-foreground">Standar gaji dan tunjangan harian</p>
              </div>
            </div>
            {openSection === 'dev' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          <AnimatePresence>
            {openSection === 'dev' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-6">
                  {config.devRoles.map((role) => (
                    <div key={role.id} className="relative p-5 bg-muted/5 border border-border rounded-sm group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setConfig(p => ({ ...p, devRoles: p.devRoles.filter(r => r.id !== role.id) }))} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-6">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Role Name</label>
                          <Input value={role.role} onChange={e => setConfig(p => ({ ...p, devRoles: p.devRoles.map(r => r.id === role.id ? { ...r, role: e.target.value } : r) }))} className="rounded-sm bg-background" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Daily Rate (Rp)</label>
                          <Input 
                            type="text" 
                            value={role.dailyRate === 0 ? '' : new Intl.NumberFormat('id-ID').format(role.dailyRate)} 
                            onChange={e => setConfig(p => ({ ...p, devRoles: p.devRoles.map(r => r.id === role.id ? { ...r, dailyRate: Number(e.target.value.replace(/\D/g, '')) } : r) }))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Daily Allowance (Rp)</label>
                          <Input 
                            type="text" 
                            value={role.dailyAllowance === 0 ? '' : new Intl.NumberFormat('id-ID').format(role.dailyAllowance)} 
                            onChange={e => setConfig(p => ({ ...p, devRoles: p.devRoles.map(r => r.id === role.id ? { ...r, dailyAllowance: Number(e.target.value.replace(/\D/g, '')) } : r) }))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setConfig(p => ({ ...p, devRoles: [...p.devRoles, { id: genId(), role: 'New Developer Role', qty: 1, days: 22, dailyRate: 0, dailyAllowance: 0 }] }))} className="w-full gap-2 border-dashed">
                    <Plus className="w-4 h-4" /> Add Developer Role
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Infrastructure */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('infra')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Server className="w-5 h-5" /></div>
              <div className="text-left">
                <h2 className="font-semibold text-sm">Infrastructure & Services</h2>
                <p className="text-xs text-muted-foreground">Server VPS, Domain, Storage, dll</p>
              </div>
            </div>
            {openSection === 'infra' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          <AnimatePresence>
            {openSection === 'infra' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-6">
                  {config.infraItems.map(item => (
                    <div key={item.id} className="relative p-5 bg-muted/5 border border-border rounded-sm group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setConfig(p => ({ ...p, infraItems: p.infraItems.filter(r => r.id !== item.id) }))} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-5">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Item Name</label>
                          <Input value={item.name} onChange={e => setConfig(p => ({ ...p, infraItems: p.infraItems.map(r => r.id === item.id ? { ...r, name: e.target.value } : r) }))} className="rounded-sm bg-background" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Billing Type</label>
                          <select value={item.type} onChange={e => setConfig(p => ({ ...p, infraItems: p.infraItems.map(r => r.id === item.id ? { ...r, type: e.target.value as InfraItem['type'] } : r) }))} className="h-9 w-full px-3 text-sm rounded-sm border border-input bg-background shadow-sm">
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="one-time">One-Time</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price (Rp)</label>
                          <Input 
                            type="text" 
                            value={item.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(item.price)} 
                            onChange={e => setConfig(p => ({ ...p, infraItems: p.infraItems.map(r => r.id === item.id ? { ...r, price: Number(e.target.value.replace(/\D/g, '')) } : r) }))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">PPN (%)</label>
                          <Input type="number" value={item.ppnPercent} onChange={e => setConfig(p => ({ ...p, infraItems: p.infraItems.map(r => r.id === item.id ? { ...r, ppnPercent: Number(e.target.value) } : r) }))} className="rounded-sm bg-background" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setConfig(p => ({ ...p, infraItems: [...p.infraItems, { id: genId(), name: 'New Infrastructure', type: 'monthly', price: 0, ppnPercent: 11 }] }))} className="w-full gap-2 border-dashed">
                    <Plus className="w-4 h-4" /> Add Infrastructure
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Services */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('ai')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Cpu className="w-5 h-5" /></div>
              <div className="text-left">
                <h2 className="font-semibold text-sm">AI Models & API Services</h2>
                <p className="text-xs text-muted-foreground">Layanan pihak ketiga seperti LLM, OCR, dll</p>
              </div>
            </div>
            {openSection === 'ai' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          <AnimatePresence>
            {openSection === 'ai' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-6">
                  {config.aiServices.map(ai => (
                    <div key={ai.id} className="relative p-5 bg-muted/5 border border-border rounded-sm group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setConfig(p => ({ ...p, aiServices: p.aiServices.filter(r => r.id !== ai.id) }))} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-5">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Service Name</label>
                          <Input value={ai.name} onChange={e => setConfig(p => ({ ...p, aiServices: p.aiServices.map(r => r.id === ai.id ? { ...r, name: e.target.value } : r) }))} className="rounded-sm bg-background" />
                        </div>
                        <div className="md:col-span-4">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Pricing Model</label>
                          <select 
                            value={ai.pricingModel} 
                            onChange={e => setConfig(p => ({ ...p, aiServices: p.aiServices.map(r => r.id === ai.id ? { ...r, pricingModel: e.target.value } : r) }))} 
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
                        <div className="md:col-span-3">
                          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Estimated Price (Rp)</label>
                          <Input 
                            type="text" 
                            value={ai.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(ai.price)} 
                            onChange={e => setConfig(p => ({ ...p, aiServices: p.aiServices.map(r => r.id === ai.id ? { ...r, price: Number(e.target.value.replace(/\D/g, '')) } : r) }))} 
                            className="rounded-sm bg-background" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setConfig(p => ({ ...p, aiServices: [...p.aiServices, { id: genId(), name: 'New AI Service', pricingModel: 'monthly', price: 0 }] }))} className="w-full gap-2 border-dashed">
                    <Plus className="w-4 h-4" /> Add AI Service
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lain-lain & Margin */}
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('other')} className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-sm text-primary"><Settings2 className="w-5 h-5" /></div>
              <div className="text-left">
                <h2 className="font-semibold text-sm">Additional Fees & License Margin</h2>
                <p className="text-xs text-muted-foreground">Biaya QA, Desain, dan margin persentase</p>
              </div>
            </div>
            {openSection === 'other' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          <AnimatePresence>
            {openSection === 'other' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                <div className="p-6 space-y-8">
                  
                  <div>
                    <h3 className="text-sm font-bold border-b border-border pb-2 mb-4">License Margin</h3>
                    <div className="w-48">
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Default Margin (%)</label>
                      <Input type="number" step="0.1" value={config.licensePercent} onChange={e => setConfig(p => ({ ...p, licensePercent: Number(e.target.value) }))} className="rounded-sm bg-background" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold border-b border-border pb-2 mb-4">Additional Fees</h3>
                    <div className="space-y-4">
                      {config.additionalFees.map(fee => (
                        <div key={fee.id} className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="flex-1 w-full">
                            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block sm:hidden">Fee Description</label>
                            <Input value={fee.name} onChange={e => setConfig(p => ({ ...p, additionalFees: p.additionalFees.map(r => r.id === fee.id ? { ...r, name: e.target.value } : r) }))} className="rounded-sm bg-background" />
                          </div>
                          <div className="w-full sm:w-48">
                            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block sm:hidden">Price (Rp)</label>
                            <Input 
                              type="text" 
                              value={fee.price === 0 ? '' : new Intl.NumberFormat('id-ID').format(fee.price)} 
                              onChange={e => setConfig(p => ({ ...p, additionalFees: p.additionalFees.map(r => r.id === fee.id ? { ...r, price: Number(e.target.value.replace(/\D/g, '')) } : r) }))} 
                              className="rounded-sm bg-background" 
                            />
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setConfig(p => ({ ...p, additionalFees: p.additionalFees.filter(r => r.id !== fee.id) }))} className="text-destructive h-9 w-9 hover:bg-destructive/10 shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => setConfig(p => ({ ...p, additionalFees: [...p.additionalFees, { id: genId(), name: 'New Additional Fee', price: 0 }] }))} className="w-full gap-2 border-dashed mt-2">
                        <Plus className="w-4 h-4" /> Add Fee
                      </Button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
