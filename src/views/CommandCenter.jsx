import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Download, Plus, Map, LayoutDashboard, Edit, CheckCircle2, Activity, AlertTriangle, Filter, Trash2, X, Edit2, Check } from 'lucide-react';
import { useSynapse } from '../context/SynapseContext';
import Modal from '../components/Modal/Modal';

// ── Add/Edit Lease Form ──
const LeaseForm = ({ lease, onSave, onCancel }) => {
  const [form, setForm] = useState(lease || {
    company: '', property: '', startDate: '', endDate: '', units: '', moveIn: 'Pending', moveOut: 'Pending', status: 'draft'
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4 font-sans text-black dark:text-white">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">Company</label>
          <input value={form.company} onChange={e => handleChange('company', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="Company name" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">Property</label>
          <input value={form.property} onChange={e => handleChange('property', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="Property name" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">Start Date</label>
          <input value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">End Date</label>
          <input value={form.endDate} onChange={e => handleChange('endDate', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">Units</label>
          <input value={form.units} onChange={e => handleChange('units', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors" placeholder="0" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/70 dark:text-white/70 mb-1.5 block">Status</label>
          <select value={form.status} onChange={e => handleChange('status', e.target.value)} className="w-full bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors">
            <option value="current">Current</option>
            <option value="past">Past</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.company || !form.property}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-none hover:bg-black/80 dark:hover:bg-white/80 transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const CommandCenter = () => {
  const { leases, addLease, updateLease, deleteLease, exportLeasesCSV, permissions, togglePermission } = useSynapse();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('past');
  const [subTab, setSubTab] = useState('tenancy');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLease, setEditingLease] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [n8nWorkflowCount, setN8nWorkflowCount] = useState(0);
  const [n8nTotalActions, setN8nTotalActions] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/n8n/stats')
      .then(res => res.json())
      .then(data => {
        if (data.workflows !== undefined) setN8nWorkflowCount(Number(data.workflows) || 0);
        if (data.totalActions !== undefined) setN8nTotalActions(Number(data.totalActions) || 0);
      })
      .catch(err => console.error('Failed to fetch n8n stats:', err));
  }, []);

  const [contacts, setContacts] = useState([
    { id: '1', name: "Aman Verma", email: "aman.v@synapse.io", role: "Lead Multi-Branch Auditor", type: "auditor" },
    { id: '2', name: "Sarah Jenkins", email: "s.jenkins@synapse.io", role: "Legal Counsel (Leasing)", type: "counsel" },
    { id: '3', name: "System Dispatcher Agent", email: "dispatcher@synapse.io", role: "Autonomous Microservice", type: "agent", status: "ACTIVE" }
  ]);
  const [editingId, setEditingId] = useState(null);

  const filteredLeases = useMemo(() => {
    let result = leases.filter(l => l.status === activeTab);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.company.toLowerCase().includes(term) ||
        l.property.toLowerCase().includes(term)
      );
    }
    return result;
  }, [leases, activeTab, searchTerm]);

  const tabCounts = useMemo(() => ({
    current: leases.filter(l => l.status === 'current').length,
    past: leases.filter(l => l.status === 'past').length,
    draft: leases.filter(l => l.status === 'draft').length,
  }), [leases]);

  const totalAgentActions = n8nTotalActions;
  const activeAgents = n8nWorkflowCount;

  const handleSaveNew = useCallback((form) => {
    addLease(form);
    setShowAddModal(false);
  }, [addLease]);

  const handleSaveEdit = useCallback((form) => {
    updateLease(editingLease.id, form);
    setEditingLease(null);
  }, [editingLease, updateLease]);

  const handleDelete = useCallback((id) => {
    deleteLease(id);
    setDeleteConfirm(null);
  }, [deleteLease]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent font-sans text-black dark:text-white transition-colors duration-500">
      
      {/* Top Navigation Bar - Glassmorphic */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 shrink-0 bg-white/70 dark:bg-black/70 backdrop-blur-md z-20 relative transition-colors duration-500">
        <div className="flex items-center gap-4">
           <div className="font-display font-bold text-xl tracking-tighter text-black dark:text-white">Command Center</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-none py-1.5 px-3 focus-within:border-black dark:focus-within:border-white transition-colors w-64">
            <Search size={14} className="text-black/50 dark:text-white/50" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-black dark:text-white text-sm ml-2 w-full placeholder:text-black/30 dark:placeholder:text-white/30"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 bg-white/50 dark:bg-black/50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Activity size={14} className="text-emerald-500" />
            System Live
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar p-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Metric Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
              <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">Active Agents</div>
              <div className="text-3xl font-display font-bold tracking-tighter text-black dark:text-white">{activeAgents}</div>
            </div>
            <div className="p-5 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
              <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">Total Actions</div>
              <div className="text-3xl font-display font-bold tracking-tighter text-black dark:text-white">{totalAgentActions}</div>
            </div>
            <div className="p-5 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
              <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">Total Leases</div>
              <div className="text-3xl font-display font-bold tracking-tighter text-black dark:text-white">{leases.length}</div>
            </div>
            <div className="p-5 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
              <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">System Load</div>
              <div className="text-3xl font-display font-bold tracking-tighter text-black dark:text-white">24%</div>
            </div>
          </div>

          {/* Inner Header Tabs */}
          <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setSubTab('tenancy')}
                className={`pb-2 text-sm font-medium transition-all border-b-2 ${subTab === 'tenancy' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
              >
                Tenancy Sync
              </button>
              <button 
                onClick={() => setSubTab('abstraction')}
                className={`pb-2 text-sm font-medium transition-all border-b-2 ${subTab === 'abstraction' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
              >
                Data Abstraction
              </button>
              <button 
                onClick={() => setSubTab('contacts')}
                className={`pb-2 text-sm font-medium transition-all border-b-2 ${subTab === 'contacts' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
              >
                Neural Roster
              </button>
            </div>
            <button
              onClick={() => exportLeasesCSV(filteredLeases)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium rounded-none"
            >
              <Download size={14} /> Export
            </button>
          </div>

          {subTab === 'tenancy' && (
            <>
              {/* Top Cards Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] transition-colors duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Target Entity</h3>
                    <button onClick={() => setShowAddModal(true)} className="p-1.5 rounded-none bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"><Plus size={16} strokeWidth={2} /></button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-none flex items-center justify-center border border-black/10 dark:border-white/10">
                       <Map className="text-black/60 dark:text-white/60" size={20} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-black dark:text-white tracking-tight">Delegancy property</div>
                      <div className="font-mono text-xs text-black/60 dark:text-white/60 mt-0.5">ID: DEL-994-Alpha</div>
                    </div>
                    <div className="ml-auto px-2 py-1 rounded-none bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 font-mono text-[10px] font-medium text-black/70 dark:text-white/70 uppercase">Industrial</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-none border border-black/10 dark:border-white/10">
                      <div className="font-mono text-[10px] text-black/50 dark:text-white/50 mb-1 uppercase">Sys Comms</div>
                      <div className="text-black dark:text-white font-medium truncate">support@example.com</div>
                      <div className="text-black dark:text-white font-medium truncate">sales@example.com</div>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-none border border-black/10 dark:border-white/10">
                      <div className="font-mono text-[10px] text-black/50 dark:text-white/50 mb-1 uppercase">Direct Uplink</div>
                      <div className="text-black dark:text-white font-medium truncate">+1 657 123 1234</div>
                      <div className="text-black dark:text-white font-medium truncate">+1 657 123 5678</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Node Timelines & ACL</h3>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-none p-3">
                        <div className="font-mono text-[10px] text-black/50 dark:text-white/50 mb-1 uppercase">Commencement Node</div>
                        <div className="text-sm font-medium font-mono text-black dark:text-white">2024-09-12</div>
                      </div>
                      <div className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-none p-3">
                        <div className="font-mono text-[10px] text-black/50 dark:text-white/50 mb-1 uppercase">Termination Node</div>
                        <div className="text-sm font-medium font-mono text-black dark:text-white">2026-09-12</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-white/10 pb-3">
                      <div>
                        <div className="text-sm font-medium text-black dark:text-white mb-0.5">Ticket Generation</div>
                      </div>
                      <button
                        onClick={() => togglePermission('canCreateTickets')}
                        className={`w-10 h-5 rounded-none relative transition-colors ${permissions.canCreateTickets ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-none bg-white dark:bg-black transition-all shadow-sm ${permissions.canCreateTickets ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-sm font-medium text-black dark:text-white mb-0.5">Lease Management</div>
                      </div>
                      <button
                        onClick={() => togglePermission('canManageLeases')}
                        className={`w-10 h-5 rounded-none relative transition-colors ${permissions.canManageLeases ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-none bg-white dark:bg-black transition-all shadow-sm ${permissions.canManageLeases ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leases Table */}
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] mt-6 overflow-hidden transition-colors duration-500">
                <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-black/50">
                  <span className="text-sm font-semibold tracking-tight text-black dark:text-white">Lease Registry</span>
                  <div className="flex gap-2 text-sm font-medium items-center">
                    {[
                      { key: 'current', label: 'Active' },
                      { key: 'past', label: 'Archived' },
                      { key: 'draft', label: 'Staged' },
                    ].map(tab => (
                      <button
                         key={tab.key}
                         onClick={() => setActiveTab(tab.key)}
                         className={`px-3 py-1.5 rounded-none transition-colors border ${activeTab === tab.key ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
                       >
                         {tab.label} <span className={`ml-1 text-[10px] font-mono ${activeTab === tab.key ? 'text-white/70 dark:text-black/70' : 'text-black/40 dark:text-white/40'}`}>{tabCounts[tab.key]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap min-w-[1000px]">
                    <thead>
                      <tr className="font-mono text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10">
                        <th className="py-3 px-6 w-12"></th>
                        <th className="py-3 px-4 font-semibold">Target Entity</th>
                        <th className="py-3 px-4 font-semibold">Property Identifier</th>
                        <th className="py-3 px-4 font-semibold">Commence</th>
                        <th className="py-3 px-4 font-semibold">Terminate</th>
                        <th className="py-3 px-4 font-semibold">Capacity</th>
                        <th className="py-3 px-4 font-semibold">Init State</th>
                        <th className="py-3 px-4 font-semibold">End State</th>
                        <th className="py-3 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-black dark:text-white">
                      {filteredLeases.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-black/50 dark:text-white/50 font-mono text-sm">
                            {searchTerm ? `[NO_MATCH] Registry query for "${searchTerm}" returned 0 records` : '[EMPTY] Registry is devoid of entries'}
                          </td>
                        </tr>
                      )}
                      {filteredLeases.map((row) => (
                        <tr key={row.id} className="border-b border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-6"><div className="w-3 h-3 rounded-none border border-black/20 dark:border-white/20 bg-transparent" /></td>
                          <td className="py-3 px-4 font-bold tracking-tight">{row.company}</td>
                          <td className="py-3 px-4 text-black/70 dark:text-white/70">{row.property}</td>
                          <td className="py-3 px-4 font-mono">{row.startDate || '—'}</td>
                          <td className="py-3 px-4 font-mono text-black/60 dark:text-white/60">{row.endDate || '—'}</td>
                          <td className="py-3 px-4 font-mono">{row.units}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={row.moveIn} />
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={row.moveOut} />
                          </td>
                          <td className="py-3 px-6">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingLease(row)} className="w-7 h-7 flex items-center justify-center rounded-none border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors" title="Modify"><Edit size={14} /></button>
                              <button onClick={() => setDeleteConfirm(row)} className="w-7 h-7 flex items-center justify-center rounded-none border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-red-500 transition-colors" title="Purge"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {subTab === 'abstraction' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
                 <div className="mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Financial Clauses</h3>
                </div>
                 <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Base Rent</span>
                    <span className="font-mono font-medium text-black dark:text-white">$45 / sq ft</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Security Deposit</span>
                    <span className="font-mono font-medium text-black dark:text-white">$50,000</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Escalation Rate</span>
                    <span className="font-mono font-medium text-black dark:text-white">3.5% Annually</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60 dark:text-white/60">Escalation Period</span>
                    <span className="font-mono font-medium text-black dark:text-white">Starting Year 2</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col justify-between transition-colors duration-500">
                 <div className="mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Critical Timelines</h3>
                </div>
                 <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Execution Date</span>
                    <span className="font-mono font-medium text-black dark:text-white">2026-01-10</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Expiration Date</span>
                    <span className="font-mono font-medium text-black dark:text-white">2031-12-31</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="text-black/60 dark:text-white/60">Renewal Notice</span>
                    <span className="font-mono font-medium text-black dark:text-white">2031-06-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60 dark:text-white/60">Notice Period</span>
                    <span className="font-mono font-medium text-black dark:text-white">180 Days Prior</span>
                  </div>
                </div>
              </div>

               <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] flex flex-col items-center justify-between text-center md:col-span-2 lg:col-span-1 transition-colors duration-500">
                 <div className="w-full text-left mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Confidence Score</h3>
                </div>
                
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10 dark:text-white/10" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 97.4) / 100} strokeLinecap="round" className="text-black dark:text-white transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-mono font-bold text-black dark:text-white">97.4%</span>
                    <span className="text-[10px] text-black/50 dark:text-white/50 uppercase font-medium">Accuracy</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-black/50 dark:text-white/50 px-2">
                  [SYS] Parser matched against validated LLM profile set.
                </div>
              </div>
            </div>
          )}

          {subTab === 'contacts' && (
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] space-y-6 max-w-4xl mx-auto transition-colors duration-500">
              <div className="border-b border-black/10 dark:border-white/10 pb-4 flex justify-between items-center">
                <h3 className="text-sm font-semibold tracking-tight text-black dark:text-white">Neural Roster</h3>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-xs font-medium rounded-none"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="p-4 border border-black/10 dark:border-white/10 rounded-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-black dark:text-white">{contact.name}</span>
                        {contact.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-none border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                            {contact.status}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60">{contact.role || "OPERATOR"}</span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-black/50 dark:text-white/50">{contact.email}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <a href={`mailto:${contact.email}`} className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-none transition-colors text-xs font-medium text-black dark:text-white">Email</a>
                        <button className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-none transition-colors text-xs font-medium text-black dark:text-white">Logs</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Initialize Node">
        <LeaseForm onSave={handleSaveNew} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={!!editingLease} onClose={() => setEditingLease(null)} title="Modify Node">
        {editingLease && (
          <LeaseForm lease={editingLease} onSave={handleSaveEdit} onCancel={() => setEditingLease(null)} />
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Purge" size="sm">
        {deleteConfirm && (
          <div className="text-center font-sans text-black dark:text-white">
            <p className="text-sm font-semibold mb-6">Purge registry entry for "{deleteConfirm.company}"?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-none text-sm font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 rounded-none text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">Purge</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ── Status Badge Component ──
const StatusBadge = ({ status }) => {
  const config = {
    Completed: { icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
    Pending: { icon: Activity, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
    Incomplete: { icon: AlertTriangle, color: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
  };
  const c = config[status] || config.Pending;
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-none border text-[10px] font-mono ${c.color}`}>
      <Icon size={12} /> {status}
    </div>
  );
};

export default CommandCenter;
