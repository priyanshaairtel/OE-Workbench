import React, { useState, useEffect, useMemo } from 'react';
import { Check, Sparkles, AlertCircle, FileText, ChevronRight, Clock, Inbox, ArrowRight, ArrowLeft, Search, Receipt, Send, Shield, X, ExternalLink, CheckCircle2, Filter, Users, Zap, MoreHorizontal, FileCheck, FileX, FileSearch, Edit3, RefreshCw, ChevronDown } from 'lucide-react';

export default function OEWorkbenchV3() {
  const [view, setView] = useState('inbox');
  const [activeQuote, setActiveQuote] = useState(null);
  const [step, setStep] = useState('handoff');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [lineItems, setLineItems] = useState(() => generateLineItems());

  const openQuote = (quote) => {
    setActiveQuote(quote);
    setStep('handoff');
    setCompletedSteps([]);
    setLineItems(generateLineItems());
    setView('quote');
  };

  const completeStep = (s, next) => {
    setCompletedSteps(prev => prev.includes(s) ? prev : [...prev, s]);
    if (next) setStep(next);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-stone-900" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { font-family: 'Geist', system-ui, sans-serif; background: #FAFAF7; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease-out forwards; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .slide-in { animation: slideInRight 0.25s ease-out forwards; }
        .kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 2px 5px; background: white; border: 1px solid #d6d3d1; border-bottom-width: 2px; border-radius: 3px; color: #57534e; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
        .grid-row:hover .row-actions { opacity: 1; }
        .row-actions { opacity: 0; transition: opacity 0.15s; }
        .sticky-col { position: sticky; left: 0; z-index: 5; background: inherit; }
        .sticky-col-2 { position: sticky; left: 32px; z-index: 5; background: inherit; }
        tbody tr.grid-row { background: white; }
        tbody tr.grid-row.selected-row { background: rgb(240 253 250 / 0.7); }
        tbody tr.grid-row.amber-row { background: rgb(254 252 232 / 0.5); }
        thead tr { background: rgb(250 250 247); }
      `}</style>

      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="px-6 h-12 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-stone-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">A</span>
            </div>
            <div className="font-mono text-xs text-stone-500">SFDC · Order Entry Workbench</div>
          </div>
          <button
            onClick={() => { setView('inbox'); setActiveQuote(null); }}
            className={`text-sm flex items-center gap-2 px-2 py-1 rounded ${view === 'inbox' ? 'text-stone-900 font-medium' : 'text-stone-500 hover:text-stone-900'}`}
          >
            <Inbox className="w-3.5 h-3.5" /> Inbox
            <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">12</span>
          </button>
          {activeQuote && (
            <>
              <ChevronRight className="w-3 h-3 text-stone-300" />
              <div className="text-sm font-mono text-stone-700">{activeQuote.id}</div>
              <div className="text-sm text-stone-500">· {activeQuote.customer}</div>
              <div className="text-xs text-stone-400 ml-2">· {lineItems.length} line items</div>
            </>
          )}
          <div className="ml-auto flex items-center gap-3 text-xs text-stone-500">
            <kbd className="kbd">⌘K</kbd>
            <span>quick search</span>
            <div className="w-px h-4 bg-stone-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-medium text-stone-700">RK</div>
              <span>Ravi K. · OE</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        {view === 'inbox' && <InboxView onOpen={openQuote} />}
        {view === 'quote' && activeQuote && (
          <QuoteWorkflow
            quote={activeQuote}
            step={step}
            setStep={setStep}
            completedSteps={completedSteps}
            completeStep={completeStep}
            lineItems={lineItems}
            setLineItems={setLineItems}
            onBack={() => { setView('inbox'); setActiveQuote(null); }}
          />
        )}
      </main>
    </div>
  );
}

// ---------------- DATA ----------------
function generateLineItems() {
  const cities = [
    { name: 'Mumbai', state: 'MH', region: 'West' },
    { name: 'Pune', state: 'MH', region: 'West' },
    { name: 'Ahmedabad', state: 'GJ', region: 'West' },
    { name: 'Bengaluru', state: 'KA', region: 'South' },
    { name: 'Chennai', state: 'TN', region: 'South' },
    { name: 'Hyderabad', state: 'TS', region: 'South' },
    { name: 'Delhi', state: 'DL', region: 'North' },
    { name: 'Gurugram', state: 'HR', region: 'North' },
    { name: 'Noida', state: 'UP', region: 'North' },
    { name: 'Kolkata', state: 'WB', region: 'East' },
  ];
  const items = [];
  let siteIdx = 1;
  for (let i = 0; i < 50; i++) {
    const city = cities[i % cities.length];
    const type = i === 0 ? 'HO' : (i < 6 ? 'Regional' : 'Branch');
    const siteName = i === 0 ? `${city.name} HO` : `${city.name} ${type === 'Regional' ? 'Regional' : 'Branch ' + String(siteIdx).padStart(3, '0')}`;
    const siteId = `BR-${String(siteIdx).padStart(3, '0')}`;
    siteIdx++;
    const baseFields = {
      site: siteName, siteId, city: city.name, state: city.state, region: city.region,
      dcp: null,
      legalEntity: 'Acme Bank Ltd.',
      billingLevel: 'Account',
      billingAddress: 'Tower B, BKC, Mumbai 400051',
      billingFreq: 'Quarterly Advance',
      poType: 'Existing',
      poNumber: 'ACM-PO-2026-04-7291',
      poDate: '02 Apr 2026',
      poTerms: 'Net 45',
      poExpiryType: 'Date-based',
      poExpiry: '31 Mar 2029',
      gstApplicable: 'Yes',
      gstRule: 'Per delivery location',
      gstNumber: city.state === 'MH' ? '27AAACA1234B1Z5' : `${city.state === 'KA' ? '29' : city.state === 'TN' ? '33' : city.state === 'TS' ? '36' : city.state === 'DL' ? '07' : city.state === 'HR' ? '06' : city.state === 'UP' ? '09' : city.state === 'WB' ? '19' : city.state === 'GJ' ? '24' : '27'}AAACA1234B1Z5`,
      itemCode: '',
      status: 'incomplete',
    };
    items.push({ ...baseFields, id: `${siteId}-MPLS`, product: 'MPLS', bw: type === 'HO' ? '1 Gbps' : (type === 'Regional' ? '500 Mbps' : '100 Mbps'), role: 'Primary', itemCode: 'MPLS-MGD-V4' });
    items.push({ ...baseFields, id: `${siteId}-ILL`, product: 'ILL', bw: type === 'HO' ? '1 Gbps' : (type === 'Regional' ? '300 Mbps' : '50 Mbps'), role: 'Secondary', itemCode: 'ILL-V4' });
  }
  return items;
}

const ACCOUNT_DCP_ROSTER = [
  { id: 'dcp-1', name: 'Rajesh Kumar', role: 'Network Operations Lead', email: 'rajesh.kumar@acmebank.com', phone: '+91 98200 12345', regions: ['West'], default: true, lastUsed: '12 active services' },
  { id: 'dcp-2', name: 'Sneha Iyer', role: 'IT Manager · South', email: 'sneha.iyer@acmebank.com', phone: '+91 98400 67890', regions: ['South'], lastUsed: '14 active services' },
  { id: 'dcp-3', name: 'Vikas Malhotra', role: 'IT Lead · North', email: 'vikas.m@acmebank.com', phone: '+91 98100 54321', regions: ['North'], lastUsed: '9 active services' },
  { id: 'dcp-4', name: 'Anirban Ghosh', role: 'Branch Ops · East', email: 'a.ghosh@acmebank.com', phone: '+91 98300 11223', regions: ['East'], lastUsed: '4 active services' },
  { id: 'dcp-5', name: 'Priya Shah', role: 'CTO Office', email: 'priya.shah@acmebank.com', phone: '+91 98200 99887', regions: ['HQ'], lastUsed: '2 escalation services' },
];

const SFDC_DOCUMENTS = [
  { id: 'doc-1', name: 'ACM_PO_47291.pdf', uploaded: '2 Apr', uploader: 'Priya M. (KAM)', size: '2.3 MB', detected: 'Purchase Order', confidence: 100, required: true, status: 'matched', sub: '₹4.18 Cr · valid till 31 Mar 2029' },
  { id: 'doc-2', name: 'AcmeBank_HLD_v3_signed.pdf', uploaded: '28 Apr', uploader: 'Customer (via portal)', size: '4.8 MB', detected: 'High Level Design', confidence: 99, required: true, status: 'matched', sub: 'mandatory for SD-WAN · signed' },
  { id: 'doc-3', name: 'EPCN_AcmeBank_2026.pdf', uploaded: '25 Apr', uploader: 'Priya M. (KAM)', size: '380 KB', detected: 'EPCN Approval', confidence: 100, required: true, status: 'matched', sub: 'pricing approval · CCM signed' },
  { id: 'doc-4', name: 'AcmeBank_Master_SLA.pdf', uploaded: '15 Apr', uploader: 'Priya M. (KAM)', size: '1.1 MB', detected: 'SLA Agreement', confidence: 98, required: true, status: 'matched', sub: 'master SLA · 99.9% uptime' },
  { id: 'doc-5', name: 'firewall_questionnaire_v2.pdf', uploaded: '20 Apr', uploader: 'Customer (via portal)', size: '720 KB', detected: 'Firewall Questionnaire', confidence: 96, required: true, status: 'matched', sub: 'security policy filled & signed' },
  { id: 'doc-6', name: 'GST_Bundle_AcmeBank.zip', uploaded: '22 Apr', uploader: 'Customer (via portal)', size: '8.4 MB', detected: 'GST Certificate(s)', confidence: 97, required: true, status: 'matched', sub: '10 certificates · 1 per state', expanded: true, certs: [
    { state: 'MH', gstin: '27AAACA1234B1Z5', valid: true },
    { state: 'KA', gstin: '29AAACA1234B1Z5', valid: true },
    { state: 'TN', gstin: '33AAACA1234B1Z5', valid: true },
    { state: 'TS', gstin: '36AAACA1234B1Z5', valid: true },
    { state: 'DL', gstin: '07AAACA1234B1Z5', valid: true },
    { state: 'HR', gstin: '06AAACA1234B1Z5', valid: true },
    { state: 'UP', gstin: '09AAACA1234B1Z5', valid: true },
    { state: 'WB', gstin: '19AAACA1234B1Z5', valid: true },
    { state: 'GJ', gstin: '24AAACA1234B1Z5', valid: true },
  ]},
  { id: 'doc-7', name: 'ATC_addendum_AcmeBank.pdf', uploaded: '30 Apr', uploader: 'Priya M. (KAM)', size: '210 KB', detected: 'Additional T&C', confidence: 88, required: false, status: 'review', sub: 'optional · please confirm classification' },
];

const POLICY_REQUIREMENTS = [
  { id: 'req-1', label: 'Purchase Order', mandatory: true, satisfied: true, ref: 'doc-1' },
  { id: 'req-2', label: 'High Level Design (HLD)', mandatory: true, satisfied: true, ref: 'doc-2', note: 'mandatory for SD-WAN' },
  { id: 'req-3', label: 'EPCN Approval', mandatory: true, satisfied: true, ref: 'doc-3' },
  { id: 'req-4', label: 'Master SLA', mandatory: true, satisfied: true, ref: 'doc-4' },
  { id: 'req-5', label: 'Firewall Questionnaire', mandatory: true, satisfied: true, ref: 'doc-5' },
  { id: 'req-6', label: 'GST Certificate per state', mandatory: true, satisfied: true, ref: 'doc-6', note: '10 / 10 states covered' },
  { id: 'req-7', label: 'Solution Document', mandatory: false, satisfied: false, note: 'IPLC only · not required for SD-WAN' },
];

// ---------------- INBOX ----------------
function InboxView({ onOpen }) {
  const accepted = [
    { id: 'Q-2026-04-8821', customer: 'Acme Bank Ltd.', product: 'SD-WAN · 50 sites · 2 products', tcv: '4.2 Cr', accepted: '2 hrs ago', kam: 'Priya M.', priority: 'high', note: '50 sites × 2 products = 100 line items · existing customer · single master PO' },
    { id: 'Q-2026-04-8819', customer: 'Innovate Tech Pvt Ltd.', product: 'Managed ILL · 1 site', tcv: '18 L', accepted: '5 hrs ago', kam: 'Arjun S.', priority: 'normal', note: null },
    { id: 'Q-2026-04-8814', customer: 'Bharat Logistics', product: 'MPLS · 12 sites', tcv: '85 L', accepted: 'Yesterday', kam: 'Priya M.', priority: 'normal', note: null },
    { id: 'Q-2026-04-8807', customer: 'Helio Hospitals', product: 'ILL · 4 sites · 2 products', tcv: '32 L', accepted: '2d ago', kam: 'Vikram T.', priority: 'aging', note: 'Awaiting PO from customer' },
  ];

  const inProgress = [
    { id: 'Q-2026-04-8798', customer: 'Stellar Retail', step: 'Enrich Quote', progress: 65, blocker: 'Awaiting GST cert · 8 sites', age: '3d' },
    { id: 'Q-2026-04-8791', customer: 'Northwind Mfg.', step: 'Pre-flight to OV', progress: 90, blocker: null, age: '1d' },
  ];

  const bounced = [
    { id: 'Q-2026-04-8772', customer: 'Trident Energy', reason: 'OV: 3 line items missing item codes · 1 PO line unmatched', age: '4 hrs' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8 fade-up">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-serif text-4xl">Good afternoon, Ravi.</h1>
          <div className="text-xs text-stone-500 font-mono">Thursday · 7 May 2026</div>
        </div>
        <p className="text-stone-600">You have <span className="text-teal-700 font-medium">4 new accepted proposals</span> waiting for pickup, 2 in progress, and 1 bounced from OV.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'New today', val: '4', sub: '236 line items total', tone: 'teal' },
          { label: 'In progress', val: '2', sub: '1 awaiting customer input', tone: 'stone' },
          { label: 'Bounced from OV', val: '1', sub: 'needs immediate action', tone: 'amber' },
          { label: 'My SLA · this week', val: '94%', sub: 'within 24h target', tone: 'stone' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1">{s.label}</div>
            <div className={`font-serif text-3xl ${s.tone === 'teal' ? 'text-teal-700' : s.tone === 'amber' ? 'text-amber-700' : 'text-stone-900'}`}>{s.val}</div>
            <div className="text-xs text-stone-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {bounced.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h2 className="font-medium text-stone-900">Bounced from OV — needs attention</h2>
          </div>
          <div className="space-y-2">
            {bounced.map(q => (
              <div key={q.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-4">
                <div className="font-mono text-sm">{q.id}</div>
                <div className="text-sm">{q.customer}</div>
                <div className="text-sm text-amber-800 flex-1">{q.reason}</div>
                <div className="text-xs font-mono text-amber-700">bounced {q.age}</div>
                <button className="px-3 py-1.5 bg-amber-700 text-white rounded text-xs font-medium">Resolve →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-medium text-stone-900 mb-3">New · Proposal Accepted</h2>
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          {accepted.map((q) => (
            <button
              key={q.id}
              onClick={() => onOpen(q)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-stone-50 border-b border-stone-100 last:border-0 text-left transition-colors group"
            >
              <div className="flex items-center gap-2 w-44">
                {q.priority === 'aging' && <Clock className="w-3 h-3 text-amber-600 pulse-dot" />}
                {q.priority === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                {q.priority === 'normal' && <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                <span className="font-mono text-sm text-stone-700">{q.id}</span>
              </div>
              <div className="w-56">
                <div className="text-sm font-medium text-stone-900">{q.customer}</div>
                <div className="text-xs text-stone-500">{q.product}</div>
              </div>
              <div className="font-mono text-sm text-stone-700 w-24">₹ {q.tcv}</div>
              <div className="text-xs text-stone-500 w-32">
                <div>KAM · {q.kam}</div>
                <div>accepted {q.accepted}</div>
              </div>
              <div className="flex-1 text-xs text-stone-500 italic truncate">
                {q.note && <>↳ {q.note}</>}
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium text-stone-900 mb-3">In progress</h2>
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          {inProgress.map(q => (
            <div key={q.id} className="px-5 py-4 flex items-center gap-4 border-b border-stone-100 last:border-0">
              <div className="font-mono text-sm text-stone-700 w-44">{q.id}</div>
              <div className="w-44 text-sm font-medium">{q.customer}</div>
              <div className="text-xs text-stone-600 w-44">at <span className="font-medium text-stone-900">{q.step}</span></div>
              <div className="flex-1 max-w-xs">
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${q.progress}%` }} />
                </div>
              </div>
              <div className="text-xs text-stone-500 w-44 truncate">{q.blocker || 'on track'}</div>
              <div className="font-mono text-xs text-stone-400 w-12 text-right">{q.age}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- WORKFLOW ----------------
