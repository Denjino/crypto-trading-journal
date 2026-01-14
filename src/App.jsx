import React, { useState, useEffect, useMemo } from 'react';

// Constants
const STRATEGY_TAGS = [
  { id: 'order-block', label: 'Order Block', color: '#a855f7' },
  { id: 'support-resistance', label: 'Support/Resistance', color: '#5c7cfa' },
  { id: 'mean-reversion', label: 'Mean Reversion', color: '#00d4aa' },
  { id: 'news-event', label: 'News Event', color: '#ffa502' },
  { id: 'breakout', label: 'Breakout', color: '#ff4757' },
  { id: 'moving-average', label: 'Moving Average', color: '#00bcd4' },
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Very Low', color: '#ff4757' },
  { value: 2, label: 'Low', color: '#ffa502' },
  { value: 3, label: 'Neutral', color: '#a0a0b0' },
  { value: 4, label: 'High', color: '#5c7cfa' },
  { value: 5, label: 'Very High', color: '#00d4aa' },
];

const MOCK_TICKERS = [
  'BTC', 'ETH', 'SOL', 'DOGE', 'AVAX', 'LINK', 'ARB', 'OP', 'MATIC', 'SUI', 
  'APT', 'INJ', 'TIA', 'SEI', 'JUP', 'WIF', 'PEPE', 'BONK', 'NEAR', 'ATOM', 
  'XRP', 'ADA', 'DOT', 'UNI', 'LTC', 'BCH', 'FIL', 'AAVE', 'MKR', 'SNX',
  'CRV', 'LDO', 'RUNE', 'GMX', 'DYDX', 'STX', 'IMX', 'BLUR', 'MEME', 'ORDI',
  'TRX', 'ETC', 'XLM', 'ALGO', 'VET', 'FTM', 'SAND', 'MANA', 'AXS', 'GALA',
  'ENS', 'OP', 'STRK', 'PYTH', 'JTO', 'ONDO', 'ENA', 'W', 'ETHFI', 'PENDLE',
  'WLD', 'ARK', 'CYBER', 'RDNT', 'CAKE', 'SUSHI', 'YFI', 'COMP', 'BAL', 'ZRX',
  'HBAR', 'ICP', 'THETA', 'EGLD', 'FLOW', 'KAVA', 'CELO', 'ONE', 'ZIL', 'QTUM',
  'TRUMP', 'FARTCOIN', 'AI16Z', 'HYPE', 'VIRTUAL', 'GRASS', 'GOAT', 'PNUT', 'ACT', 'CHILLGUY'
];

const MOCK_PRICES = { 
  BTC: 97500, ETH: 3450, SOL: 195, DOGE: 0.38, AVAX: 42, LINK: 24, ARB: 1.15, OP: 2.85, 
  MATIC: 0.52, SUI: 4.25, APT: 12.5, INJ: 28, TIA: 8.5, SEI: 0.65, JUP: 1.05, WIF: 2.45, 
  PEPE: 0.000021, BONK: 0.000032, NEAR: 5.8, ATOM: 9.5, XRP: 2.35, ADA: 1.05,
  DOT: 7.2, UNI: 14.5, LTC: 105, BCH: 485, FIL: 5.8, AAVE: 285, MKR: 1850, SNX: 3.2,
  CRV: 0.95, LDO: 2.1, RUNE: 5.5, GMX: 28, DYDX: 1.8, STX: 1.95, IMX: 1.45, BLUR: 0.28,
  MEME: 0.012, ORDI: 32, TRX: 0.24, ETC: 28, XLM: 0.42, ALGO: 0.38, VET: 0.045, FTM: 0.95,
  SAND: 0.58, MANA: 0.52, AXS: 7.5, GALA: 0.042, ENS: 32, STRK: 0.85, PYTH: 0.42,
  JTO: 3.2, ONDO: 1.45, ENA: 0.92, W: 0.32, ETHFI: 2.1, PENDLE: 5.8, WLD: 2.4,
  ARK: 0.65, CYBER: 5.2, RDNT: 0.08, CAKE: 2.5, SUSHI: 1.2, YFI: 8500, COMP: 85, BAL: 3.2, ZRX: 0.52,
  HBAR: 0.28, ICP: 12, THETA: 2.1, EGLD: 42, FLOW: 0.85, KAVA: 0.58, CELO: 0.72, ONE: 0.018, ZIL: 0.025, QTUM: 3.8,
  TRUMP: 42, FARTCOIN: 1.2, AI16Z: 1.8, HYPE: 25, VIRTUAL: 3.5, GRASS: 2.8, GOAT: 0.45, PNUT: 0.65, ACT: 0.28, CHILLGUY: 0.35
};

// Utilities
const formatCurrency = (v) => isNaN(v) ? '$0.00' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
const formatPercent = (v) => isNaN(v) ? '0%' : `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
const generateId = () => `t_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

