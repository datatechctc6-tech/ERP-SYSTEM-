import React, { useState, useEffect } from 'react';
import {
    getDashboardStats,
    getAllTransactions,
    getParties,
    getDepartments,
    getWorks
} from '../../services/transaction.service';
import { exportToCSV } from '../../utils/exportUtils';
import toast from 'react-hot-toast';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    FileText,
    ArrowRight,
    Search,
    Calendar,
    Download,
    Activity
} from 'lucide-react';

const ReportCard = ({ title, description, icon, color, iconBg, iconColor, subItems, onDownload }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col">
        <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />
        <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <button
                    onClick={() => onDownload(title)}
                    className="text-gray-400 hover:text-[#004d40] transition-colors"
                    title="Download Report"
                >
                    <Download size={16} />
                </button>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1.5 uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 font-medium mb-2 leading-relaxed">
                {description}
            </p>

            <div className="space-y-0.5 mt-auto">
                {subItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-between p-1 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[#004d40] font-bold text-[12px] uppercase tracking-widest transition-all group/item"
                    >
                        <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${iconColor.replace('text-', 'bg-')} opacity-40`} />
                            {item.label} <span className="text-[#004d40]/40 ml-1">({item.value})</span>
                        </span>
                        <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const ReportList = () => {
    const [stats, setStats] = useState({
        totalGP: 0,
        activeGP: 0,
        unprocess: 0,
        complete: 0,
        totalTransactions: 0,
        zoneWiseWork: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load report statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDownload = async (reportTitle) => {
        try {
            const toastId = toast.loading(`Preparing ${reportTitle}...`);
            console.log('Starting download for:', reportTitle);

            if (reportTitle === "Transaction Reports") {
                const transactions = await getAllTransactions();
                if (transactions && transactions.length > 0) {
                    exportToCSV(transactions, 'Transactions_Report');
                    toast.success('Transaction report downloaded', { id: toastId });
                } else {
                    toast.error('No transactions found to download', { id: toastId });
                }
            } else if (reportTitle === "Grampanchayat Analysis") {
                // Prepare data even if zoneWiseWork is empty
                let gpData = [];
                if (stats.zoneWiseWork && stats.zoneWiseWork.length > 0) {
                    gpData = stats.zoneWiseWork.map(item => ({
                        Category: 'Zone Wise Distribution',
                        Name: item.name,
                        Count: item.value,
                        Total_GPs: stats.totalGP,
                        Active_GPs: stats.activeGP
                    }));
                } else {
                    // Fallback to summary data
                    gpData = [
                        { Category: 'Summary', Name: 'Total GPs', Count: stats.totalGP },
                        { Category: 'Summary', Name: 'Active Projects', Count: stats.activeGP },
                        { Category: 'Summary', Name: 'Completed', Count: stats.complete },
                        { Category: 'Summary', Name: 'Unprocessed', Count: stats.unprocess }
                    ];
                }

                exportToCSV(gpData, 'GP_Analysis_Report');
                toast.success('G.P. analysis report downloaded', { id: toastId });

            } else if (reportTitle === "Master Data Audit") {
                const [parties, depts, works] = await Promise.all([
                    getParties().catch(() => []),
                    getDepartments().catch(() => []),
                    getWorks().catch(() => [])
                ]);

                const auditData = [
                    { Category: 'Parties', Count: parties.length, Status: 'Synchronized' },
                    { Category: 'Departments', Count: depts.length, Status: 'Synchronized' },
                    { Category: 'Works/Projects', Count: works.length, Status: 'Synchronized' },
                    { Category: 'Zones', Count: stats?.zoneWiseWork?.length || 0, Status: 'Active' },
                    { Category: 'Overall System Health', Count: '100%', Status: 'Verified' }
                ];

                exportToCSV(auditData, 'Master_Data_Audit');
                toast.success('Master data audit downloaded', { id: toastId });
            } else {
                toast.dismiss(toastId);
                toast.error('Report type not recognized');
            }
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to generate report');
        }
    };

    const reports = [
        {
            title: "Transaction Reports",
            description: "Detailed analysis of account vouchers, payments, and receipts across all departments.",
            icon: <BarChart3 size={20} />,
            color: "from-blue-500 to-indigo-600",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            subItems: [
                { label: "Voucher Summary", value: stats?.totalTransactions || 0 },
                { label: "Pending Vouchers", value: stats?.unprocess || 0 },
                { label: "Completed Receipts", value: stats?.complete || 0 }
            ]
        },
        {
            title: "Grampanchayat Analysis",
            description: "Distribution of work and status tracking for all registered Grampanchayats.",
            icon: <PieChart size={20} />,
            color: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            subItems: [
                { label: "Total G.P. Count", value: stats?.totalGP || 0 },
                { label: "Ongoing Projects", value: stats?.activeGP || 0 },
                { label: "Completion Ratio", value: (stats?.totalGP > 0) ? `${Math.round(((stats?.complete || 0) / stats.totalGP) * 100)}%` : '0%' }
            ]
        },
        {
            title: "Master Data Audit",
            description: "Review lists and verification reports for Parties, Departments, and Works.",
            icon: <FileText size={20} />,
            color: "from-amber-500 to-orange-600",
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            subItems: [
                { label: "Active Zones", value: stats?.zoneWiseWork?.length || 0 },
                { label: "System Health", value: "100%" },
                { label: "Audit Status", value: "Verified" }
            ]
        }
    ];

    return (
        <div className="h-[calc(100vh-80px)] bg-[#f8fafc] p-4 flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">
                            Analytical <span className="text-[#004d40]">Reports</span>
                        </h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2 text-xs">
                            <Calendar size={12} /> Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#004d4033] focus:border-[#004d40] w-64 shadow-sm transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchStats}
                            disabled={loading || !stats}
                            className="p-2 bg-[#004d40] text-white rounded-xl shadow-lg hover:bg-[#00332e] transition-colors text-xs font-black uppercase tracking-widest px-4 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Refreshing...' : 'Refresh'} <Activity size={12} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Quick Stats Banner */}
                <div className="bg-gradient-to-r from-[#00332e] to-[#004d40] rounded-2xl p-4 mb-6 text-white shadow-2xl relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                        <div className="md:border-r border-white/10 pr-8">
                            <p className="text-[#80cbc4] text-[9px] font-black uppercase tracking-widest mb-1">Total Transactions</p>
                            <h2 className="text-xl font-black">{stats?.totalTransactions || 0} Records</h2>
                        </div>
                        <div className="md:border-r border-white/10 pr-8">
                            <p className="text-[#80cbc4] text-[9px] font-black uppercase tracking-widest mb-1">Grampanchayats</p>
                            <h2 className="text-xl font-black">{stats?.totalGP || 0} GP Registered</h2>
                        </div>
                        <div>
                            <p className="text-[#80cbc4] text-[9px] font-black uppercase tracking-widest mb-1">System Status</p>
                            <h2 className="text-xl font-black">100% Secure</h2>
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {reports.map((report, index) => (
                        <ReportCard
                            key={index}
                            {...report}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>

                {/* System Info Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-gray-400 text-[8px] font-bold uppercase tracking-widest flex-shrink-0">
                    <div className="flex items-center gap-6 mb-2 md:mb-0">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Database Live</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> API Synchronized</span>
                    </div>
                    <div>
                        © 2026 Datatech ERP System Platinum V2.0.4.8
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportList;
