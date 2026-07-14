import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, LayoutDashboard, Package, ShoppingBag, Truck, Box, CreditCard, Users, Settings, X, CheckCircle2, AlertCircle, Bot, GitBranch, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSynapse } from '../context/SynapseContext';
import { useAuth } from '../context/AuthContext';
import SupportPage from './inbox/SupportPage';
import FinancePage from './inbox/FinancePage';
import ReportPage from './inbox/ReportPage';
import MyStorePage from './inbox/MyStorePage';
import SellerToolsPage from './inbox/SellerToolsPage';
import ReferralsPage from './inbox/ReferralsPage';

// ── Sidebar Item ──
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors duration-200 w-full text-sm font-medium ${active ? 'bg-sot-gray-light dark:bg-black text-sot-blue' : 'text-text-secondary dark:text-white/70 hover:bg-sot-gray-light dark:bg-black hover:text-foreground dark:text-white'}`}
  >
    <Icon size={18} className={active ? 'text-sot-blue' : 'text-text-tertiary'} />
    <span>{label}</span>
  </button>
);

// ── Tab: Basic Information ──
const BasicInfoTab = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Agent Name *</label>
        <input value={form.name || ''} onChange={e => onChange('name', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="e.g. INGESTION-NODE-1" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">System ID</label>
        <input value={form.sku || ''} onChange={e => onChange('sku', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="SYS-ID-XXX" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Core Type</label>
        <select value={form.category || ''} onChange={e => onChange('category', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow">
          <option value="">Select core</option>
          <option value="extraction">Data Extraction</option>
          <option value="inference">Logic Inference</option>
          <option value="action">Action Execution</option>
          <option value="vision">Vision Processing</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Host Network</label>
        <input value={form.brand || ''} onChange={e => onChange('brand', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="e.g. Local, Cloud" />
      </div>
    </div>
    <div>
      <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Operational Directives</label>
      <textarea value={form.shortDesc || ''} onChange={e => onChange('shortDesc', e.target.value)} rows={3} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow resize-none" placeholder="Primary instructions for this node..." />
    </div>
  </div>
);

// ── Tab: Configuration & Limits ──
const VariationsTab = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-6">
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Rate Limit (req/s) *</label>
        <input type="number" value={form.price || ''} onChange={e => onChange('price', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="0" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Timeout (ms)</label>
        <input type="number" value={form.comparePrice || ''} onChange={e => onChange('comparePrice', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="30000" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Retry Count</label>
        <input type="number" value={form.costPrice || ''} onChange={e => onChange('costPrice', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="3" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Memory Limit (MB)</label>
        <input type="number" value={form.quantity || ''} onChange={e => onChange('quantity', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="512" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Compute Tier</label>
        <input type="text" value={form.weight || ''} onChange={e => onChange('weight', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="T4-Standard" />
      </div>
    </div>
    <div>
      <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Enabled Permissions</label>
      <div className="flex flex-wrap gap-2">
        {['READ_FS', 'WRITE_FS', 'NET_OUT', 'EXEC', 'DB_READ', 'DB_WRITE'].map(size => (
          <button
            key={size}
            onClick={() => {
              const sizes = form.sizes || [];
              const next = sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size];
              onChange('sizes', next);
            }}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors ${
              (form.sizes || []).includes(size) ? 'bg-sot-blue text-white border-sot-blue' : 'bg-white dark:bg-[#111] text-text-secondary dark:text-white/70 border-sot-border dark:border-white/10 hover:bg-sot-gray-light dark:bg-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── Tab: Advanced Prompting ──
const DescriptionsTab = ({ form, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">System Prompt / Persona</label>
      <textarea value={form.fullDesc || ''} onChange={e => onChange('fullDesc', e.target.value)} rows={8} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow resize-none" placeholder="You are an expert data extractor..." />
    </div>
    <div>
      <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Few-Shot Examples</label>
      <textarea value={form.features || ''} onChange={e => onChange('features', e.target.value)} rows={4} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow resize-none" placeholder="User: ...\nAssistant: ..." />
    </div>
  </div>
);

// ── Tab: Deployment ──
const ShippingTab = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Auto-Scaling Max Replicas</label>
        <input type="number" value={form.shippingWeight || ''} onChange={e => onChange('shippingWeight', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="10" />
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Idle Shutdown (mins)</label>
        <input type="number" value={form.processingTime || ''} onChange={e => onChange('processingTime', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="15" />
      </div>
    </div>
    <div>
      <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Fallback Node ID</label>
      <input type="text" value={form.returnPolicy || ''} onChange={e => onChange('returnPolicy', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="SYS-ID-FALLBACK" />
    </div>
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111] rounded-[8px] border border-sot-border dark:border-white/10">
      <div>
        <div className="text-sm font-semibold text-foreground dark:text-white">Human-in-the-Loop Required</div>
        <div className="text-xs text-text-secondary dark:text-white/70 mt-1">Require approval for state-mutating actions</div>
      </div>
      <button
        onClick={() => onChange('freeShipping', !form.freeShipping)}
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${form.freeShipping ? 'bg-sot-blue' : 'bg-sot-border'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#111] shadow-sm transition-all ${form.freeShipping ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  </div>
);

// ── Modularity Tab ──
const ImagesTab = ({ images, onAddImages, onRemoveImage }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    const promises = fileArray.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ name: file.name, dataUrl: e.target.result, size: file.size });
      reader.readAsDataURL(file);
    }));
    Promise.all(promises).then(results => onAddImages(results));
  }, [onAddImages]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground dark:text-white mb-1">Knowledge Injection</h3>
      <p className="text-xs text-text-secondary dark:text-white/70 mb-4">Upload contextual documents (PDF/TXT/Images). Click zone or drag files.</p>
      
      <div className="grid grid-cols-5 gap-4">
        {/* Drop Zone */}
        <div
          className={`col-span-2 row-span-2 border border-dashed rounded-[8px] flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[220px] ${
            isDragging ? 'border-sot-blue bg-sot-blue/10' : 'border-sot-border dark:border-white/10 bg-sot-gray-light dark:bg-black hover:bg-gray-100'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud size={24} className={`mb-3 ${isDragging ? 'text-sot-blue' : 'text-text-tertiary'}`} />
          <span className="text-sm font-medium text-foreground dark:text-white">Inject Data</span>
          <span className="text-xs text-text-tertiary mt-1">Max 50MB per file</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Uploaded Files */}
        {images.map((img, idx) => (
          <div key={idx} className="col-span-1 row-span-1 rounded-[8px] overflow-hidden relative group aspect-square border border-sot-border dark:border-white/10">
            <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => onRemoveImage(idx)}
                className="w-8 h-8 bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X size={14} className="text-text-secondary dark:text-white/70 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, 8 - images.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="col-span-1 row-span-1 bg-sot-gray-light dark:bg-black border border-sot-border dark:border-white/10 rounded-[8px] aspect-square"
          />
        ))}
      </div>
    </div>
  );
};

