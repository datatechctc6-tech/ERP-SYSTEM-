import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Activity,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import './Dashboard.css';

const data = [
  { name: 'Apr', revenue: 4000, expenses: 2400 },
  { name: 'May', revenue: 3000, expenses: 1398 },
  { name: 'Jun', revenue: 2000, expenses: 5800 },
  { name: 'Jul', revenue: 2780, expenses: 3908 },
  { name: 'Aug', revenue: 1890, expenses: 4800 },
  { name: 'Sep', revenue: 2390, expenses: 3800 },
  { name: 'Oct', revenue: 3490, expenses: 4300 },
  { name: 'Nov', revenue: 4200, expenses: 3200 },
  { name: 'Dec', revenue: 5100, expenses: 2800 },
];

const deptData = [
  { name: 'Sales', value: 400, color: '#004d40' },
  { name: 'Ops', value: 300, color: '#00695c' },
  { name: 'Finance', value: 300, color: '#00796b' },
  { name: 'HR', value: 200, color: '#00897b' },
  { name: 'IT', value: 150, color: '#009688' },
];

const StatCard = ({ label, value, trend, icon, color }) => (
  <div className="dash-stat-card bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between flex-1 min-w-[180px]">
    <div className="flex flex-col">
      <p className="dash-stat-label text-gray-800 text-[12px] font-black uppercase tracking-widest">{label}</p>
      <h3 className="dash-stat-value text-lg font-black text-gray-900 leading-tight whitespace-nowrap">{value}</h3>
      <span className={`dash-stat-trend text-[9px] font-bold flex items-center ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {Math.abs(trend)}%
      </span>
    </div>
    <div className={`p-2 rounded-lg ${color} text-white shadow-sm flex-shrink-0`}>
      {icon}
    </div>
  </div>
);

function Dashboard() {
  const { id } = useParams();
  const location = useLocation();
  const cameFromLogin = location.state?.fromLogin && !sessionStorage.getItem('welcomeShown');
  const [showWelcome, setShowWelcome] = useState(cameFromLogin);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('welcomeShown', 'true');
  };

  return (
    <div className="dashboard-page h-[calc(100vh-80px)] overflow-hidden flex flex-col space-y-3 p-1">

      {/* Welcome Message Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[420px] overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-[#004d40] px-6 py-4 text-center">
              <h2 className="text-xl font-black text-white tracking-wide">Welcome</h2>
              <p className="text-[#a7ffeb] text-xs font-semibold mt-1">DATATECH ERP System</p>
            </div>
            {/* Body */}
            <div className="px-6 py-5 text-center">
              <p className="text-gray-700 text-sm font-semibold leading-relaxed">
                Welcome to <span className="text-[#004d40] font-black">Datatech ERP System</span>
              </p>
              <p className="text-gray-400 text-xs mt-2">Your enterprise resource planning solution is ready.</p>
            </div>
            {/* Footer */}
            <div className="flex border-t border-gray-100">
              <button
                onClick={handleCloseWelcome}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Header */}
      <div className="dash-header flex items-center justify-between bg-[#004d40] px-4 py-2 rounded-xl text-white shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <TrendingUp size={18} className="text-[#a7ffeb]" />
          </div>
          <div>
            <h1 className="dash-header-title text-sm font-black tracking-tight uppercase leading-none">GP Command Center</h1>
            <p className="dash-header-sub text-[9px] text-[#80cbc4] font-bold mt-1">
              GP Admin: <span className="text-white">#{id || '001'}</span> | Status: <span className="text-[#a7ffeb]">ACTIVE</span>
            </p>
          </div>
        </div>
        <div className="dash-header-badge flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a7ffeb]">
          <span className="flex items-center gap-1"><Activity size={12} /> Live System</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 flex-shrink-0 overflow-x-auto no-scrollbar">
        <StatCard label="Total Grampanchayat" value="542" trend={3} icon={<Database size={16} />} color="bg-indigo-600" />
        <StatCard label="Active Grampanchayat" value="486" trend={12} icon={<Activity size={16} />} color="bg-emerald-600" />
        <StatCard label="Unprocess" value="58" trend={-5} icon={<Clock size={16} />} color="bg-amber-600" />
        <StatCard label="Complete" value="428" trend={18} icon={<CheckCircle size={16} />} color="bg-blue-600" />
      </div>

      {/* Main Area (70/30 split) */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Growth Chart */}
        <div className="dash-chart-card w-[70%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="dash-chart-title text-[10px] font-black text-gray-900 uppercase tracking-widest">Revenue Analytics</h3>
            <div className="dash-chart-legend flex gap-4 text-[9px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Revenue
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <span className="w-2 h-2 rounded-full bg-gray-200" /> Target
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#e2e8f0" strokeWidth={1} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right distribution/metrics */}
        <div className="dash-chart-card w-[30%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="dash-chart-title text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">Active Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} width={50} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '6px', border: 'none', fontSize: '9px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            <div className="dash-status-box bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
              <Activity size={12} className="text-[#004d40]" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="dash-status-label text-[8px] font-black text-gray-500 uppercase">System Status</span>
                  <span className="dash-status-value text-[8px] font-bold text-emerald-600">Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full w-[94%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer Utility */}
      <div className="dash-footer bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center justify-between flex-shrink-0 text-[10px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-500 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Updates Enabled
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 font-bold">Server Location: <span className="text-[#004d40]">Regional West</span></span>
        </div>
        <div className="dash-footer-brand flex items-center gap-2 text-[#004d40] font-black uppercase tracking-tighter italic">
          <Database size={10} /> Data Integrity Verified 100%
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
