import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Printer, ArrowLeft, Edit3, Trash2, Calendar } from 'lucide-react';
import { getAllTransactions, deleteTransaction } from '../../services/transaction.service';
import './AccountVoucherCreation.css';
import PrintModal from '../../components/PrintModal/PrintModal';

const AccountVoucherCreation = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('today');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const searchInputRef = useRef(null);

    const filterOptions = [
        { value: 'today', label: 'TODAY' },
        { value: 'yesterday', label: 'YESTERDAY' },
        { value: '7days', label: '7 DAYS' },
        { value: '14days', label: '14 DAYS' },
        { value: 'weekly', label: 'WEEKLY' },
        { value: 'quarterly', label: 'QUARTERLY' },
        { value: 'yearly', label: 'YEARLY' },
    ];

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getAllTransactions();
            const mappedData = data.map(item => ({
                id: item.id,
                billNo: `VOU-${String(item.id).padStart(3, '0')}`,
                billDate: item.date ? new Date(item.date).toLocaleDateString('en-CA') : '',
                partyName: item.partyName || 'N/A',
                contract: item.WORK_CODE || '-',
                gp: item.panchayat || '-',
                zone: item.zone || '-',
                dept: item.department || '',
                dept_code: item.dept_code || null,
                message: item.message || '',
                amount: item.amount || 0,
                status: item.status || 'Pending'
            }));
            setVouchers(mappedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

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

    // Data state mapped to backend
    const [vouchers, setVouchers] = useState([]);

    const handleDelete = async (voucher) => {
        if (window.confirm(`Are you sure you want to delete "${voucher.billNo}"?`)) {
            try {
                await deleteTransaction(voucher.id);
                setVouchers(prev => prev.filter(v => v.id !== voucher.id));
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Failed to delete transaction. Please try again.');
            }
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
                                className="av-search-input w-full h-8 pl-10 pr-4 bg-white/10 border border-white/20 rounded text-sm focus:outline-none transition-all placeholder:text-white/40"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 transition-all"
                            >
                                <Calendar size={16} className="text-white/80" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                                    {filterOptions.find(opt => opt.value === dateFilter)?.label || 'TODAY'}
                                </span>
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-2xl z-20 overflow-hidden flex flex-col">
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    handleDateFilterChange(opt.value);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-[#fdd55ce1] hover:text-[#004d40] transition-colors border-b border-gray-100 last:border-none ${dateFilter === opt.value ? 'bg-[#e0f2f1] text-[#004d40]' : 'text-gray-700'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
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
                                    <th className="av-th px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-[#00332e]">Work</th>
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
                                        <td className="av-td px-3 py-2 border border-gray-200 whitespace-nowrap">{voucher.work}</td>
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