// Icons
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Warning: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

// Hyperliquid API
const fetchHyperliquidPrices = async () => {
  try {
    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'allMids' })
    });
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Hyperliquid API unavailable, using static prices');
    return null;
  }
};

// Hooks
const useMarketData = () => {
  const [prices, setPrices] = useState(() => {
    // Initialize with static MOCK_PRICES (no random variance)
    return Object.fromEntries(Object.entries(MOCK_PRICES).map(([k, v]) => [k, v.toString()]));
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const refreshPrices = async () => {
    const liveData = await fetchHyperliquidPrices();
    if (liveData) {
      setPrices(liveData);
      setLastUpdate(new Date());
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  };

  useEffect(() => {
    // Try to fetch live prices on mount
    refreshPrices();
    // Then try every 10 seconds
    const id = setInterval(refreshPrices, 10000);
    return () => clearInterval(id);
  }, []);

  return { 
    tickers: MOCK_TICKERS.map(s => ({ symbol: s })), 
    prices, 
    isLive, 
    lastUpdate,
    refreshPrices 
  };
};

const useTiltDetection = (trades, settings) => useMemo(() => {
  const warnings = [];
  const open = trades.filter(t => t.status === 'open');
  const closed = trades.filter(t => t.status === 'closed');
  const risk = open.reduce((s, t) => s + (t.riskPercent || 0), 0);
  
  if (risk > settings.maxTotalOpenRisk) warnings.push({ type: 'high-exposure', severity: 'critical', message: `Total risk ${risk.toFixed(1)}% exceeds ${settings.maxTotalOpenRisk}%`, suggestion: 'Close some positions' });
  
  let losses = 0;
  for (let i = closed.length - 1; i >= 0; i--) { if (closed[i].pnl < 0) losses++; else break; }
  if (losses >= settings.consecutiveLossesAlert) warnings.push({ type: 'losing-streak', severity: 'warning', message: `${losses} consecutive losses`, suggestion: 'Take a break' });
  
  if (closed.length >= 3) {
    const last3 = closed.slice(-3);
    if (last3.every(t => t.pnl < 0) && last3.every((t, i) => i === 0 || t.positionSize > last3[i-1].positionSize))
      warnings.push({ type: 'revenge-trading', severity: 'critical', message: 'Increasing size after losses', suggestion: 'Stop immediately' });
  }
  
  return warnings;
}, [trades, settings]);

// Components
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</div>
    <div className={`text-xl font-semibold font-mono ${color || 'text-white'}`}>{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
);

const TiltWarnings = ({ warnings }) => {
  const [dismissed, setDismissed] = useState({});
  const active = warnings.filter(w => !dismissed[w.type]);
  if (!active.length) return null;
  
  return (
    <div className="mb-5 space-y-2">
      {active.map(w => (
        <div key={w.type} className={`rounded-lg p-3 flex items-start gap-3 ${w.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
          <Icons.Warning />
          <div className="flex-1">
            <div className={`text-xs font-semibold uppercase ${w.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{w.type.replace(/-/g, ' ')}</div>
            <div className="text-sm text-white mt-1">{w.message}</div>
            <div className="text-xs text-slate-400 mt-1">💡 {w.suggestion}</div>
          </div>
          <button onClick={() => setDismissed(p => ({ ...p, [w.type]: true }))} className="text-slate-500 hover:text-white"><Icons.X /></button>
        </div>
      ))}
    </div>
  );
};

const Calculator = ({ form, settings, trades, onFormChange }) => {
  const [manualRisk, setManualRisk] = useState('');
  
  const calc = useMemo(() => {
    const { entry, stopLoss, takeProfit, positionSizeUSD, direction, leverage } = form;
    const e = parseFloat(entry), sl = parseFloat(stopLoss), tp = parseFloat(takeProfit), posUSD = parseFloat(positionSizeUSD);
    const lev = leverage || 1;
    
    // Calculate current open risk
    const currentRiskPct = trades.filter(t => t.status === 'open').reduce((s, t) => s + (t.riskPercent || 0), 0);
    const currentRiskDollar = trades.filter(t => t.status === 'open').reduce((s, t) => s + (t.riskDollar || 0), 0);
    
    if (!e || !sl) return { currentRiskPct, currentRiskDollar, partial: true, leverage: lev };
    
    // Calculate risk per dollar of position (before leverage)
    const riskPerUnit = Math.abs(direction === 'long' ? e - sl : sl - e);
    const riskPctOfEntry = (riskPerUnit / e) * 100;
    
    if (!posUSD) return { currentRiskPct, currentRiskDollar, riskPctOfEntry, partial: true, leverage: lev };
    
    // Position calculations - leverage applied
    const leveragedPositionUSD = posUSD * lev;
    const coinQty = leveragedPositionUSD / e;
    
    // Risk calculations - leverage amplifies risk
    const riskDollar = (riskPerUnit / e) * leveragedPositionUSD;
    const riskPct = (riskDollar / settings.accountBalance) * 100;
    
    // Reward calculations - leverage amplifies reward
    const rewardPerUnit = tp ? Math.abs(direction === 'long' ? tp - e : e - tp) : 0;
    const rewardDollar = tp ? (rewardPerUnit / e) * leveragedPositionUSD : 0;
    const rewardPct = (rewardDollar / settings.accountBalance) * 100;
    const rr = riskDollar > 0 ? rewardDollar / riskDollar : 0;
    
    const totalRiskPct = currentRiskPct + riskPct;
    const totalRiskDollar = currentRiskDollar + riskDollar;
    
    return { 
      coinQty, posUSD, leveragedPositionUSD, 
      riskDollar, riskPct, riskPctOfEntry,
      rewardDollar, rewardPct, rr, 
      currentRiskPct, currentRiskDollar,
      totalRiskPct, totalRiskDollar,
      leverage: lev,
      partial: false 
    };
  }, [form, settings, trades]);

  // Handle manual risk input - calculate position size from risk amount
  const handleRiskChange = (riskValue) => {
    setManualRisk(riskValue); // Keep raw input, don't format
    const risk = parseFloat(riskValue);
    const e = parseFloat(form.entry);
    const sl = parseFloat(form.stopLoss);
    const lev = form.leverage || 1;
    
    if (risk && e && sl) {
      // riskDollar = (riskPerUnit / e) * leveragedPositionUSD = (riskPerUnit / e) * posUSD * leverage
      // So: posUSD = riskDollar / ((riskPerUnit / e) * leverage)
      const riskPerUnit = Math.abs(form.direction === 'long' ? e - sl : sl - e);
      const newPosUSD = (risk * e) / (riskPerUnit * lev);
      onFormChange('positionSizeUSD', newPosUSD.toFixed(2));
    }
  };

  // Only sync when position size changes externally AND risk input is not focused
  const [riskFocused, setRiskFocused] = useState(false);
  useEffect(() => {
    if (!riskFocused && calc && !calc.partial && calc.riskDollar) {
      setManualRisk(calc.riskDollar.toFixed(2));
    }
  }, [calc?.riskDollar, riskFocused]);

  const highRisk = calc && !calc.partial && calc.riskPct > settings.maxRiskPerTrade;
  const highTotal = calc && !calc.partial && calc.totalRiskPct > settings.maxTotalOpenRisk;

  return (
    <div className={`rounded-xl p-5 border ${highRisk || highTotal ? 'border-red-500/50 bg-slate-800/50' : 'border-slate-700/50 bg-slate-800/30'}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-4">📊 Live Calculator <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/></div>
      <div className="space-y-2">
        {/* Editable Trade Risk */}
        <div className={`p-3 rounded-lg ${highRisk ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-700/30'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Trade Risk {highRisk && '⚠️'}</span>
            {calc && !calc.partial && <span className="text-xs text-slate-500">{calc.riskPct.toFixed(2)}% of account</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <input 
              type="number" 
              value={manualRisk}
              onChange={e => handleRiskChange(e.target.value)}
              onFocus={() => setRiskFocused(true)}
              onBlur={() => setRiskFocused(false)}
              placeholder="0.00"
              className={`flex-1 bg-transparent font-mono font-semibold text-lg outline-none ${highRisk ? 'text-red-400' : 'text-orange-400'}`}
            />
          </div>
          <div className="text-xs text-slate-600 mt-1">Edit to auto-calculate position size</div>
        </div>

        {/* Trade Reward */}
        {calc && !calc.partial && (
          <div className="flex justify-between p-3 rounded-lg bg-slate-700/30">
            <span className="text-sm text-slate-400">Trade Reward</span>
            <div className="text-right">
              <div className="font-mono font-semibold text-emerald-400">{formatCurrency(calc.rewardDollar)}</div>
              <div className="text-xs text-slate-500">{calc.rewardPct.toFixed(2)}%</div>
            </div>
          </div>
        )}

        {/* Risk:Reward */}
        {calc && !calc.partial && calc.rr > 0 && (
          <div className="flex justify-between p-3 rounded-lg bg-slate-700/30">
            <span className="text-sm text-slate-400">Risk:Reward</span>
            <div className={`font-mono text-lg font-bold ${calc.rr >= 2 ? 'text-emerald-400' : calc.rr >= 1 ? 'text-orange-400' : 'text-red-400'}`}>1:{calc.rr.toFixed(2)}</div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-700 my-2"></div>

        {/* Position Value after Leverage */}
        {calc && !calc.partial && (
          <div className="flex justify-between p-3 rounded-lg bg-slate-700/30">
            <div>
              <span className="text-sm text-slate-400">Position Value</span>
              <div className="text-xs text-slate-600">With {calc.leverage}x leverage</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-purple-400">{formatCurrency(calc.leveragedPositionUSD)}</div>
              <div className="text-xs text-slate-500">{calc.coinQty.toFixed(6)} {form.symbol}</div>
            </div>
          </div>
        )}

        {/* Total Open Risk */}
        <div className={`p-4 rounded-lg ${highTotal ? 'bg-red-500/20 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-sm font-semibold ${highTotal ? 'text-red-400' : 'text-blue-400'}`}>Total Open Risk {highTotal && '⚠️'}</div>
              <div className="text-xs text-slate-500 mt-1">
                Current: {calc.currentRiskPct.toFixed(1)}% {calc && !calc.partial && `+ New: ${calc.riskPct.toFixed(1)}%`}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-xl font-bold ${highTotal ? 'text-red-400' : 'text-blue-400'}`}>
                {calc && !calc.partial ? calc.totalRiskPct.toFixed(1) : calc.currentRiskPct.toFixed(1)}%
              </div>
              <div className={`font-mono text-sm ${highTotal ? 'text-red-400/70' : 'text-blue-400/70'}`}>
                {formatCurrency(calc && !calc.partial ? calc.totalRiskDollar : calc.currentRiskDollar)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Screens
const Dashboard = ({ trades, settings, prices, warnings }) => {
  const open = trades.filter(t => t.status === 'open');
  const closed = trades.filter(t => t.status === 'closed');
  const totalPnl = closed.reduce((s, t) => s + (t.pnl || 0), 0);
  const wins = closed.filter(t => t.pnl > 0).length;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  const openRisk = open.reduce((s, t) => s + (t.riskPercent || 0), 0);
  const openPnl = open.reduce((s, t) => {
    const p = parseFloat(prices[t.symbol]) || t.entry;
    const pctMove = (p - t.entry) / t.entry;
    const leveragedPos = t.leveragedPositionUSD || (t.positionSizeUSD * t.leverage);
    const pnl = t.direction === 'long' ? pctMove * leveragedPos : -pctMove * leveragedPos;
    return s + pnl;
  }, 0);

  return (
    <div>
      <TiltWarnings warnings={warnings} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Account Value" value={formatCurrency(settings.accountBalance + totalPnl + openPnl)} sub={`Base: ${formatCurrency(settings.accountBalance)}`} />
        <StatCard label="Open Risk" value={`${openRisk.toFixed(1)}%`} color={openRisk > settings.maxTotalOpenRisk ? 'text-red-400' : 'text-orange-400'} />
        <StatCard label="Total P&L" value={formatCurrency(totalPnl)} color={totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
        <StatCard label="Win Rate" value={`${winRate.toFixed(0)}%`} sub={`${wins}W / ${closed.length - wins}L`} color={winRate >= 50 ? 'text-emerald-400' : 'text-red-400'} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>Open Positions ({open.length})</h3>
          {!open.length ? <div className="text-center text-slate-600 py-8">No open positions</div> : (
            <div className="space-y-2">
              {open.map(t => {
                const p = parseFloat(prices[t.symbol]) || t.entry;
                const pctMove = (p - t.entry) / t.entry;
                const leveragedPos = t.leveragedPositionUSD || (t.positionSizeUSD * t.leverage);
                const pnl = t.direction === 'long' ? pctMove * leveragedPos : -pctMove * leveragedPos;
                const pnlPct = (pnl / t.positionSizeUSD) * 100;
                return (
                  <div key={t.id} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{t.symbol}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${t.direction === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.direction.toUpperCase()} {t.leverage}x</span>
                      </div>
                      <span className={`font-mono font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(pnl)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500 mt-2">
                      <span>Entry: {formatCurrency(t.entry)}</span>
                      <span>Current: {formatCurrency(p)}</span>
                      <span>Size: {formatCurrency(t.positionSizeUSD)}</span>
                      <span>Risk: {t.riskPercent?.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold mb-4">Recent Closed</h3>
          {!closed.length ? <div className="text-center text-slate-600 py-8">No closed trades</div> : (
            <div className="space-y-1">
              {closed.slice(-5).reverse().map(t => (
                <div key={t.id} className="flex justify-between items-center p-2 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t.pnl >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}/>
                    <span className="font-mono text-sm">{t.symbol}</span>
                  </div>
                  <span className={`font-mono font-semibold text-sm ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(t.pnl)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NewTrade = ({ onSubmit, tickers, prices, settings, trades }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ direction: 'long', symbol: '', positionSizeUSD: '', entry: '', stopLoss: '', takeProfit: '', leverage: 2, strategies: [], notes: '', confidence: 3, screenshot: null });
  const [search, setSearch] = useState('');
  const [showDrop, setShowDrop] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return tickers.slice(0, 30);
    return tickers.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase())).slice(0, 30);
  }, [tickers, search]);

  const selectSymbol = (s) => { 
    const price = prices[s] ? parseFloat(prices[s]) : '';
    setForm(p => ({ ...p, symbol: s, entry: price })); 
    setSearch(s); 
    setShowDrop(false); 
  };
  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const toggleStrategy = (id) => setForm(p => ({ ...p, strategies: p.strategies.includes(id) ? p.strategies.filter(x => x !== id) : [...p.strategies, id] }));

  const submit = () => {
    const e = parseFloat(form.entry), sl = parseFloat(form.stopLoss), posUSD = parseFloat(form.positionSizeUSD);
    const lev = form.leverage || 1;
    const leveragedPosUSD = posUSD * lev;
    const coinQty = leveragedPosUSD / e;
    const riskPerUnit = Math.abs(form.direction === 'long' ? e - sl : sl - e);
    const riskDollar = (riskPerUnit / e) * leveragedPosUSD;
    const riskPercent = (riskDollar / settings.accountBalance) * 100;
    onSubmit({ 
      id: generateId(), 
      ...form, 
      entry: e, 
      stopLoss: sl, 
      takeProfit: parseFloat(form.takeProfit) || null, 
      positionSizeUSD: posUSD,
      leveragedPositionUSD: leveragedPosUSD,
      positionSize: coinQty, // coin quantity for P&L calculations
      riskDollar, 
      riskPercent, 
      status: 'open', 
      createdAt: new Date().toISOString() 
    });
    setForm({ direction: 'long', symbol: '', positionSizeUSD: '', entry: '', stopLoss: '', takeProfit: '', leverage: 2, strategies: [], notes: '', confidence: 3, screenshot: null });
    setSearch(''); setStep(1);
  };

  const inputCls = "w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500";
  const labelCls = "block text-xs text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[1, 2].map(s => <button key={s} onClick={() => setStep(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${step === s ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400'}`}>{s === 1 ? 'Trade Details' : 'Strategy'}</button>)}
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          {step === 1 ? (
            <>
              <div className="mb-5">
                <label className={labelCls}>Direction</label>
                <div className="flex gap-3">
                  {['long', 'short'].map(d => (
                    <button key={d} onClick={() => change('direction', d)} className={`flex-1 py-3 rounded-lg font-semibold uppercase ${form.direction === d ? (d === 'long' ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-2 border-red-500 text-red-400') : 'bg-slate-700/50 border-2 border-slate-600 text-slate-400'}`}>
                      {d === 'long' ? '↑ Long' : '↓ Short'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5 relative">
                <label className={labelCls}>Symbol</label>
                <input type="text" value={search} onChange={e => { setSearch(e.target.value); setShowDrop(true); }} onFocus={() => setShowDrop(true)} placeholder="Search..." className={inputCls} />
                {showDrop && filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg max-h-64 overflow-auto z-50">
                    {filtered.map(t => (
                      <button key={t.symbol} onClick={() => selectSymbol(t.symbol)} className="w-full px-3 py-2.5 flex justify-between hover:bg-slate-700 text-left border-b border-slate-700/50 last:border-0">
                        <span className="font-mono font-medium">{t.symbol}</span>
                        <span className="text-emerald-400 text-sm font-mono">{prices[t.symbol] ? formatCurrency(parseFloat(prices[t.symbol])) : '—'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className={labelCls}>Position Size (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input type="number" value={form.positionSizeUSD} onChange={e => change('positionSizeUSD', e.target.value)} placeholder="0.00" className={`${inputCls} pl-7`} step="any" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Leverage</label>
                  <div className="flex gap-2">
                    {[2, 5].map(l => (
                      <button key={l} onClick={() => change('leverage', l)} className={`flex-1 py-2.5 rounded-lg font-mono font-semibold ${form.leverage === l ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400'}`}>{l}x</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div><label className={labelCls}>Entry</label><input type="number" value={form.entry} onChange={e => change('entry', e.target.value)} placeholder="0.00" className={inputCls} step="any" /></div>
                <div><label className={labelCls}>Stop Loss</label><input type="number" value={form.stopLoss} onChange={e => change('stopLoss', e.target.value)} placeholder="0.00" className={`${inputCls} ${form.stopLoss ? 'border-red-500/50' : ''}`} step="any" /></div>
                <div><label className={labelCls}>Take Profit</label><input type="number" value={form.takeProfit} onChange={e => change('takeProfit', e.target.value)} placeholder="0.00" className={`${inputCls} ${form.takeProfit ? 'border-emerald-500/50' : ''}`} step="any" /></div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold flex items-center justify-center gap-2">Continue <Icons.ChevronRight /></button>
            </>
          ) : (
            <>
              <div className="mb-5">
                <label className={labelCls}>Strategy Tags <span className="text-slate-600 normal-case">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {STRATEGY_TAGS.map(t => (
                    <button key={t.id} onClick={() => toggleStrategy(t.id)} style={{ borderColor: form.strategies.includes(t.id) ? t.color : undefined, backgroundColor: form.strategies.includes(t.id) ? `${t.color}20` : undefined, color: form.strategies.includes(t.id) ? t.color : undefined }} className="px-3 py-1.5 rounded-lg text-sm border border-slate-600 text-slate-400">{t.label}</button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className={labelCls}>Confidence <span className="text-slate-600 normal-case">(optional)</span></label>
                <div className="flex gap-2">
                  {CONFIDENCE_LEVELS.map(l => (
                    <button key={l.value} onClick={() => change('confidence', l.value)} style={{ borderColor: form.confidence === l.value ? l.color : undefined, backgroundColor: form.confidence === l.value ? `${l.color}20` : undefined, color: form.confidence === l.value ? l.color : undefined }} className="flex-1 py-2 rounded-lg text-xs border border-slate-600 text-slate-500">{l.label}</button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className={labelCls}>Notes <span className="text-slate-600 normal-case">(optional)</span></label>
                <textarea value={form.notes} onChange={e => change('notes', e.target.value)} placeholder="Trade thesis..." className={`${inputCls} min-h-[80px] resize-none`} />
              </div>
              <div className="mb-6">
                <label className={labelCls}>Chart Screenshot <span className="text-slate-600 normal-case">(optional)</span></label>
                <div className={`border-2 border-dashed rounded-lg ${form.screenshot ? 'border-emerald-500/50 p-0' : 'border-slate-600 p-6'} text-center cursor-pointer relative overflow-hidden`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => change('screenshot', ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  {form.screenshot ? (
                    <div className="relative">
                      <img src={form.screenshot} alt="Chart" className="w-full max-h-32 object-cover rounded-lg" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); change('screenshot', null); }} 
                        className="absolute top-2 right-2 bg-slate-900/80 rounded-full p-1 hover:bg-slate-900"
                      >
                        <Icons.X />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Icons.Upload />
                      <div className="text-slate-500 text-sm mt-2">Click or drag to upload</div>
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={submit} 
                disabled={!form.symbol || !form.entry || !form.stopLoss || !form.positionSizeUSD} 
                className={`w-full py-3 rounded-lg text-white font-semibold ${form.direction === 'long' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Open {form.direction === 'long' ? 'Long' : 'Short'}
              </button>
            </>
          )}
        </div>
        <Calculator form={form} settings={settings} trades={trades} onFormChange={change} />
      </div>
    </div>
  );
};

const ActiveTrades = ({ trades, prices, onClose, settings }) => {
  const [closing, setClosing] = useState(null);
  const [exitPrice, setExitPrice] = useState('');
  const open = trades.filter(t => t.status === 'open');
  const risk = open.reduce((s, t) => s + (t.riskPercent || 0), 0);
  const pnl = open.reduce((s, t) => {
    const p = parseFloat(prices[t.symbol]) || t.entry;
    const pctMove = (p - t.entry) / t.entry;
    const leveragedPos = t.leveragedPositionUSD || (t.positionSizeUSD * t.leverage);
    return s + (t.direction === 'long' ? pctMove * leveragedPos : -pctMove * leveragedPos);
  }, 0);

  const closeAt = (t, p) => {
    const pctMove = (p - t.entry) / t.entry;
    const leveragedPos = t.leveragedPositionUSD || (t.positionSizeUSD * t.leverage);
    const tradePnl = t.direction === 'long' ? pctMove * leveragedPos : -pctMove * leveragedPos;
    onClose(t.id, { exitPrice: p, pnl: tradePnl, exitTime: new Date().toISOString(), status: 'closed' });
    setClosing(null); setExitPrice('');
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Open Positions" value={open.length} />
        <StatCard label="Total Risk" value={`${risk.toFixed(1)}%`} color={risk > settings.maxTotalOpenRisk ? 'text-red-400' : 'text-orange-400'} />
        <StatCard label="Unrealized P&L" value={formatCurrency(pnl)} color={pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
      </div>
      {!open.length ? (
        <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700/50">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-lg font-medium">No Active Positions</div>
          <div className="text-slate-500">Open a trade to get started</div>
        </div>
      ) : (
        <div className="space-y-3">
          {open.map(t => {
            const p = parseFloat(prices[t.symbol]) || t.entry;
            const pctMove = (p - t.entry) / t.entry;
            const leveragedPos = t.leveragedPositionUSD || (t.positionSizeUSD * t.leverage);
            const tpnl = t.direction === 'long' ? pctMove * leveragedPos : -pctMove * leveragedPos;
            const pnlPct = (tpnl / t.positionSizeUSD) * 100;
            return (
              <div key={t.id} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-bold">{t.symbol}</span>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${t.direction === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.direction.toUpperCase()} {t.leverage}x</span>
                    <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">Risk: {t.riskPercent?.toFixed(1)}%</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-mono font-bold ${tpnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(tpnl)}</div>
                    <div className={`text-sm ${tpnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatPercent(pnlPct)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-4 text-sm">
                  {[{ l: 'Entry', v: formatCurrency(t.entry) }, { l: 'Current', v: formatCurrency(p) }, { l: 'Stop Loss', v: formatCurrency(t.stopLoss), c: 'text-red-400' }, { l: 'Take Profit', v: t.takeProfit ? formatCurrency(t.takeProfit) : '—', c: 'text-emerald-400' }, { l: 'Size', v: formatCurrency(t.positionSizeUSD) }].map(x => (
                    <div key={x.l}><div className="text-xs text-slate-500">{x.l}</div><div className={`font-mono ${x.c || ''}`}>{x.v}</div></div>
                  ))}
                </div>
                {closing === t.id ? (
                  <div className="flex gap-2">
                    <input type="number" value={exitPrice} onChange={e => setExitPrice(e.target.value)} placeholder="Exit price" className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-mono text-sm" />
                    <button onClick={() => closeAt(t, parseFloat(exitPrice))} disabled={!exitPrice} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-semibold text-sm disabled:opacity-50">Confirm</button>
                    <button onClick={() => { setClosing(null); setExitPrice(''); }} className="px-4 py-2 bg-slate-700/50 rounded-lg text-slate-400 text-sm">Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => closeAt(t, p)} className="flex-1 py-2 bg-blue-600 rounded-lg text-white font-semibold text-sm">Close at Market ({formatCurrency(p)})</button>
                    <button onClick={() => setClosing(t.id)} className="flex-1 py-2 bg-slate-700/50 rounded-lg text-slate-400 text-sm">Custom Price</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ClosedTrades = ({ trades }) => {
  const [selected, setSelected] = useState(null);
  const closed = [...trades.filter(t => t.status === 'closed')].sort((a, b) => new Date(b.exitTime) - new Date(a.exitTime));
  const pnl = closed.reduce((s, t) => s + (t.pnl || 0), 0);
  const wins = closed.filter(t => t.pnl > 0).length;

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Total P&L" value={formatCurrency(pnl)} color={pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
        <StatCard label="Trades" value={closed.length} />
        <StatCard label="Win Rate" value={`${closed.length ? ((wins/closed.length)*100).toFixed(0) : 0}%`} color={wins/closed.length >= 0.5 ? 'text-emerald-400' : 'text-red-400'} />
        <StatCard label="Wins/Losses" value={`${wins} / ${closed.length - wins}`} />
      </div>
      {!closed.length ? (
        <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700/50">
          <div className="text-4xl mb-3">📈</div>
          <div className="text-lg font-medium">No Closed Trades</div>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>{['Symbol', 'Dir', 'Entry', 'Exit', 'P&L', 'Date'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 uppercase font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {closed.map(t => (
                <tr key={t.id} onClick={() => setSelected(t.id)} className="border-t border-slate-700/50 hover:bg-slate-700/30 cursor-pointer">
                  <td className="px-4 py-3 font-mono font-semibold">{t.symbol}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${t.direction === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.direction?.toUpperCase()}</span></td>
                  <td className="px-4 py-3 font-mono text-sm">{formatCurrency(t.entry)}</td>
                  <td className="px-4 py-3 font-mono text-sm">{formatCurrency(t.exitPrice)}</td>
                  <td className={`px-4 py-3 font-mono font-semibold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(t.pnl)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{new Date(t.exitTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-slate-800 rounded-xl p-6 w-[400px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            {(() => {
              const t = closed.find(x => x.id === selected);
              if (!t) return null;
              return (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono font-bold">{t.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded ${t.direction === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.direction?.toUpperCase()}</span>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-500"><Icons.X /></button>
                  </div>
                  <div className={`text-center p-5 rounded-xl mb-5 ${t.pnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    <div className="text-xs text-slate-500 uppercase mb-1">Final P&L</div>
                    <div className={`text-3xl font-mono font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(t.pnl)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[{ l: 'Entry', v: formatCurrency(t.entry) }, { l: 'Exit', v: formatCurrency(t.exitPrice) }, { l: 'Stop Loss', v: formatCurrency(t.stopLoss), c: 'text-red-400' }, { l: 'Size', v: formatCurrency(t.positionSizeUSD || t.positionSize) }].map(x => (
                      <div key={x.l} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="text-xs text-slate-500 uppercase mb-1">{x.l}</div>
                        <div className={`font-mono font-medium ${x.c || ''}`}>{x.v}</div>
                      </div>
                    ))}
                  </div>
                  {t.strategies?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 uppercase mb-2">Strategies</div>
                      <div className="flex flex-wrap gap-1">{t.strategies.map(s => {const tag = STRATEGY_TAGS.find(x => x.id === s); return tag && <span key={s} className="text-xs px-2 py-1 rounded" style={{ background: `${tag.color}20`, color: tag.color }}>{tag.label}</span>;})}</div>
                    </div>
                  )}
                  {t.notes && <div className="mb-4"><div className="text-xs text-slate-500 uppercase mb-2">Notes</div><div className="bg-slate-700/30 rounded-lg p-3 text-sm">{t.notes}</div></div>}
                  {t.screenshot && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-2">Chart Screenshot</div>
                      <img src={t.screenshot} alt="Trade chart" className="w-full rounded-lg border border-slate-700" />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPage = ({ settings, onUpdate, trades }) => {
  const [local, setLocal] = useState(settings);
  const pnl = trades.filter(t => t.status === 'closed').reduce((s, t) => s + (t.pnl || 0), 0);
  const save = (f, v) => { const n = { ...local, [f]: parseFloat(v) || 0 }; setLocal(n); onUpdate(n); };
  const inputCls = "w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-base font-semibold mb-5">💰 Account</h3>
        <div className="mb-5">
          <label className="block text-xs text-slate-500 uppercase mb-1.5">Base Balance</label>
          <input type="number" value={local.accountBalance} onChange={e => save('accountBalance', e.target.value)} className={inputCls} />
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex justify-between mb-2 text-sm"><span className="text-slate-500">Base</span><span className="font-mono">{formatCurrency(local.accountBalance)}</span></div>
          <div className="flex justify-between mb-2 text-sm"><span className="text-slate-500">Realized P&L</span><span className={`font-mono ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(pnl)}</span></div>
          <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between"><span className="font-medium">Current</span><span className="font-mono font-semibold">{formatCurrency(local.accountBalance + pnl)}</span></div>
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-base font-semibold mb-5">⚠️ Risk Settings</h3>
        {[{ f: 'maxRiskPerTrade', l: 'Max Risk/Trade (%)', d: 'Warning when single trade exceeds' },{ f: 'maxTotalOpenRisk', l: 'Max Total Risk (%)', d: 'Warning when all positions exceed' },{ f: 'consecutiveLossesAlert', l: 'Loss Streak Alert', d: 'Tilt warning after X losses' }].map(x => (
          <div key={x.f} className="mb-4">
            <label className="block text-xs text-slate-500 uppercase mb-1.5">{x.l}</label>
            <input type="number" value={local[x.f]} onChange={e => save(x.f, e.target.value)} className={inputCls} />
            <div className="text-xs text-slate-600 mt-1">{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [state, setState] = useState({ 
    settings: { accountBalance: 10000, maxRiskPerTrade: 2, maxTotalOpenRisk: 5, consecutiveLossesAlert: 3 }, 
    trades: [] 
  });
  
  const { tickers, prices, isLive, refreshPrices } = useMarketData();
  const warnings = useTiltDetection(state.trades, state.settings);

  const addTrade = t => { setState(p => ({ ...p, trades: [...p.trades, t] })); setScreen('active'); };
  const closeTrade = (id, d) => setState(p => ({ ...p, trades: p.trades.map(t => t.id === id ? { ...t, ...d } : t) }));
  const updateSettings = s => setState(p => ({ ...p, settings: s }));

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'new', label: 'New Trade', icon: Icons.Plus },
    { id: 'active', label: 'Active', icon: Icons.Activity },
    { id: 'closed', label: 'Closed', icon: Icons.Check },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  const titles = { dashboard: 'Dashboard', new: 'New Trade', active: 'Active Trades', closed: 'Trade History', settings: 'Settings' };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <aside className="w-52 bg-slate-800/50 border-r border-slate-700/50 p-4 fixed h-full">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-mono font-bold text-xs">CJ</div>
          <div><div className="text-sm font-semibold">Trading Journal</div><div className="text-[10px] text-slate-500">Hyperliquid</div></div>
        </div>
        <nav className="space-y-1">
          {nav.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={() => setScreen(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${screen === n.id ? 'bg-slate-700/50 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/30'}`}>
                <Icon />{n.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 ml-52 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">{titles[screen]}</h1>
          <div className="flex items-center gap-3">
            <button onClick={refreshPrices} className="flex items-center gap-1.5 text-xs hover:text-white transition-colors" title="Refresh prices">
              {isLive ? (
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live</span>
              ) : (
                <span className="flex items-center gap-1.5 text-orange-400"><Icons.Refresh /> Static</span>
              )}
            </button>
            <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        {screen === 'dashboard' && <Dashboard trades={state.trades} settings={state.settings} prices={prices} warnings={warnings} />}
        {screen === 'new' && <NewTrade onSubmit={addTrade} tickers={tickers} prices={prices} settings={state.settings} trades={state.trades} />}
        {screen === 'active' && <ActiveTrades trades={state.trades} prices={prices} onClose={closeTrade} settings={state.settings} />}
        {screen === 'closed' && <ClosedTrades trades={state.trades} />}
        {screen === 'settings' && <SettingsPage settings={state.settings} onUpdate={updateSettings} trades={state.trades} />}
      </main>
    </div>
  );
}
