import React, { useState } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { ComplianceModal } from './ComplianceModal';

export const DisclaimerBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-navy-900/90 border-b border-navy-700/60 px-3 py-2 text-xs flex items-center justify-between text-slate-300 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <ShieldAlert className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <p className="truncate font-medium">
            <span className="text-gold-400 font-semibold">Educational Tool Only:</span> Not financial advice.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs text-navy-100 bg-navy-800 hover:bg-navy-700 px-2 py-0.5 rounded border border-navy-600 transition flex items-center gap-1 shrink-0"
        >
          <Info className="w-3 h-3 text-gold-400" />
          <span>Disclaimers</span>
        </button>
      </div>

      {showModal && <ComplianceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