function QuoteWorkflow({ quote, step, setStep, completedSteps, completeStep, lineItems, setLineItems, onBack }) {
  const steps = [
    { id: 'handoff', label: 'Handoff', desc: 'KAM context' },
    { id: 'docs', label: 'Review Documents', desc: 'Verify SFDC docs' },
    { id: 'dcp', label: 'Assign DCP', desc: 'From account roster' },
    { id: 'enrich', label: 'Enrich Quote', desc: 'Billing & PO per line' },
    { id: 'preflight', label: 'Pre-flight', desc: 'Validate before OV' },
    { id: 'sent', label: 'Sent to OV', desc: 'Order validation' },
  ];

  const currentIdx = steps.findIndex(s => s.id === step);
  const dcpDoneCount = lineItems.filter(l => l.dcp).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <button onClick={onBack} className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Inbox
        </button>
        <div className="text-right">
          <div className="font-mono text-xs text-stone-500">{quote.id}</div>
          <div className="text-xs text-stone-500">Accepted {quote.accepted} · KAM {quote.kam}</div>
        </div>
      </div>

      <div className="mb-5 fade-up">
        <h1 className="font-serif text-3xl text-stone-900 leading-tight">{quote.customer}</h1>
        <div className="text-stone-600 mt-1 text-sm">
          {quote.product} · ₹ {quote.tcv} TCV ·
          <span className="font-mono text-stone-500 ml-1">{lineItems.length} line items</span>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg mb-5 overflow-hidden">
        <div className="flex">
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isDone = completedSteps.includes(s.id);
            const isPast = i < currentIdx;
            let progress = null;
            if (s.id === 'dcp' && dcpDoneCount > 0) progress = `${dcpDoneCount}/${lineItems.length}`;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 px-3 py-3 flex items-center gap-2.5 text-left border-r border-stone-100 last:border-0 transition-colors ${
                  isActive ? 'bg-stone-50' : 'hover:bg-stone-50/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  isDone ? 'bg-teal-500 text-white' :
                  isActive ? 'bg-stone-900 text-white' :
                  isPast ? 'bg-stone-300 text-stone-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {isDone ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm flex items-center gap-1.5 truncate ${isActive ? 'font-medium text-stone-900' : 'text-stone-700'}`}>
                    {s.label}
                    {progress && <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{progress}</span>}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {step === 'handoff' && <HandoffStep onContinue={() => completeStep('handoff', 'docs')} lineItems={lineItems} />}
      {step === 'docs' && <DocsStep onContinue={() => completeStep('docs', 'dcp')} />}
      {step === 'dcp' && <DCPStep lineItems={lineItems} setLineItems={setLineItems} onContinue={() => completeStep('dcp', 'enrich')} />}
      {step === 'enrich' && <EnrichStep lineItems={lineItems} setLineItems={setLineItems} onContinue={() => completeStep('enrich', 'preflight')} />}
      {step === 'preflight' && <PreflightStep lineItems={lineItems} onContinue={() => completeStep('preflight', 'sent')} />}
      {step === 'sent' && <SentStep onBack={onBack} lineItems={lineItems} />}
    </div>
  );
}

