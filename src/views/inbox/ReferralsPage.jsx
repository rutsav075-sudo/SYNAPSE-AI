import React, { useState } from 'react';
import { Users, Copy, Gift, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSynapse } from '../../context/SynapseContext';

const ReferralsPage = () => {
  const { user } = useAuth();
  const { addToast } = useSynapse();
  const [copied, setCopied] = useState(false);

  // Generate a mock referral code based on user id or email
  const refCode = user?.email ? user.email.split('@')[0].toUpperCase() + '2026' : 'SYNAPSE2026';
  const refLink = `https://synapse-os.app/signup?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    addToast('success', 'Copied', 'Referral link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar space-y-6 bg-transparent font-sans text-foreground dark:text-white transition-colors duration-500">
      <div>
        <h2 className="text-2xl font-display font-semibold text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-cyan-400">Refer & Earn</h2>
        <p className="text-sm text-text-secondary dark:text-white/70">Invite friends and earn platform credits</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
          <Gift size={48} className="text-sot-blue mb-4" />
          <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Give $50, Get $50</h3>
          <p className="text-sm text-text-secondary dark:text-white/70 mb-8 max-w-md">
            For every friend who signs up with your link and activates their account, you both get $50 in API credits to use on Synapse OS.
          </p>
          
          <div className="w-full max-w-md bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl p-2 flex items-center justify-between">
            <span className="text-sm text-foreground dark:text-white px-4 font-mono select-all truncate">{refLink}</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-cyan-100 rounded-xl text-sm font-semibold transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm">
            <div className="text-text-secondary dark:text-white/70 text-xs font-semibold mb-1">Total Referrals</div>
            <div className="text-3xl font-bold text-foreground dark:text-white">0</div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm">
            <div className="text-text-secondary dark:text-white/70 text-xs font-semibold mb-1">Credits Earned</div>
            <div className="text-3xl font-bold text-green-600">$0.00</div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-foreground dark:text-white mb-4">Referral History</h3>
        <div className="py-8 text-center text-text-tertiary border-2 border-dashed border-sot-border dark:border-white/10 rounded-xl bg-transparent">
          <Users size={32} className="mx-auto mb-3 text-text-tertiary" />
          <p className="text-sm">You haven't referred anyone yet.</p>
          <p className="text-xs mt-1">Share your link to get started!</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
