import React, { useState } from 'react';
import { ShieldAlert, Info, ExternalLink } from 'lucide-react';
import { ComplianceModal } from './ComplianceModal';

export const DisclaimerBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-navy-950 border-b border-navy-800/80 px-3 py-2 text-xs flex items-center justify-between text-slate-300 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0"></span>
          <p className="truncate text-[11px]">
            <strong className="text-gold-400 font-semibold">Informational Only:</strong> No in-app trading. Execute all trades on your own broker.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[10px] font-semibold text-slate-200 bg-navy-850 hover:bg-navy-750 px-2.5 py-1 rounded-lg border border-navy-700 transition flex items-center gap-1 shrink-0"
        >
          <Info className="w-3 h-3 text-gold-400" />
          <span>Disclaimers</span>
        </button>
      </div>

      {showModal && <ComplianceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