// ---------------- HANDOFF (no personal note) ----------------
function HandoffStep({ onContinue, lineItems }) {
  const productCounts = useMemo(() => {
    const m = {};
    lineItems.forEach(l => { m[l.product] = (m[l.product] || 0) + 1; });
    return m;
  }, [lineItems]);
  const regionCounts = useMemo(() => {
    const m = {};
    lineItems.forEach(l => { m[l.region] = (m[l.region] || 0) + 1; });
    return m;
  }, [lineItems]);

  return (
    <div className="space-y-4 fade-up">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-teal-900 mb-0.5">KAM has completed all upstream steps.</div>
          <div className="text-sm text-teal-800">100 line items across 50 locations. Feasibility cleared, proposal accepted on 6 May. Your job: review docs, assign DCP, enrich billing/PO, push to OV.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 font-mono text-xs text-stone-600">COMPLETED BY KAM</div>
          <div className="divide-y divide-stone-100 text-sm">
            {[
              ['Quote created', 'Q-2026-04-8821', '15 Apr 2026'],
              ['Locations added', '50 of 50', '15 Apr 2026'],
              ['Products configured', '100 line items', '18 Apr 2026'],
              ['Tech attributes', 'Validated · per location', '20 Apr 2026'],
              ['Feasibility', '50/50 FEASIBLE · Fiber On-net', '22 Apr 2026'],
              ['DoA / EPCN approval', 'Approved (CCM)', '28 Apr 2026'],
              ['Proposal sent', 'v3 · final', '30 Apr 2026'],
              ['Proposal accepted', 'by Acme Bank CFO', '6 May 2026'],
            ].map(([k, v, d]) => (
              <div key={k} className="px-4 py-2.5 flex items-center gap-3">
                <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-stone-900">{v}</div>
                  <div className="text-[10px] text-stone-500">{k}</div>
                </div>
                <div className="text-[10px] font-mono text-stone-400">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">Scope</div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-stone-500 text-xs">Locations</div>
                <div className="font-mono font-medium text-2xl">50</div>
              </div>
              <div>
                <div className="text-stone-500 text-xs">Products / loc</div>
                <div className="font-mono font-medium text-2xl">2</div>
              </div>
              <div>
                <div className="text-stone-500 text-xs">Total lines</div>
                <div className="font-mono font-bold text-2xl text-teal-700">{lineItems.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">By product</div>
            <div className="space-y-1.5 text-sm">
              {Object.entries(productCounts).map(([p, c]) => (
                <div key={p} className="flex justify-between">
                  <span className="text-stone-600">{p}</span>
                  <span className="font-mono">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">By region</div>
            <div className="space-y-1.5 text-sm">
              {Object.entries(regionCounts).map(([r, c]) => (
                <div key={r} className="flex justify-between">
                  <span className="text-stone-600">{r}</span>
                  <span className="font-mono">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <a href="#" className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Open full quote in SFDC
        </a>
        <button onClick={onContinue} className="px-4 py-2 bg-stone-900 text-white rounded text-sm flex items-center gap-2 hover:bg-stone-800">
          Continue · Review Documents
        </button>
      </div>
    </div>
  );
}

// ---------------- REVIEW DOCS (new step) ----------------
function DocsStep({ onContinue }) {
  const [confirmed, setConfirmed] = useState(new Set());
  const [expanded, setExpanded] = useState(new Set(['doc-6']));

  const toggleConfirm = (id) => {
    const n = new Set(confirmed);
    if (n.has(id)) n.delete(id); else n.add(id);
    setConfirmed(n);
  };

  const toggleExpand = (id) => {
    const n = new Set(expanded);
    if (n.has(id)) n.delete(id); else n.add(id);
    setExpanded(n);
  };

  const confirmAll = () => {
    setConfirmed(new Set(SFDC_DOCUMENTS.map(d => d.id)));
  };

  const allMandatorySatisfied = POLICY_REQUIREMENTS.filter(r => r.mandatory).every(r => r.satisfied);
  const allConfirmed = SFDC_DOCUMENTS.every(d => confirmed.has(d.id));

  return (
    <div className="space-y-4 fade-up">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-2xl mb-0.5">Review Documents</h2>
          <p className="text-sm text-stone-600">Synced from SFDC opportunity · auto-classified · confirm or flag for KAM.</p>
        </div>
        <button className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" /> Re-sync from SFDC
        </button>
      </div>

      {/* Policy completeness */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Policy completeness · SD-WAN</div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${allMandatorySatisfied ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
            {POLICY_REQUIREMENTS.filter(r => r.mandatory && r.satisfied).length} / {POLICY_REQUIREMENTS.filter(r => r.mandatory).length} mandatory
          </span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-stone-100">
          {POLICY_REQUIREMENTS.map(req => (
            <div key={req.id} className="px-4 py-2.5 flex items-center gap-3 border-b border-stone-100 last:border-0 odd:border-r-0 even:border-l">
              {!req.mandatory ? (
                <div className="w-4 h-4 rounded-full bg-stone-100 flex-shrink-0" />
              ) : req.satisfied ? (
                <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1 text-sm">
                <span className={req.mandatory ? 'text-stone-900' : 'text-stone-500'}>{req.label}</span>
                {!req.mandatory && <span className="text-[10px] text-stone-400 ml-2 font-mono">optional</span>}
              </div>
              {req.note && <div className="text-[10px] text-stone-500 italic">{req.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">SFDC Documents · {SFDC_DOCUMENTS.length} files</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">{confirmed.size} of {SFDC_DOCUMENTS.length} confirmed</span>
            <button onClick={confirmAll} className="text-xs text-teal-700 hover:text-teal-900 font-medium">Confirm all matched</button>
          </div>
        </div>
        <div className="divide-y divide-stone-100">
          {SFDC_DOCUMENTS.map(doc => {
            const isExpanded = expanded.has(doc.id);
            const isConfirmed = confirmed.has(doc.id);
            return (
              <div key={doc.id}>
                <div className={`px-4 py-3 flex items-center gap-3 hover:bg-stone-50 ${isConfirmed ? 'bg-teal-50/30' : ''} ${doc.status === 'review' ? 'bg-amber-50/30' : ''}`}>
                  <button onClick={() => toggleConfirm(doc.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isConfirmed ? 'bg-teal-500 border-teal-500' : 'border-stone-300 hover:border-stone-500'}`}>
                    {isConfirmed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <FileText className={`w-4 h-4 flex-shrink-0 ${doc.status === 'review' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-stone-900 truncate">{doc.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono flex-shrink-0">{doc.size}</span>
                    </div>
                    <div className="text-xs text-stone-500 truncate">{doc.sub}</div>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-700">{doc.detected}</span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${doc.confidence >= 95 ? 'bg-teal-100 text-teal-800' : doc.confidence >= 85 ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-800'}`}>
                        {doc.confidence}%
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{doc.uploader} · {doc.uploaded}</div>
                  </div>
                  {doc.certs && (
                    <button onClick={() => toggleExpand(doc.id)} className="text-stone-400 hover:text-stone-700">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  {!doc.certs && (
                    <button className="text-stone-400 hover:text-stone-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {isExpanded && doc.certs && (
                  <div className="bg-stone-50 px-4 py-3 border-t border-stone-100">
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {doc.certs.map(c => (
                        <div key={c.state} className="bg-white border border-stone-200 rounded px-2 py-1.5 flex items-center gap-2">
                          <span className="font-mono font-medium text-stone-900">{c.state}</span>
                          <span className="font-mono text-[10px] text-stone-500 truncate flex-1">{c.gstin}</span>
                          {c.valid && <Check className="w-3 h-3 text-teal-600 flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-stone-500">
          1 doc flagged for review (Additional T&amp;C · 88% confidence). Confirm classification or flag back to KAM.
        </div>
        <button
          onClick={onContinue}
          disabled={!allConfirmed || !allMandatorySatisfied}
          className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${allConfirmed && allMandatorySatisfied ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
        >
          {allConfirmed ? 'Continue → Assign DCP' : `${SFDC_DOCUMENTS.length - confirmed.size} doc${SFDC_DOCUMENTS.length - confirmed.size !== 1 ? 's' : ''} to confirm`}
        </button>
      </div>
    </div>
  );
}

// ---------------- DCP STEP ----------------
function DCPStep({ lineItems, setLineItems, onContinue }) {
  const [selected, setSelected] = useState(new Set());
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [groupBy, setGroupBy] = useState('region');
  const [showAssignPanel, setShowAssignPanel] = useState(false);

  const filtered = useMemo(() => {
    return lineItems.filter(l => {
      if (filterRegion !== 'all' && l.region !== filterRegion) return false;
      if (filterProduct !== 'all' && l.product !== filterProduct) return false;
      if (filterStatus === 'unassigned' && l.dcp) return false;
      if (filterStatus === 'assigned' && !l.dcp) return false;
      return true;
    });
  }, [lineItems, filterRegion, filterProduct, filterStatus]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return [{ key: 'All', items: filtered }];
    const map = {};
    filtered.forEach(l => {
      const k = groupBy === 'region' ? l.region : l.site;
      if (!map[k]) map[k] = [];
      map[k].push(l);
    });
    return Object.entries(map).map(([key, items]) => ({ key, items }));
  }, [filtered, groupBy]);

  const toggleRow = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const selectAllFiltered = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(l => l.id)));
  };

  const assignDCP = (dcpId) => {
    const dcp = ACCOUNT_DCP_ROSTER.find(d => d.id === dcpId);
    setLineItems(prev => prev.map(l => selected.has(l.id) ? { ...l, dcp } : l));
    setSelected(new Set());
    setShowAssignPanel(false);
  };

  const smartAssign = () => {
    setLineItems(prev => prev.map(l => {
      if (l.dcp) return l;
      const match = ACCOUNT_DCP_ROSTER.find(d => d.regions.includes(l.region));
      return match ? { ...l, dcp: match } : l;
    }));
  };

  const assignedCount = lineItems.filter(l => l.dcp).length;
  const allAssigned = assignedCount === lineItems.length;

  return (
    <div className="space-y-3 fade-up">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-2xl mb-0.5">Assign Delivery Contact Person</h2>
          <p className="text-sm text-stone-600">Select line items and assign from the account&apos;s DCP roster. <span className="font-mono text-stone-500">{assignedCount} / {lineItems.length} assigned.</span></p>
        </div>
        <button onClick={smartAssign} className="px-3 py-2 bg-white border border-stone-300 rounded text-sm flex items-center gap-2 hover:border-teal-400 hover:bg-teal-50">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Smart-assign by region
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg">
        <div className="px-3 py-2 border-b border-stone-100 flex items-center gap-2 text-xs">
          <Filter className="w-3 h-3 text-stone-400" />
          <Select value={filterRegion} onChange={setFilterRegion} options={[['all', 'All regions'], ['North', 'North'], ['South', 'South'], ['West', 'West'], ['East', 'East']]} />
          <Select value={filterProduct} onChange={setFilterProduct} options={[['all', 'All products'], ['MPLS', 'MPLS'], ['ILL', 'ILL']]} />
          <Select value={filterStatus} onChange={setFilterStatus} options={[['all', 'All status'], ['unassigned', 'Unassigned'], ['assigned', 'Assigned']]} />
          <div className="w-px h-4 bg-stone-200 mx-1" />
          <Select value={groupBy} onChange={setGroupBy} options={[['none', 'No grouping'], ['region', 'By region'], ['site', 'By site']]} />
          <div className="ml-auto text-stone-500 font-mono">{filtered.length} of {lineItems.length} rows</div>
        </div>

        {selected.size > 0 && (
          <div className="px-3 py-2 bg-stone-900 text-white flex items-center gap-3 text-xs">
            <span className="font-medium">{selected.size} selected</span>
            <div className="w-px h-3 bg-stone-700" />
            <button onClick={() => setShowAssignPanel(true)} className="px-2 py-1 bg-teal-500 text-stone-900 rounded font-medium flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Assign DCP to {selected.size}
            </button>
            <button className="text-stone-300 hover:text-white">Clear DCP</button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-stone-400 hover:text-white">Clear ✕</button>
          </div>
        )}

        <div className="overflow-auto max-h-[460px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 border-b border-stone-200 z-10">
              <tr className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
                <th className="px-3 py-2 text-left w-8">
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={selectAllFiltered} className="rounded" />
                </th>
                <th className="px-2 py-2 text-left">Site</th>
                <th className="px-2 py-2 text-left">Region</th>
                <th className="px-2 py-2 text-left">Product</th>
                <th className="px-2 py-2 text-left">Bandwidth</th>
                <th className="px-2 py-2 text-left">DCP</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((g) => (
                <React.Fragment key={g.key}>
                  {groupBy !== 'none' && (
                    <tr style={{ background: 'rgb(245 245 244 / 0.6)' }}>
                      <td colSpan="6" className="px-3 py-1.5 text-[11px] font-mono text-stone-600 uppercase tracking-wider">
                        {g.key} · {g.items.length} rows · {g.items.filter(l => l.dcp).length} assigned
                      </td>
                    </tr>
                  )}
                  {g.items.map((l) => (
                    <tr key={l.id} className={`grid-row border-b border-stone-100 last:border-0 hover:bg-stone-50/50 ${selected.has(l.id) ? 'selected-row' : ''}`}>
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleRow(l.id)} className="rounded" />
                      </td>
                      <td className="px-2 py-2">
                        <div className="text-stone-900">{l.site}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{l.siteId} · {l.city}</div>
                      </td>
                      <td className="px-2 py-2 text-xs">{l.region}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${l.product === 'MPLS' ? 'bg-stone-100 text-stone-700' : 'bg-purple-50 text-purple-700'}`}>{l.product}</span>
                          <span className="text-[10px] text-stone-400">{l.role}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs font-mono text-stone-600">{l.bw}</td>
                      <td className="px-2 py-2">
                        {l.dcp ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Check className="w-3 h-3 text-teal-600" />
                            <span className="text-stone-900">{l.dcp.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 italic">— unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-stone-500">Tip: filter by region → select all → bulk assign. Smart-assign uses each contact&apos;s configured regions.</div>
        <button
          onClick={onContinue}
          disabled={!allAssigned}
          className={`px-4 py-2 rounded text-sm ${allAssigned ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
        >
          {allAssigned ? 'Continue → Enrich Quote' : `${lineItems.length - assignedCount} unassigned`}
        </button>
      </div>

      {showAssignPanel && (
        <div className="fixed inset-0 bg-stone-900/40 flex items-center justify-center z-50" onClick={() => setShowAssignPanel(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <div className="font-medium">Assign DCP to {selected.size} line items</div>
                <div className="text-xs text-stone-500">From Acme Bank&apos;s contact roster · 5 contacts</div>
              </div>
              <button onClick={() => setShowAssignPanel(false)} className="text-stone-400 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input placeholder="Search by name, role, region…" className="w-full h-9 bg-stone-50 border border-stone-200 rounded pl-9 pr-3 text-sm" />
              </div>
              <div className="space-y-1">
                {ACCOUNT_DCP_ROSTER.map(dcp => (
                  <button key={dcp.id} onClick={() => assignDCP(dcp.id)} className="w-full px-3 py-3 hover:bg-stone-50 rounded flex items-center gap-3 text-left border border-transparent hover:border-stone-200">
                    <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-700">
                      {dcp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-stone-900 text-sm">{dcp.name}</span>
                        {dcp.default && <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">default</span>}
                      </div>
                      <div className="text-xs text-stone-500">{dcp.role}</div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">{dcp.email} · {dcp.lastUsed}</div>
                    </div>
                    <div className="text-[10px] text-stone-500 text-right">
                      <div className="font-mono">Regions</div>
                      <div className="font-medium">{dcp.regions.join(', ')}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="text-xs bg-white border border-stone-200 rounded px-2 py-1 hover:border-stone-400 cursor-pointer">
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

// ---------------- ENRICH QUOTE — rich fields + bulk edit drawer ----------------
const BILLING_FREQ_OPTIONS = [
  'Quarterly Advance',
  'Half-Yearly Advance',
  'Annual Advance',
  'Advanced Odd Half-Yearly',
  'Advanced Odd Yearly',
  'Advanced Second Month of Odd Quarter',
  'Advanced Third Month of Odd Quarter',
];

function EnrichStep({ lineItems, setLineItems, onContinue }) {
  const [selected, setSelected] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // { id, field }

  const filtered = useMemo(() => {
    return lineItems.filter(l => {
      if (filterRegion !== 'all' && l.region !== filterRegion) return false;
      return true;
    });
  }, [lineItems, filterRegion]);

  const toggleRow = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const selectAllFiltered = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(l => l.id)));
  };

  const applyBulkEdit = (changes) => {
    setLineItems(prev => prev.map(l => selected.has(l.id) ? { ...l, ...changes } : l));
    setShowBulkEdit(false);
  };

  const updateCell = (id, field, value) => {
    setLineItems(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    setEditingCell(null);
  };

  // Stats
  const completedCount = lineItems.filter(l => l.itemCode && l.dcp && l.legalEntity && l.poNumber).length;

  return (
    <div className="space-y-3 fade-up">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-2xl mb-0.5">Enrich Quote</h2>
          <p className="text-sm text-stone-600">Billing &amp; PO details per line item · click any cell to edit · select rows for bulk edit.</p>
        </div>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Master PO detected', val: 'ACM-PO-2026-04-7291', sub: '₹4.18 Cr · single PO covers all 100 lines', tone: 'teal' },
          { label: 'Billing entity', val: 'Acme Bank Ltd. (HO)', sub: '100/100 lines · uniform', tone: 'teal' },
          { label: 'Billing frequency', val: 'Quarterly Advance', sub: '100/100 lines · uniform', tone: 'teal' },
          { label: 'GST coverage', val: '10 states', sub: 'GSTIN per delivery state', tone: 'teal' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-lg p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-0.5">{s.label}</div>
            <div className="text-sm font-medium text-stone-900 truncate">{s.val}</div>
            <div className="text-[10px] text-stone-500">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-lg">
        <div className="px-3 py-2 border-b border-stone-100 flex items-center gap-2 text-xs">
          <Filter className="w-3 h-3 text-stone-400" />
          <Select value={filterRegion} onChange={setFilterRegion} options={[['all', 'All regions'], ['North', 'North'], ['South', 'South'], ['West', 'West'], ['East', 'East']]} />
          <Select value={filterStatus} onChange={setFilterStatus} options={[['all', 'All status'], ['complete', 'Complete'], ['incomplete', 'Incomplete']]} />
          <div className="ml-auto flex items-center gap-3">
            <span className="text-stone-500 font-mono">{filtered.length} of {lineItems.length} rows</span>
            <button className="text-stone-500 hover:text-stone-900 flex items-center gap-1">
              <FileSearch className="w-3 h-3" /> Find &amp; replace
            </button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="px-3 py-2 bg-stone-900 text-white flex items-center gap-3 text-xs">
            <span className="font-medium">{selected.size} selected</span>
            <div className="w-px h-3 bg-stone-700" />
            <button onClick={() => setShowBulkEdit(true)} className="px-2 py-1 bg-teal-500 text-stone-900 rounded font-medium flex items-center gap-1.5">
              <Edit3 className="w-3 h-3" /> Bulk edit {selected.size} rows
            </button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-stone-400 hover:text-white">Clear ✕</button>
          </div>
        )}

        <div className="overflow-auto max-h-[440px]">
          <table className="text-xs" style={{ minWidth: '1600px' }}>
            <thead className="sticky top-0 border-b border-stone-200 z-10">
              <tr className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
                <th className="px-3 py-2 text-left w-8 sticky-col" style={{ background: 'rgb(250 250 247)' }}>
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={selectAllFiltered} className="rounded" />
                </th>
                <th className="px-2 py-2 text-left sticky-col-2" style={{ background: 'rgb(250 250 247)', minWidth: '180px' }}>Site / Product</th>
                <th className="px-2 py-2 text-left">DCP</th>
                <th className="px-2 py-2 text-left">Legal Entity</th>
                <th className="px-2 py-2 text-left">Billing Level</th>
                <th className="px-2 py-2 text-left">Billing Address</th>
                <th className="px-2 py-2 text-left">Billing Freq</th>
                <th className="px-2 py-2 text-left">PO Type</th>
                <th className="px-2 py-2 text-left">PO Number</th>
                <th className="px-2 py-2 text-left">PO Date</th>
                <th className="px-2 py-2 text-left">PO Terms</th>
                <th className="px-2 py-2 text-left">PO Expiry</th>
                <th className="px-2 py-2 text-left">GST</th>
                <th className="px-2 py-2 text-left">GSTIN</th>
                <th className="px-2 py-2 text-left">Item Code</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const isSelected = selected.has(l.id);
                return (
                  <tr key={l.id} className={`grid-row border-b border-stone-100 last:border-0 hover:bg-stone-50/50 ${isSelected ? 'selected-row' : ''}`}>
                    <td className="px-3 py-2 sticky-col" style={{ background: isSelected ? 'rgb(240 253 250)' : 'white' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(l.id)} className="rounded" />
                    </td>
                    <td className="px-2 py-2 sticky-col-2" style={{ background: isSelected ? 'rgb(240 253 250)' : 'white', minWidth: '180px' }}>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${l.product === 'MPLS' ? 'bg-stone-100 text-stone-700' : 'bg-purple-50 text-purple-700'}`}>{l.product}</span>
                        <div className="min-w-0">
                          <div className="text-stone-900 truncate text-xs">{l.site}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{l.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-stone-700 whitespace-nowrap">{l.dcp ? l.dcp.name : <span className="text-stone-400 italic">—</span>}</td>
                    <Cell value={l.legalEntity} field="legalEntity" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} />
                    <Cell value={l.billingLevel} field="billingLevel" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} options={['Account', 'Sub-account', 'Site']} />
                    <Cell value={l.billingAddress} field="billingAddress" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} truncate />
                    <Cell value={l.billingFreq} field="billingFreq" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} options={BILLING_FREQ_OPTIONS} />
                    <Cell value={l.poType} field="poType" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} options={['Existing', 'New']} mono />
                    <Cell value={l.poNumber} field="poNumber" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} mono />
                    <Cell value={l.poDate} field="poDate" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} mono />
                    <Cell value={l.poTerms} field="poTerms" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} />
                    <Cell value={l.poExpiry} field="poExpiry" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} mono />
                    <Cell value={l.gstApplicable} field="gstApplicable" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} options={['Yes', 'No']} />
                    <Cell value={l.gstNumber} field="gstNumber" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} mono />
                    <Cell value={l.itemCode} field="itemCode" id={l.id} editingCell={editingCell} setEditingCell={setEditingCell} updateCell={updateCell} mono />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-stone-500">
          Click any cell to edit · select rows + <kbd className="kbd">B</kbd> to bulk edit
        </div>
        <button onClick={onContinue} className="px-4 py-2 bg-stone-900 text-white rounded text-sm">
          Continue → Pre-flight
        </button>
      </div>

      {showBulkEdit && (
        <BulkEditDrawer
          selectedCount={selected.size}
          onClose={() => setShowBulkEdit(false)}
          onApply={applyBulkEdit}
        />
      )}
    </div>
  );
}

function Cell({ value, field, id, editingCell, setEditingCell, updateCell, options, mono, truncate }) {
  const isEditing = editingCell?.id === id && editingCell?.field === field;
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (isEditing) {
    if (options) {
      return (
        <td className="px-2 py-1">
          <select
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => updateCell(id, field, draft)}
            onKeyDown={e => { if (e.key === 'Enter') updateCell(id, field, draft); if (e.key === 'Escape') setEditingCell(null); }}
            className="w-full h-6 bg-white border border-teal-400 rounded px-1 text-xs focus:outline-none"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </td>
      );
    }
    return (
      <td className="px-2 py-1">
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => updateCell(id, field, draft)}
          onKeyDown={e => { if (e.key === 'Enter') updateCell(id, field, draft); if (e.key === 'Escape') setEditingCell(null); }}
          className={`w-full h-6 bg-white border border-teal-400 rounded px-1 text-xs focus:outline-none ${mono ? 'font-mono' : ''}`}
        />
      </td>
    );
  }

  return (
    <td
      onClick={() => setEditingCell({ id, field })}
      className={`px-2 py-2 cursor-pointer hover:bg-teal-50/30 ${mono ? 'font-mono text-[10px]' : 'text-xs'} ${truncate ? 'max-w-[180px] truncate' : 'whitespace-nowrap'} text-stone-700`}
    >
      {value || <span className="text-stone-400 italic">—</span>}
    </td>
  );
}

function BulkEditDrawer({ selectedCount, onClose, onApply }) {
  const [enabled, setEnabled] = useState({});
  const [values, setValues] = useState({
    legalEntity: 'Acme Bank Ltd.',
    billingLevel: 'Account',
    billingAddress: 'Tower B, BKC, Mumbai 400051',
    billingFreq: 'Quarterly Advance',
    poType: 'Existing',
    poNumber: 'ACM-PO-2026-04-7291',
    poDate: '02 Apr 2026',
    poTerms: 'Net 45',
    poExpiryType: 'Date-based',
    poExpiry: '31 Mar 2029',
    gstApplicable: 'Yes',
    gstRule: 'Per delivery location',
  });

  const toggle = (k) => setEnabled(prev => ({ ...prev, [k]: !prev[k] }));
  const setVal = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  const handleApply = () => {
    const changes = {};
    Object.keys(enabled).forEach(k => {
      if (enabled[k]) changes[k] = values[k];
    });
    onApply(changes);
  };

  const enabledCount = Object.values(enabled).filter(Boolean).length;

  const sections = [
    {
      title: 'Billing',
      fields: [
        { k: 'legalEntity', label: 'Legal Entity', type: 'text' },
        { k: 'billingLevel', label: 'Billing Level', type: 'select', options: ['Account', 'Sub-account', 'Site'] },
        { k: 'billingAddress', label: 'Billing Address', type: 'text' },
        { k: 'billingFreq', label: 'Billing Frequency', type: 'select', options: BILLING_FREQ_OPTIONS },
      ],
    },
    {
      title: 'Purchase Order',
      fields: [
        { k: 'poType', label: 'PO Type', type: 'select', options: ['Existing', 'New'] },
        { k: 'poNumber', label: 'PO Number', type: 'text', mono: true },
        { k: 'poDate', label: 'PO Date', type: 'text', mono: true },
        { k: 'poTerms', label: 'PO Terms', type: 'text' },
        { k: 'poExpiryType', label: 'PO Expiry Type', type: 'select', options: ['Date-based', 'Amount-based', 'Quantity-based'] },
        { k: 'poExpiry', label: 'PO Expiry Date', type: 'text', mono: true },
      ],
    },
    {
      title: 'GST',
      fields: [
        { k: 'gstApplicable', label: 'GST Applicable', type: 'select', options: ['Yes', 'No'] },
        { k: 'gstRule', label: 'GST Rule', type: 'select', options: ['Per delivery location', 'Per billing address', 'Exempt'] },
      ],
    },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-stone-900/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[440px] bg-white shadow-2xl z-50 flex flex-col slide-in">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="font-medium">Bulk edit {selectedCount} rows</div>
            <div className="text-xs text-stone-500">Toggle any field to apply · others stay unchanged</div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-5">
          {sections.map(section => (
            <div key={section.title}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">{section.title}</div>
              <div className="space-y-2">
                {section.fields.map(f => (
                  <div key={f.k} className={`border rounded-md p-2.5 transition-colors ${enabled[f.k] ? 'bg-teal-50 border-teal-300' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <button onClick={() => toggle(f.k)} className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${enabled[f.k] ? 'bg-teal-500 border-teal-500' : 'border-stone-300 hover:border-stone-500'}`}>
                        {enabled[f.k] && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                      <label className={`text-xs font-medium flex-1 ${enabled[f.k] ? 'text-teal-900' : 'text-stone-700'}`}>{f.label}</label>
                      {enabled[f.k] && <span className="text-[10px] font-mono text-teal-700">applies to {selectedCount}</span>}
                    </div>
                    {f.type === 'select' ? (
                      <select
                        value={values[f.k]}
                        onChange={e => setVal(f.k, e.target.value)}
                        disabled={!enabled[f.k]}
                        className={`w-full h-8 bg-white border rounded px-2 text-xs ${enabled[f.k] ? 'border-stone-300' : 'border-stone-200 text-stone-400'}`}
                      >
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        value={values[f.k]}
                        onChange={e => setVal(f.k, e.target.value)}
                        disabled={!enabled[f.k]}
                        className={`w-full h-8 bg-white border rounded px-2 text-xs ${f.mono ? 'font-mono' : ''} ${enabled[f.k] ? 'border-stone-300' : 'border-stone-200 text-stone-400'}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50">
          <div className="flex items-center justify-between mb-3 text-xs text-stone-600">
            <span>{enabledCount} field{enabledCount !== 1 ? 's' : ''} will be updated</span>
            <span className="font-mono">× {selectedCount} rows = {enabledCount * selectedCount} cells</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 border border-stone-300 text-stone-700 rounded text-sm">Cancel</button>
            <button
              onClick={handleApply}
              disabled={enabledCount === 0}
              className={`flex-1 py-2 rounded text-sm font-medium ${enabledCount > 0 ? 'bg-teal-500 text-stone-900 hover:bg-teal-400' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
            >
              Apply to {selectedCount} rows
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------- PRE-FLIGHT ----------------
function PreflightStep({ lineItems, onContinue }) {
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setValidated(true), 900);
    return () => clearTimeout(t);
  }, []);

  const totalLines = lineItems.length;
  const checks = [
    { cat: 'Per-line completeness', items: [
      { label: 'DCP assigned', state: 'pass', sub: `${totalLines} / ${totalLines} lines` },
      { label: 'Legal entity & billing address set', state: 'pass', sub: `${totalLines} / ${totalLines} lines` },
      { label: 'PO linked (existing or new)', state: 'pass', sub: `${totalLines} / ${totalLines} lines` },
      { label: 'GST applicability resolved', state: 'pass', sub: `${totalLines} / ${totalLines} lines` },
      { label: 'Item code populated', state: 'pass', sub: `${totalLines} / ${totalLines} lines` },
    ]},
    { cat: 'Cross-line consistency', items: [
      { label: 'Sum of line amounts matches PO total', state: 'pass', sub: '₹ 4,18,40,000 ↔ ₹ 4,18,40,000' },
      { label: 'GSTIN consistent within state', state: 'pass', sub: 'all 10 states checked' },
      { label: 'Billing frequency consistent', state: 'pass', sub: 'all lines: Quarterly Advance' },
      { label: 'Billing entity consistent', state: 'pass', sub: 'all lines: Acme Bank Ltd.' },
    ]},
    { cat: 'Documents (synced from SFDC)', items: [
      { label: 'PO uploaded & matched', state: 'pass' },
      { label: 'HLD signed', state: 'pass' },
      { label: 'EPCN approval', state: 'pass' },
      { label: 'GST certificate · all 10 states', state: 'pass' },
      { label: 'Master SLA & Firewall Q', state: 'pass' },
    ]},
  ];

  const allPass = checks.every(c => c.items.every(i => i.state !== 'fail'));

  return (
    <div className="space-y-4 fade-up">
      <div>
        <h2 className="font-serif text-2xl mb-1">Pre-flight to OV</h2>
        <p className="text-sm text-stone-600">Validating all 100 line items + cross-line consistency before submitting.</p>
      </div>

      {!validated ? (
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center pulse-dot">
            <Shield className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-sm text-stone-600">Running 14 checks across 100 line items…</div>
        </div>
      ) : (
        <>
          <div className={`border rounded-lg p-4 flex items-center gap-3 ${allPass ? 'bg-teal-50 border-teal-200' : 'bg-amber-50 border-amber-200'}`}>
            {allPass ? <CheckCircle2 className="w-5 h-5 text-teal-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
            <div className="flex-1">
              <div className={`font-medium ${allPass ? 'text-teal-900' : 'text-amber-900'}`}>All 14 checks passed across 100 line items.</div>
              <div className={`text-sm ${allPass ? 'text-teal-800' : 'text-amber-800'}`}>
                Historical bounce rate after pre-flight: <span className="font-mono">4%</span> (vs 28% without)
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            {checks.map((cat) => (
              <div key={cat.cat} className="border-b border-stone-100 last:border-0">
                <div className="px-4 py-2.5 bg-stone-50/50 font-mono text-[10px] uppercase tracking-widest text-stone-500">{cat.cat}</div>
                {cat.items.map((item) => (
                  <div key={item.label} className="px-4 py-2.5 flex items-center gap-3 border-t border-stone-100 first:border-0">
                    <Check className="w-4 h-4 text-teal-600" />
                    <div className="flex-1">
                      <div className="text-sm text-stone-800">{item.label}</div>
                      {item.sub && <div className="text-xs text-stone-500 font-mono mt-0.5">{item.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-stone-500">Catches ~85% of OV bounce reasons · saves ~2.5 days of round-tripping</div>
            <button onClick={onContinue} className="px-4 py-2 bg-teal-500 text-stone-900 rounded text-sm font-medium flex items-center gap-2">
              <Send className="w-3.5 h-3.5" /> Send to OV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- SENT ----------------
function SentStep({ onBack, lineItems }) {
  return (
    <div className="space-y-4 fade-up">
      <div className="bg-white border border-stone-200 rounded-lg p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-teal-500 flex items-center justify-center">
          <Check className="w-7 h-7 text-white" />
        </div>
        <h2 className="font-serif text-3xl mb-2">Sent to OV.</h2>
        <p className="text-stone-600 max-w-md mx-auto mb-6">
          {lineItems.length} line items submitted. OV will validate within 24 hrs.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6 text-left">
          <div className="bg-stone-50 rounded p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1">Total time</div>
            <div className="font-serif text-2xl">42 min</div>
            <div className="text-xs text-stone-500">vs ~14 hrs typical</div>
          </div>
          <div className="bg-stone-50 rounded p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1">Touch time</div>
            <div className="font-serif text-2xl">14 min</div>
            <div className="text-xs text-stone-500">most was bulk operations</div>
          </div>
          <div className="bg-stone-50 rounded p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1">Bounce risk</div>
            <div className="font-serif text-2xl text-teal-700">Low</div>
            <div className="text-xs text-stone-500">all checks passed</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={onBack} className="px-4 py-2 border border-stone-300 text-stone-700 rounded text-sm">Back to inbox</button>
          <button className="px-4 py-2 bg-stone-900 text-white rounded text-sm">Pick up next quote →</button>
        </div>
      </div>
    </div>
  );
}
