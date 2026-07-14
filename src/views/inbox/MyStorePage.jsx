import React, { useState } from 'react';
import { Store, Image as ImageIcon, Save } from 'lucide-react';
import { useSynapse } from '../../context/SynapseContext';

const MyStorePage = () => {
  const { addToast } = useSynapse();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: 'Delegancy Property Shop',
    tagline: 'Your one-stop shop for property management supplies',
    email: 'contact@delegancy.com',
    phone: '+1 657 123 1234',
    address: '200A Westminster Ave, Venice, CA'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('success', 'Store Updated', 'Your store configuration has been saved.');
    }, 800);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar space-y-6 bg-transparent font-sans text-foreground dark:text-white transition-colors duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-semibold text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-cyan-400">My Store Configuration</h2>
          <p className="text-sm text-text-secondary dark:text-white/70">Manage your storefront appearance and details</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="group relative px-6 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-cyan-100 rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Basic Information</h3>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Store Name</label>
              <input type="text" name="storeName" value={form.storeName} onChange={handleChange} className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Tagline / Short Description</label>
              <input type="text" name="tagline" value={form.tagline} onChange={handleChange} className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" />
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Support Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Phone Number</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Business Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow" />
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-4 w-full text-left">Store Logo</h3>
            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-sot-border dark:border-white/10 flex flex-col items-center justify-center bg-transparent cursor-pointer hover:border-cyan-400/50 transition-colors mb-4">
              <ImageIcon size={32} className="text-text-tertiary mb-2" />
              <span className="text-xs text-text-secondary dark:text-white/70">Upload Logo</span>
            </div>
            <p className="text-[10px] text-text-tertiary">Recommended size: 512x512px. Max 2MB.</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Brand Colors</h3>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Primary Color</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-[8px] bg-sot-blue border border-sot-border dark:border-white/10" />
                <input type="text" defaultValue="#3455fa" className="flex-grow bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-white/70 mb-1.5 block">Secondary Color</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-[8px] bg-[#000000] border border-sot-border dark:border-white/10" />
                <input type="text" defaultValue="#000000" className="flex-grow bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStorePage;
