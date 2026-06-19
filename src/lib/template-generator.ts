export interface DevRole { id: string; role: string; qty: number; days: number; dailyRate: number; dailyAllowance: number; }
export interface InfraItem { id: string; name: string; type: 'monthly' | 'yearly' | 'one-time'; price: number; ppnPercent: number; }
export interface AdditionalFee { id: string; name: string; type?: 'monthly' | 'yearly' | 'one-time' | 'per-case'; price: number; isIncludedInTotal?: boolean; }
export interface AIService { id: string; name: string; aiModel?: string; pricingModel: string; billingType?: 'monthly' | 'yearly' | 'one-time' | 'quota-based'; price: number; qty?: number; isIncludedInTotal?: boolean; }

export interface ProjectData {
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

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export function generateDocumentHtml(
  projectData: ProjectData,
  type: 'QUOTATION' | 'INVOICE' = 'QUOTATION',
  pId?: string,
  baseUrl: string = 'https://nuralim.dev'
) {
  const project = projectData || {};
  const projectDateStr = project.projectDate || new Date().toISOString().split('T')[0];
  const projectDateObj = new Date(projectDateStr);
  const dueDateObj = new Date(projectDateObj);
  dueDateObj.setDate(dueDateObj.getDate() + (project.dueDateDays ?? 7));
  const dueDateStr = dueDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const invoiceNo = `INV-${projectDateObj.getFullYear()}${(projectDateObj.getMonth() + 1).toString().padStart(2, '0')}-${(pId || 'TEMP').slice(0, 8).toUpperCase()}`;

  const devRoles = Array.isArray(project.devRoles) ? project.devRoles : [];
  const infraItems = Array.isArray(project.infraItems) ? project.infraItems : [];
  const additionalFees = Array.isArray(project.additionalFees) ? project.additionalFees : [];
  const aiServices = Array.isArray(project.aiServices) ? project.aiServices : [];
  const licensePercent = typeof project.licensePercent === 'number' ? project.licensePercent : 10;
  const notes = project.notes || '';

  const parseTimelineDays = (str: string) => {
    if (!str) return 30;
    const num = parseFloat(str.match(/\d+(\.\d+)?/)?.[0] || '1');
    const lower = str.toLowerCase();
    if (lower.includes('tahun') || lower.includes('year')) return num * 365;
    if (lower.includes('bulan') || lower.includes('month')) return num * 30;
    if (lower.includes('minggu') || lower.includes('week')) return num * 7;
    return num;
  };

  const totalInfraCost = infraItems.reduce((s: number, i: InfraItem) => s + ((i.type === 'yearly' ? (i.price || 0) * 12 : (i.price || 0)) * (1 + (i.ppnPercent || 0) / 100)), 0);
  const totalAdditionalCost = additionalFees.filter((f: AdditionalFee) => f.isIncludedInTotal !== false).reduce((s: number, f: AdditionalFee) => s + (f.price || 0), 0);
  const totalAIIncludedCost = aiServices.filter((ai: AIService) => ai.isIncludedInTotal).reduce((sum: number, ai: AIService) => sum + ((ai.price || 0) * (ai.qty || 1)), 0);

  const baseDevCost = devRoles.reduce((s: number, r: DevRole) => s + (r.qty || 0) * (r.days || 0) * ((r.dailyRate || 0) + (r.dailyAllowance || 0)), 0);
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
  const subTotal = totalDevCost + totalInfraCost + totalAdditionalCost + totalAIIncludedCost;
  const licenseCost = subTotal * (licensePercent / 100);
  const grandTotal = project.manualGrandTotal !== undefined ? project.manualGrandTotal : (subTotal + licenseCost);

  // Helper: table cell
  const td = (val: string, align = 'left', bold = false) =>
    `<td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:${align};${bold ? 'font-weight:600;' : ''}">${val}</td>`;

  // Helper: table header cell
  const th = (label: string, align = 'left', w = '') =>
    `<th style="padding:7px 10px;background:#f1f5f9;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;text-align:${align};${w ? `width:${w};` : ''}white-space:nowrap">${label}</th>`;

  // Helper: section heading
  const sec = (n: string, t: string) =>
    `<div style="margin:18px 0 8px;padding-bottom:5px;border-bottom:1.5px solid #e2e8f0"><span style="font-size:13px;font-weight:700;color:#1e40af;text-transform:uppercase">${n}. ${t}</span></div>`;

  let devRows = devRoles.map((r: DevRole) =>
    `<tr>${td(r.role || '-')}${td(`${r.qty || 0} pax`, 'center')}${td(`${r.days || 0} days`, 'right')}${td(fmt((r.dailyRate || 0) + (r.dailyAllowance || 0)), 'right')}${td(fmt((r.qty || 0) * (r.days || 0) * ((r.dailyRate || 0) + (r.dailyAllowance || 0))), 'right', true)}</tr>`
  ).join('');

  if (devCostAdjustment !== 0) {
    devRows += `<tr style="background-color:#fffbeb"><td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#b45309">Complexity & Timeline Adjustment</td><td colspan="3" style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:10px;color:#d97706">${project.totalFeatures} Features &bull; ${timelineDays} Days Timeline</td><td style="padding:7px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#b45309">${devCostAdjustment > 0 ? '+' : '-'}${fmt(Math.abs(devCostAdjustment))}</td></tr>`;
  }

  const infraRows = infraItems.map((i: InfraItem) => {
    const base = i.type !== 'one-time' ? (i.price || 0) * 12 : (i.price || 0);
    const tipe = i.type === 'monthly' ? 'Monthly' : i.type === 'yearly' ? 'Yearly' : 'One-time';
    return `<tr>${td(i.name || '-')}${td(tipe, 'center')}${td(fmt(i.price || 0), 'right')}${td(`${i.ppnPercent || 0}%`, 'right')}${td(fmt(base * (1 + (i.ppnPercent || 0) / 100)), 'right', true)}</tr>`;
  }).join('');

  const feeRows = additionalFees.map((f: AdditionalFee) => {
    const tipe = f.type === 'monthly' ? 'Monthly' : f.type === 'yearly' ? 'Yearly' : f.type === 'per-case' ? 'Per Case' : 'One-time';
    const selectedBadge = f.isIncludedInTotal !== false ? `<span style="font-size:10px;padding:2px 6px;border-radius:2px;background:#eff6ff;color:#2563eb;font-weight:600;border:1px solid #bfdbfe;margin-left:8px;">✓ Included</span>` : `<span style="font-size:10px;padding:2px 6px;border-radius:2px;background:#f8fafc;color:#64748b;font-weight:600;border:1px solid #e2e8f0;margin-left:8px;">Info Only</span>`;
    const nameHtml = `<div style="display:flex;align-items:center;">${f.name || '-'}${selectedBadge}</div>`;
    return `<tr>${td(nameHtml)}${td(tipe, 'center')}${td(f.isIncludedInTotal !== false ? fmt(f.price || 0) : `<span style="text-decoration:line-through;color:#94a3b8">${fmt(f.price || 0)}</span>`, 'right', f.isIncludedInTotal !== false)}</tr>`;
  }).join('');

  const aiRows = aiServices.map((a: AIService) => {
    const periodLabel = a.billingType === 'monthly' ? 'Monthly' : a.billingType === 'yearly' ? 'Yearly' : a.billingType === 'quota-based' ? 'Quota Based' : 'One-time';
    const selectedBadge = a.isIncludedInTotal ? `<span style="font-size:10px;padding:2px 6px;border-radius:2px;background:#eff6ff;color:#2563eb;font-weight:600;border:1px solid #bfdbfe;margin-left:8px;">✓ Selected</span>` : '';
    const serviceNameHtml = `<div style="display:flex;align-items:center;">${a.name || '-'}${selectedBadge}</div>`;
    return `<tr>${td(serviceNameHtml)}${td(a.pricingModel || '-', 'center')}${td(periodLabel, 'center')}${td((a.qty || 1).toString(), 'right')}${td(fmt(a.price || 0), 'right')}${td(fmt((a.price || 0) * (a.qty || 1)), 'right', true)}</tr>`;
  }).join('');

  const sumRow = (label: string, val: string, cls = '') =>
    `<div style="display:flex;justify-content:space-between;padding:7px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;${cls}">${label}<span>${val}</span></div>`;

  const html = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<title>${type === 'INVOICE' ? 'Invoice' : 'Project Quotation'} - ${project.projectName || 'Unnamed'}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@page { size: A4 portrait; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',sans-serif; color:#1e293b; background:#fff; font-size:12px; line-height:1.5; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
table { width:100%; border-collapse:collapse; margin-bottom: 40mm; }
.page-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 35mm; padding: 0 14mm 8mm; display: flex; justify-content: space-between; align-items: flex-end; }
</style></head><body>
<div class="page-footer">
<div style="width:100%;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:3mm;margin-bottom:4px">
  <span style="font-size:8px;color:#94a3b8;font-style:italic">${type === 'INVOICE' ? 'This document is an official billing from NuralimDev.' : 'This document is strictly confidential and intended only for the addressed party.'}</span>
</div>
</div>
<table>
<thead style="display:table-header-group">
  <tr><td style="padding:0">
    <div style="padding:5mm 14mm 4mm;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1e293b">
      <div style="display:flex;align-items:center;gap:12px">
        <img src="${baseUrl}/personal-logo.png" alt="Logo" style="width:36px;height:36px;object-fit:contain" />
        <div>
          <div style="font-size:20px;font-weight:900;letter-spacing:-0.5px;line-height:1;color:#1e293b">Nuralim<span style="color:#2563eb">.Dev</span></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div style="text-align:right;margin-bottom:4px">
          <div style="display:inline-block;background-color:#1e3a8a;color:#ffffff;padding:5px 12px;border-radius:4px;font-size:15px;font-weight:900;letter-spacing:0.2em;line-height:1">${type}</div>
        </div>
        ${type === 'INVOICE' 
          ? `<div style="text-align:right">
              <div style="font-size:9px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Due Date</div>
              <div style="font-size:13px;font-weight:800;color:#2563eb;margin-top:2px">${dueDateStr}</div>
             </div>`
          : `<div style="display:flex;align-items:center;gap:6px">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" style="height:10px;" />
              <div style="text-align:right">
                <div style="font-size:12px;color:#374151;font-weight:700;font-family:monospace;letter-spacing:0.5px;line-height:1">5485087858</div>
                <div style="font-size:9px;color:#6b7280;line-height:1;margin-top:2px">a.n Nuralim</div>
              </div>
             </div>`
        }
      </div>
    </div>
  </td></tr>
</thead>

<tbody><tr><td style="padding:0">
  <div style="padding:6mm 14mm 4mm">

    <!-- Project Meta -->
    <div style="display:flex;justify-content:space-between;padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:3px;margin-bottom:24px">
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="font-size:12px;display:grid;grid-template-columns:60px 1fr;gap:8px"><span style="color:#64748b;font-weight:600">${type === 'INVOICE' ? 'Bill To' : 'Client'}</span> <span style="font-weight:700;${type === 'INVOICE' ? 'font-size:14px;' : ''}">${project.clientName || '-'}</span></div>
        <div style="font-size:12px;display:grid;grid-template-columns:60px 1fr;gap:8px"><span style="color:#64748b;font-weight:600">Project</span> <span style="font-weight:600">${project.projectName || '-'}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;text-align:right">
        ${type === 'INVOICE' ? `<div style="font-size:12px"><span style="color:#64748b;font-weight:600">Invoice No</span> &nbsp;&nbsp;<span style="font-weight:700;font-family:monospace">${invoiceNo}</span></div>` : ''}
        <div style="font-size:12px"><span style="color:#64748b;font-weight:600">Date</span> &nbsp;&nbsp;<span style="font-weight:600">${project.projectDate || '-'}</span></div>
        ${type === 'INVOICE' 
          ? '' 
          : `<div style="font-size:12px"><span style="color:#64748b;font-weight:600">Timeline</span> &nbsp;&nbsp;<span style="font-weight:600">${project.timelineStr || '-'}</span> &nbsp;&nbsp;<span style="color:#cbd5e1">|</span>&nbsp;&nbsp; <span style="color:#64748b;font-weight:600">Total Features</span> &nbsp;&nbsp;<span style="font-weight:600">${project.totalFeatures || 0}</span></div>`
        }
      </div>
    </div>

    ${(() => {
      let sectionIndex = 1;
      let contentHtml = '';

      if (devRoles.length > 0) {
        contentHtml += `${sec(sectionIndex.toString(), 'Application Development Services')}
        <table style="margin-bottom:24px"><thead><tr>${th('Role', 'left', '40%')}${th('Qty', 'center', '15%')}${th('Duration', 'right', '15%')}${th('Daily Rate', 'right', '15%')}${th('Total', 'right', '15%')}</tr></thead>
        <tbody>${devRows}</tbody></table>`;
        sectionIndex++;
      }

      if (infraItems.length > 0) {
        contentHtml += `${sec(sectionIndex.toString(), 'Infrastructure (Server & Domain)')}
        <table style="margin-bottom:24px"><thead><tr>${th('Item', 'left', '40%')}${th('Type', 'center', '15%')}${th('Price / Period', 'right', '15%')}${th('VAT', 'right', '15%')}${th('Total', 'right', '15%')}</tr></thead>
        <tbody>${infraRows}</tbody></table>`;
        sectionIndex++;
      }

      if (aiServices.length > 0) {
        contentHtml += `${sec(sectionIndex.toString(), 'AI Models & API Services')}
        <table style="margin-bottom:24px"><thead><tr>${th('Service', 'left', '30%')}${th('Pricing Model', 'center', '15%')}${th('Billing', 'center', '20%')}${th('Qty', 'right', '5%')}${th('Unit Price', 'right', '15%')}${th('Total', 'right', '15%')}</tr></thead>
        <tbody>${aiRows}</tbody></table>`;
        sectionIndex++;
      }

      if (additionalFees.length > 0) {
        contentHtml += `${sec(sectionIndex.toString(), 'Additional Fees (Misc)')}
        <table style="margin-bottom:24px"><thead><tr>${th('Description', 'left', '70%')}${th('Type', 'center', '15%')}${th('Cost', 'right', '15%')}</tr></thead>
        <tbody>${feeRows}</tbody></table>`;
        sectionIndex++;
      }
      return contentHtml;
    })()}

    <!-- Summary & Notes (Side-by-side) -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;page-break-inside:avoid">
      
      <!-- Notes (Left Side) -->
      <div style="flex:1">
        ${type === 'INVOICE' ? `
          <div style="padding:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:3px;margin-bottom:12px">
            <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Payment Instructions</div>
            <div style="display:flex;align-items:flex-start;gap:10px">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" style="height:12px;margin-top:2px" />
              <div>
                <div style="font-size:13px;font-weight:800;color:#1e293b;font-family:monospace">5485087858</div>
                <div style="font-size:10px;color:#64748b">a.n Nuralim</div>
                <div style="font-size:10px;color:#0369a1;font-weight:600;margin-top:4px">Ref: ${invoiceNo}</div>
              </div>
            </div>
          </div>
        ` : ''}
        ${notes ? `
        <div style="padding:10px 14px;background:#eff6ff;border-left:3px solid #2563eb;border-radius:2px">
          <div style="font-size:10px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${type === 'INVOICE' ? 'Additional Notes' : 'Notes / Terms &amp; Conditions'}</div>
          <div style="font-size:12px;color:#475569;white-space:pre-line;line-height:1.6">${notes.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</div>
        </div>` : ''}
      </div>

      <!-- Summary (Right Side) -->
      <div style="width:340px;flex-shrink:0;border:1px solid #e2e8f0;border-radius:3px;overflow:hidden">
        ${totalDevCost > 0 ? sumRow('<span>Development Cost</span>', fmt(totalDevCost)) : ''}
        ${totalInfraCost > 0 ? sumRow('<span>Infrastructure Cost</span>', fmt(totalInfraCost)) : ''}
        ${totalAIIncludedCost > 0 ? sumRow('<span>Selected AI Services</span>', fmt(totalAIIncludedCost)) : ''}
        ${totalAdditionalCost > 0 ? sumRow('<span>Additional Fees</span>', fmt(totalAdditionalCost)) : ''}
        ${sumRow('<span style="font-weight:600">Subtotal</span>', fmt(subTotal), 'background:#f8fafc;font-weight:600')}
        ${sumRow(`<span style="color:#475569">${type === 'INVOICE' ? 'Management Fee' : 'License / Margin'} (${licensePercent}%)</span>`, fmt(licenseCost))}
        <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#1e293b;color:#fff;font-size:14px;font-weight:800">
          <span>${type === 'INVOICE' ? 'TOTAL DUE' : 'GRAND TOTAL'}</span><span>${fmt(grandTotal)}</span>
        </div>
      </div>
    </div>

  </div>
</td></tr></tbody>
</table>
<script>window.onload=()=>{window.print()}</script>
</body></html>`;

  return html;
}