// ── Agent List View ──
const ProductListView = ({ products, onDelete }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground dark:text-white">Deployed Swarms ({products.length})</h2>
    {products.length === 0 && (
      <div className="text-center py-16 text-text-tertiary bg-white dark:bg-[#111] rounded-[8px] border border-sot-border dark:border-white/10">
        <Network size={32} className="mx-auto mb-4 text-text-tertiary" />
        <p className="text-sm font-medium">No active nodes. Initialize a swarm!</p>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id} className="flex flex-col gap-4 p-5 bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] hover:shadow-sot-light transition-shadow group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-[8px] bg-sot-gray-light dark:bg-black border border-sot-border dark:border-white/10 flex items-center justify-center text-text-secondary dark:text-white/70">
              {p.images?.[0] ? (
                <img src={p.images[0].dataUrl} alt="" className="w-full h-full rounded-[8px] object-cover" />
              ) : (
                <Bot size={20} />
              )}
            </div>
            <button onClick={() => onDelete(p.id)} className="text-text-tertiary hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-[4px] border border-transparent hover:border-sot-border dark:border-white/10 hover:bg-sot-gray-light dark:bg-black"><X size={14} /></button>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground dark:text-white truncate">{p.name || 'ANONYMOUS_NODE'}</div>
            <div className="text-xs text-text-secondary dark:text-white/70 mt-1">{p.sku || 'SYS-ID-PENDING'}</div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-sot-border dark:border-white/10 mt-auto">
             <div className="text-xs font-medium text-text-secondary dark:text-white/70">{p.category || 'Core'}</div>
             {p.price && <div className="text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-200">{p.price} req/s</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Approvals View ──
const ApprovalsView = () => {
  const { pendingApprovals, approveRequest, rejectRequest } = useSynapse();

  return (
    <div className="space-y-6 h-full overflow-y-auto no-scrollbar pb-12">
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground dark:text-white mb-1">Interventions</h2>
        <p className="text-sm text-text-secondary dark:text-white/70">Awaiting authorization from biological operator</p>
      </div>

      {pendingApprovals.length === 0 && (
        <div className="text-center py-16 text-text-tertiary border border-dashed border-sot-border dark:border-white/10 rounded-[8px] bg-white dark:bg-[#111] mt-8">
          <CheckCircle2 size={32} className="mx-auto mb-4 text-green-500" />
          <p className="text-sm font-medium">No pending interventions. Nominal operations.</p>
        </div>
      )}

      <div className="grid gap-4 mt-6 max-w-4xl">
        {pendingApprovals.map(approval => (
          <div key={approval.id} className="p-5 bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:shadow-sot-light transition-shadow">
            <div className="flex gap-5 flex-grow">
              <div className="w-12 h-12 rounded-[8px] bg-sot-gray-light dark:bg-black border border-sot-border dark:border-white/10 flex items-center justify-center text-2xl shrink-0">
                {approval.agentIcon || '🤖'}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-sm font-semibold text-foreground dark:text-white">{approval.description}</h3>
                   <span className="text-[10px] font-medium text-sot-blue bg-blue-50 px-2 py-0.5 rounded-[4px] border border-blue-100">AWAITING_AUTH</span>
                </div>
                <div className="text-xs text-text-secondary dark:text-white/70 mb-3">
                  Req Source: <span className="font-medium text-foreground dark:text-white">{approval.agentName}</span>
                </div>
                {approval.details && (
                  <div className="bg-sot-gray-light dark:bg-black p-3 rounded-[8px] border border-sot-border dark:border-white/10 text-xs text-text-secondary dark:text-white/70 grid grid-cols-2 gap-2">
                    {Object.entries(approval.details).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-0.5">
                        <span className="text-text-tertiary uppercase text-[10px]">{k}</span> 
                        <span className="text-foreground dark:text-white truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {approval.status === 'pending' ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                <button 
                  onClick={() => rejectRequest(approval.id)}
                  className="px-4 py-2 bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 text-text-secondary dark:text-white/70 rounded-[8px] text-sm font-medium hover:bg-sot-gray-light dark:bg-black transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => approveRequest(approval.id)}
                  className="px-4 py-2 bg-sot-blue text-white rounded-[8px] text-sm font-medium hover:bg-sot-blue-light transition-colors"
                >
                  Authorize
                </button>
              </div>
            ) : (
              <div className={`px-3 py-1 rounded-[4px] text-xs font-medium border shrink-0 ${
                approval.status === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {approval.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// ── Main Component ──
const TABS = ['Basic config', 'Config details', 'Resource limits', 'Knowledge', 'Directives', 'Deployment'];

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Bot, label: 'Agent Swarms' },
  { icon: GitBranch, label: 'Workflow Canvas' },
  { icon: UploadCloud, label: 'Data Ingestion' },
  { icon: Network, label: 'Multi-Branch Control' },
  { icon: LayoutDashboard, label: 'Report' },
  { icon: Users, label: 'Support' },
  { icon: CreditCard, label: 'Finance' },
  { icon: Users, label: 'Referrals' },
  { icon: Settings, label: 'Settings' },
];

const MultiModalInbox = () => {
  const { addProduct, products, deleteProduct, addToast, pendingApprovals } = useSynapse();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Basic config');
  const [activeSidebar, setActiveSidebar] = useState('Agent Swarms');
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;

  const handleChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  }, [errors]);

  const handleAddImages = useCallback((newImages) => {
    setImages(prev => {
      const total = [...prev, ...newImages];
      if (total.length > 10) {
        addToast('warning', 'Limit Reached', 'Maximum 10 files allowed');
        return total.slice(0, 10);
      }
      addToast('success', 'Injection Active', `${newImages.length} file(s) ingested`);
      return total;
    });
  }, [addToast]);

  const handleRemoveImage = useCallback((idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    addToast('info', 'File Purged', 'Data removed from context');
  }, [addToast]);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.name?.trim()) errs.name = 'Node name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSave = useCallback(() => {
    if (!validate()) {
      addToast('error', 'Validation Fault', 'Critical parameters missing');
      setActiveTab('Basic config');
      return;
    }
    addProduct({ ...form, images });
    setForm({});
    setImages([]);
    setActiveSidebar('Agent Swarms');
  }, [form, images, validate, addProduct, addToast]);

  const handleContinue = useCallback(() => {
    const currentIdx = TABS.indexOf(activeTab);
    if (currentIdx < TABS.length - 1) {
      setActiveTab(TABS[currentIdx + 1]);
    } else {
      handleSave();
    }
  }, [activeTab, handleSave]);

  const handleCancel = useCallback(() => {
    setForm({});
    setImages([]);
    setErrors({});
    addToast('info', 'Operation Aborted', 'Node config wiped');
    setActiveSidebar('Agent Swarms');
  }, [addToast]);

  const handleSidebarClick = (label) => {
    if (label === 'Settings') {
      navigate('/app/settings');
    } else if (label === 'Dashboard') {
      setActiveSidebar('Dashboard');
    } else {
      setActiveSidebar(label);
    }
  };

  return (
    <div className="flex h-full w-full bg-transparent font-sans text-foreground dark:text-white transition-colors duration-500">
      
      {/* Secondary Sidebar */}
      <div className="w-64 h-full flex flex-col bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-r border-sot-border dark:border-white/10 shrink-0 z-10 relative transition-colors duration-500">
        <div className="p-6 pb-4 border-b border-sot-border dark:border-white/10">
          <div className="cursor-pointer mb-6 flex items-center justify-start" onClick={() => navigate('/')}>
            <div className="font-display font-semibold text-lg text-foreground dark:text-white">Synapse OS</div>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-180px)] pr-2">
            {SIDEBAR_ITEMS.map((item, idx) => (
              <div key={idx} className="relative">
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  active={activeSidebar === item.label && activeSidebar !== 'Dashboard'}
                  onClick={() => handleSidebarClick(item.label)}
                />
                {item.label === 'Workflow Canvas' && pendingCount > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-sot-blue rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-5 border-t border-sot-border dark:border-white/10 bg-sot-gray-light dark:bg-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 flex items-center justify-center text-text-secondary dark:text-white/70 text-xs font-bold shrink-0">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground dark:text-white truncate">{user?.user_metadata?.full_name || 'Operator'}</div>
              <div className="text-[10px] text-text-secondary dark:text-white/70 truncate">{user?.email || 'SYS.ADMIN'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col relative overflow-hidden bg-transparent">
        {activeSidebar === 'Agent Swarms' && (
          <div className="flex-grow overflow-y-auto p-8 no-scrollbar relative z-10">
            <div className="flex justify-between items-end mb-8 border-b border-sot-border dark:border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-display font-semibold text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-cyan-400 mb-1">Agent Swarms</h1>
                <div className="text-sm text-text-secondary dark:text-white/70">{products.length} Nodes Active</div>
              </div>
              <button
                onClick={() => { setActiveSidebar('Dashboard'); setActiveTab('Basic config'); }}
                className="group relative px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-cyan-100 rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              >
                New Node
              </button>
            </div>
            <ProductListView products={products} onDelete={deleteProduct} />
          </div>
        )}

        {activeSidebar === 'Workflow Canvas' && (
          <div className="p-8 h-full relative z-10">
            <ApprovalsView />
          </div>
        )}

        {activeSidebar === 'Support' && (
          <div className="p-8 h-full max-w-4xl mx-auto w-full relative z-10">
            <SupportPage />
          </div>
        )}

        {activeSidebar === 'Finance' && (
          <div className="p-8 h-full relative z-10">
            <FinancePage />
          </div>
        )}

        {activeSidebar === 'Report' && (
          <div className="p-8 h-full relative z-10">
            <ReportPage />
          </div>
        )}

        {activeSidebar === 'Multi-Branch Control' && (
          <div className="p-8 h-full relative z-10">
            <MyStorePage />
          </div>
        )}

        {activeSidebar === 'Data Ingestion' && (
          <div className="p-8 h-full relative z-10">
            <SellerToolsPage />
          </div>
        )}

        {activeSidebar === 'Referrals' && (
          <div className="p-8 h-full relative z-10">
            <ReferralsPage />
          </div>
        )}

        {/* Form area */}
        {activeSidebar === 'Dashboard' && (
          <div className="flex flex-col h-full z-10 relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-l border-sot-border dark:border-white/10">
            <div className="px-8 pt-8 pb-4 shrink-0 border-b border-sot-border dark:border-white/10">
              <h1 className="text-xl font-display font-semibold text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-cyan-400 mb-1">Node Initialization Matrix</h1>
              <div className="text-sm text-text-secondary dark:text-white/70 flex gap-2">
                <span className="cursor-pointer hover:text-foreground dark:text-white transition-colors" onClick={() => setActiveSidebar('Agent Swarms')}>Agent Swarms</span>
                <span className="text-sot-border">/</span>
                <span className="text-foreground dark:text-white font-medium">Init Sequence</span>
              </div>
            </div>
            
            <div className="px-8 border-b border-sot-border dark:border-white/10 bg-transparent">
              <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                  <div 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-medium cursor-pointer transition-colors relative whitespace-nowrap ${
                      activeTab === tab ? 'text-sot-blue' : 'text-text-secondary dark:text-white/70 hover:text-foreground dark:text-white'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sot-blue" />
                    )}
                    {tab === 'Basic config' && errors.name && (
                      <span className="absolute top-4 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 no-scrollbar bg-transparent">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/50 dark:bg-black/30 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-2xl p-8 shadow-sm">
                  {activeTab === 'Basic config' && <BasicInfoTab form={form} onChange={handleChange} />}
                  {activeTab === 'Config details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Environment</label>
                          <select value={form.condition || ''} onChange={e => handleChange('condition', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow">
                            <option value="">Select env</option>
                            <option value="new">Production</option>
                            <option value="used">Staging</option>
                            <option value="refurbished">Development</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">Model Endpoint</label>
                          <input value={form.material || ''} onChange={e => handleChange('material', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="e.g. gpt-4-turbo" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-secondary dark:text-white/70 mb-1.5 block">System Tags</label>
                        <input value={form.tags || ''} onChange={e => handleChange('tags', e.target.value)} className="w-full bg-white dark:bg-[#111] border border-sot-border dark:border-white/10 rounded-[8px] px-3 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" placeholder="Comma separated tags" />
                      </div>
                    </div>
                  )}
                  {activeTab === 'Resource limits' && <VariationsTab form={form} onChange={handleChange} />}
                  {activeTab === 'Knowledge' && <ImagesTab images={images} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage} />}
                  {activeTab === 'Directives' && <DescriptionsTab form={form} onChange={handleChange} />}
                  {activeTab === 'Deployment' && <ShippingTab form={form} onChange={handleChange} />}
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-transparent border-t border-sot-border dark:border-white/10 flex justify-between items-center shrink-0">
              <button onClick={handleCancel} className="text-sm font-medium text-text-secondary dark:text-white/70 hover:text-foreground dark:text-white transition-colors px-4 py-2">Cancel</button>
              <div className="flex gap-3">
                <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-sot-border dark:border-white/10 text-sm font-medium text-foreground dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Save draft</button>
                <button onClick={handleContinue} className="group relative px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-cyan-100 rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                  {TABS.indexOf(activeTab) === TABS.length - 1 ? 'Execute Build' : 'Proceed'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiModalInbox;
