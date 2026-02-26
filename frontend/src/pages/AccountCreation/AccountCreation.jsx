import React, { useState } from 'react';
import { Save, Edit3, XCircle, ArrowLeft, Trash2 } from 'lucide-react';
import './AccountCreation.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AccountCreation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEditMode = !!id;
    const editVoucher = location.state?.voucher;
    const [message, setMessage] = useState(editVoucher?.message || '');
    const [accounts, setAccounts] = useState(() => {
        const rows = [...Array(20)].map((_, i) => ({
            id: i + 1,
            partyName: '',
            department: '',
            amount: '',
            status: ''
        }));
        if (editVoucher) {
            rows[0] = {
                id: 1,
                partyName: editVoucher.partyName || '',
                department: editVoucher.dept || '',
                amount: editVoucher.amount ? String(editVoucher.amount) : '',
                status: editVoucher.status || ''
            };
        }
        return rows;
    });

    const handleInputChange = (index, field, value) => {
        const newAccounts = [...accounts];
        newAccounts[index][field] = value;
        setAccounts(newAccounts);
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        let targetRow = rowIndex;
        let targetCol = colIndex;

        if (e.key === 'ArrowUp') {
            targetRow = Math.max(0, rowIndex - 1);
        } else if (e.key === 'ArrowDown') {
            targetRow = Math.min(accounts.length - 1, rowIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            targetCol = Math.max(0, colIndex - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (colIndex < 3) {
                targetCol = colIndex + 1;
            } else {
                targetRow = Math.min(accounts.length - 1, rowIndex + 1);
                targetCol = 0;
            }
        } else {
            return;
        }

        if (targetRow !== rowIndex || targetCol !== colIndex) {
            e.preventDefault();
            const nextInput = document.querySelector(`input[data-row="${targetRow}"][data-col="${targetCol}"]`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const totalRecords = accounts.filter(acc =>
        acc.partyName.trim() !== '' ||
        acc.department.trim() !== '' ||
        acc.amount.trim() !== ''
    ).length;

    const netAmount = accounts.reduce((sum, acc) => {
        const val = parseFloat(acc.amount.replace(/,/g, ''));
        return isNaN(val) ? sum : sum + val;
    }, 0);

    return (
        <div className="ac-page h-full w-full bg-[#f0f4f4] flex p-0 overflow-hidden items-center justify-center">
            <div className="ac-card w-full max-w-7xl h-[550px] bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse flex-1 flex flex-col overflow-hidden">
                    <thead className="bg-[#004d40] text-white flex-none">
                        <tr className="flex w-full">
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-r border-[#00332e] flex-1">Party Name</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-r border-[#00332e] flex-1">Department</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-r border-[#00332e] flex-1 text-right">Amount</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-[#00332e] w-32">Status</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-l border-[#00332e] w-24 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 flex-1 overflow-y-auto custom-scrollbar">
                        {accounts.map((account, index) => (
                            <tr key={account.id} className="flex w-full items-center hover:bg-gray-50/50 transition-colors">
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={0}
                                        value={account.partyName}
                                        onChange={(e) => handleInputChange(index, 'partyName', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 0)}
                                        className="ac-input w-full h-full px-3 font-bold text-[#004d40] bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Enter party name..." : ""}
                                        autoFocus={index === 0}
                                    />
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={1}
                                        value={account.department}
                                        onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 1)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Enter dept..." : ""}
                                    />
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={2}
                                        value={account.amount}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                        className="ac-input w-full h-full px-3 text-right font-black bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "0.00" : ""}
                                    />
                                </td>
                                <td className="border-gray-200 w-32">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={3}
                                        value={account.status}
                                        onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 3)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1] uppercase font-bold text-gray-600"
                                        placeholder={index === 0 ? "Status" : ""}
                                    />
                                </td>
                                <td className="border-l border-gray-200 w-24 flex items-center justify-center bg-white z-10">
                                    {totalRecords > 1 && (account.partyName.trim() || account.department.trim() || account.amount.trim()) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newAccounts = [...accounts];
                                                newAccounts[index] = { id: account.id, partyName: '', department: '', amount: '', status: '' };
                                                setAccounts(newAccounts);
                                            }}
                                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-100 border-t-2 border-[#004d40] flex-none">
                        <tr className="flex w-full items-center justify-between">
                            <td className="px-4 py-3 flex items-center gap-3">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your message here..."
                                    rows={3}
                                    className="ac-textarea w-96 bg-white border border-gray-300 px-4 py-2 rounded text-[12px] font-bold text-gray-700 focus:outline-none focus:border-[#004d40] focus:bg-[#fdd55ce1] transition-colors shadow-sm resize-none"
                                />
                            </td>
                            <td className="px-4 py-3 text-[13px] font-black text-[#004d40] uppercase tracking-widest flex items-center gap-4">
                                <span className="opacity-70 text-[11px]">Net Amount:</span>
                                <input
                                    type="text"
                                    readOnly
                                    value={`₹${netAmount.toLocaleString('en-IN')}`}
                                    className="ac-amount-box text-[18px] bg-transparent text-[#004d40] w-48 py-1 rounded shadow-sm text-center border-2 border-[#004d40] focus:outline-none font-black cursor-default"
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer Buttons */}
                <div className="bg-[#f0f4f4] border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        className="ac-btn bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        <Save size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="ac-btn-text text-[12px] font-black uppercase tracking-widest">{isEditMode ? 'Update' : 'Save'}</span>
                    </button>
                    <button className="ac-btn bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group">
                        <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
                        <span className="ac-btn-text text-[12px] font-black uppercase tracking-widest">Edit</span>
                    </button>
                    <button
                        onClick={() => navigate('/account-voucher-creation')}
                        className="ac-btn bg-[#004d40] hover:bg-red-600 text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        <XCircle size={16} className="group-hover:rotate-90 transition-transform" />
                        <span className="ac-btn-text text-[12px] font-black uppercase tracking-widest">Close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountCreation;
