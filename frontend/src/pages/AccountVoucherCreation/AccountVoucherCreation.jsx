import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Printer, ArrowLeft, Edit3, Trash2, Calendar } from 'lucide-react';
import './AccountVoucherCreation.css';
import PrintModal from '../../components/PrintModal/PrintModal';

const AccountVoucherCreation = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('today');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setSelectedIndex(0);
    };

    const handleDateFilterChange = (value) => {
        setDateFilter(value);
        setSelectedIndex(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(filteredVouchers.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
    };

    // Mock data for the table
    const [vouchers, setVouchers] = useState([
        { id: 1, billNo: 'VOU-001', billDate: '2024-03-20', partyName: 'Sample Party A', contract: 'C-101', gp: 'GP-01', zone: 'Zone-1', dept: 'Sales', message: 'First installment First installment First installment First installment First installment First installment', amount: 5000, status: 'Pending' },
        { id: 2, billNo: 'VOU-002', billDate: '2024-03-21', partyName: 'Sample Party B', contract: 'C-102', gp: 'GP-02', zone: 'Zone-2', dept: 'Ops', message: 'Material supply', amount: 12500, status: 'Approved' },
        { id: 3, billNo: 'VOU-003', billDate: '2024-03-21', partyName: 'Sample Party C', contract: 'C-103', gp: 'GP-03', zone: 'Zone-3', dept: 'Finance', message: 'Service fee', amount: 3200, status: 'Rejected' },
    ]);

    const handleDelete = (voucher) => {
        if (window.confirm(`Are you sure you want to delete "${voucher.billNo}"?`)) {
            setVouchers(prev => prev.filter(v => v.id !== voucher.id));
        }
    };

    const filteredVouchers = vouchers.filter(v =>
        v.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.billNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenPrintModal = () => {
        setIsPrintModalOpen(true);
    };

    const handleClosePrintModal = () => {
        setIsPrintModalOpen(false);
    };

    const handlePrint = (options) => {
        console.log('Printing with options:', options);
    };


    return (
        <div className="av-page h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <div className="av-card w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="av-header bg-[#004d40] px-6 py-3 text-white flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                ref={searchInputRef}
                                placeholder="Fast search here..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="av-search-input w-full pl-10 pr-4 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none transition-all placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-1 transition-all">
                            <Calendar size={16} className="text-white/80" />
                            <select
                                value={dateFilter}
                                onChange={(e) => handleDateFilterChange(e.target.value)}
                                className="av-filter-select bg-transparent text-sm font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none pr-1"
                            >
                                <option value="today" className="text-gray-900 bg-white">Today</option>
                                <option value="yesterday" className="text-gray-900 bg-white">Yesterday</option>
                                <option value="7days" className="text-gray-900 bg-white">7 Days</option>
                                <option value="14days" className="text-gray-900 bg-white">14 Days</option>
                                <option value="weekly" className="text-gray-900 bg-white">Weekly</option>
                                <option value="quarterly" className="text-gray-900 bg-white">Quarterly</option>
                                <option value="yearly" className="text-gray-900 bg-white">Yearly</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto p-2">
                    <div className="bg-white border border-gray-300 rounded overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#004d40] text-white">
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Bill No</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Bill Date</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Party Name</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Contract</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">GP</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Zone</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Dept</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Message</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Amount</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Status</th>
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredVouchers.map((voucher, index) => (
                                    <tr
                                        key={voucher.id}
                                        className={`transition-colors text-[11px] ${index === selectedIndex
                                            ? 'av-selected-row'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className="av-td px-3 py-2 border border-gray-200 font-bold whitespace-nowrap">{voucher.billNo}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.billDate}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 font-bold text-[#004d40] max-w-[150px] truncate" title={voucher.partyName}>{voucher.partyName}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.contract}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.gp}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.zone}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.dept}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 text-gray-500 italic max-w-[200px] truncate" title={voucher.message}>{voucher.message}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200 font-black whitespace-nowrap">₹{voucher.amount.toLocaleString('en-IN')}</td>
                                        <td className="av-td px-3 py-2 border border-gray-200">
                                            <span className={`av-status-badge px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${voucher.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                voucher.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {voucher.status}
                                            </span>
                                        </td>
                                        <td className="av-td px-3 py-2 border border-gray-200 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => navigate(`/account/edit/${voucher.id}`, { state: { voucher } })} className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-100 transition-colors" title="Edit">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(voucher)} className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="av-footer bg-[#f0f4f4] border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="av-btn bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="av-btn-text font-black uppercase tracking-widest">Back</span>
                    </button>
                    <button
                        onClick={handleOpenPrintModal}
                        disabled={filteredVouchers.length === 0}
                        className="av-btn bg-[#004d40] hover:bg-[#00332e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        <Printer size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="av-btn-text font-black uppercase tracking-widest">Print</span>
                    </button>
                    <button
                        onClick={() => navigate('/account/create')}
                        className="av-btn bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="av-btn-text font-black uppercase tracking-widest">Create</span>
                    </button>
                </div>
            </div>

            {/* Print Modal */}
            <PrintModal
                isOpen={isPrintModalOpen}
                onClose={handleClosePrintModal}
                voucherData={filteredVouchers}
                onPrint={handlePrint}
            />
        </div>
    );
};

export default AccountVoucherCreation;
