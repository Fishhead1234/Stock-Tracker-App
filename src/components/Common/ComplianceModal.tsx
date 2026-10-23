import React from 'react';
import { X, ShieldAlert, AlertCircle, Clock, Award, CheckCircle2, Lock } from 'lucide-react';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  onClose: () => void;
}

export const ComplianceModal: React.FC<Props> = ({ onClose }) => {
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`border rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000]' 
            : 'bg-navy-900 border-navy-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                Compliance &amp; Governance
              </h2>
              <p className={`text-xs ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                Essential legal terms &amp; informational disclosures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              isLight 
                ? 'bg-[#E5E5EA] text-[#666666] hover:text-black' 
                : 'bg-navy-800 text-slate-300 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={`p-5 overflow-y-auto space-y-3.5 text-sm ${
          isLight ? 'text-[#333333]' : 'text-slate-300'
        }`}>
          {/* Primary Statement */}
          <div className={`p-3.5 rounded-xl border font-medium ${
            isLight 
              ? 'bg-[#FFF9E6] border-[#FF9500]/30 text-[#8F5B00]' 
              : 'bg-navy-950/80 border-gold-500/40 text-white'
          }`}>
            <p className={`leading-relaxed text-xs ${isLight ? 'text-[#8F5B00]' : 'text-slate-200'}`}>
              {COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}
            </p>
          </div>

          {/* NO IN-APP TRADING WARNING */}
          <div className={`p-3.5 rounded-xl border ${
            isLight 
              ? 'bg-[#FFF9E6] border-[#FF9500]/40' 
              : 'bg-gold-950/30 border-gold-500/50'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 ${
              isLight ? 'text-[#B25E00]' : 'text-gold-400'
            }`}>
              <Lock className={`w-4 h-4 ${isLight ? 'text-[#B25E00]' : 'text-gold-400'}`} />
              <span>{COMPLIANCE_NOTICES.NO_IN_APP_TRADING.title}</span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${
              isLight ? 'text-[#5C3B00]' : 'text-slate-200'
            }`}>
              {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text}
            </p>
          </div>

          {/* Market Risk Warning */}
          <div className={`p-3.5 rounded-xl border ${
            isLight 
              ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30' 
              : 'bg-loss-950/20 border-loss-600/40'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 ${
              isLight ? 'text-[#D70015]' : 'text-loss-500'
            }`}>
              <AlertCircle className="w-4 h-4" />
              <span>{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.title}</span>
            </div>
            <p className={`text-xs leading-relaxed ${
              isLight ? 'text-[#4A0000]' : 'text-slate-300'
            }`}>
              {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}
            </p>
          </div>

          {/* Data Delay Notice */}
          <div className={`p-3.5 rounded-xl border ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' 
              : 'bg-navy-800/70 border-navy-700'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 ${
              isLight ? 'text-[#000000]' : 'text-slate-200'
            }`}>
              <Clock className={`w-4 h-4 ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
              <span>{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.title}</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              {COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}
            </p>
          </div>

          {/* No Guaranteed Returns */}
          <div className={`p-3.5 rounded-xl border ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' 
              : 'bg-navy-800/70 border-navy-700'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 ${
              isLight ? 'text-[#000000]' : 'text-slate-200'
            }`}>
              <Award className={`w-4 h-4 ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
              <span>{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.title}</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              {COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}
            </p>
          </div>

          {/* Use At Your Own Risk */}
          <div className={`p-3.5 rounded-xl border ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' 
              : 'bg-navy-800/70 border-navy-700'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 ${
              isLight ? 'text-[#000000]' : 'text-slate-200'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
              <span>{COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.title}</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              {COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.text}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md text-white ${
              isLight 
                ? 'bg-[#007AFF] hover:bg-[#0062CC]' 
                : 'bg-growth-600 hover:bg-growth-500'
            }`}
          >
            I Acknowledge &amp; Understand
          </button>
        </div>
      </div>
    </div>
  );
};
