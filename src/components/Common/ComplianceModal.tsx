import React from 'react';
import { X, ShieldAlert, AlertCircle, Clock, Award, CheckCircle2 } from 'lucide-react';
import { COMPLIANCE_NOTICES, ALL_COMPLIANCE_ITEMS } from '../../constants/compliance';

interface Props {
  onClose: () => void;
}

export const ComplianceModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Compliance & Risk Disclosure</h2>
              <p className="text-xs text-slate-400">Please read our educational terms carefully</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-300">
          {/* Primary Statement */}
          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-gold-500/30 text-white font-medium">
            <p className="leading-relaxed text-slate-200">
              {COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}
            </p>
          </div>

          {/* Detailed Compliance Cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-loss-900/20 border border-loss-600/40">
              <div className="flex items-center gap-2 text-loss-500 font-bold text-xs uppercase tracking-wider mb-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gold-900/20 border border-gold-600/40">
              <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                <Clock className="w-4 h-4" />
                <span>{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-800/70 border border-navy-700">
              <div className="flex items-center gap-2 text-navy-100 font-bold text-xs uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4 text-gold-400" />
                <span>{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-800/70 border border-navy-700">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-growth-400" />
                <span>{COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.text}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-navy-600 hover:bg-navy-500 text-white rounded-xl font-medium text-sm transition shadow-md"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
