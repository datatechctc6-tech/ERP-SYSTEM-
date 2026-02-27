import React, { useState, useEffect } from 'react';
import { Save, Edit3, XCircle, ArrowLeft, Trash2 } from 'lucide-react';
import './AccountCreation.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createTransaction, updateTransaction, searchGps, getGpById, getDepartments } from '../../services/transaction.service';

const AccountCreation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEditMode = !!id;
    const editVoucher = location.state?.voucher;
    const [message, setMessage] = useState(editVoucher?.message || '');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [accounts, setAccounts] = useState(() => {
        const rows = [...Array(20)].map((_, i) => ({
            id: i + 1,
            partyName: '',
            gp_id: null,
            work_code: null,
            dept_code: null,
            department: '',
            work: '',
            amount: '',
            status: ''
        }));
        if (editVoucher) {
            rows[0] = {
                id: editVoucher.id || 1,
                partyName: editVoucher.partyName || '',
                gp_id: editVoucher.gp_id || editVoucher.HOLD_CODE || null,
                work_code: editVoucher.WORK_CODE || null,
                dept_code: editVoucher.dept_code || null,
                department: editVoucher.dept || '',
                work: editVoucher.work || '',
                amount: editVoucher.amount ? String(editVoucher.amount) : '',
                status: editVoucher.status || 'Pending'
            };
        }
        return rows;
    });

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const fetchedDepts = await getDepartments();
                setDepartmentList(fetchedDepts);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };
        fetchDepts();
    }, []);

    const handlePartyChange = async (index, value) => {
        const newAccounts = [...accounts];
        newAccounts[index].partyName = value;
        newAccounts[index].gp_id = null;
        setAccounts(newAccounts);

        if (value.trim().length > 0) {
            try {
                const results = await searchGps(value);
                setSuggestions(results);
                setActiveRowIndex(index);
            } catch (error) {
                console.error('Failed to search GPs:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setActiveRowIndex(null);
        }
    };

    const handleSelectSuggestion = async (rowIndex, gp) => {
        try {
            const data = await getGpById(gp.id);
            const newAccounts = [...accounts];
            newAccounts[rowIndex].partyName = data.name;
            newAccounts[rowIndex].gp_id = data.hold_code;
            newAccounts[rowIndex].work_code = data.work_code || null;
            newAccounts[rowIndex].dept_code = data.dept_code || null;
            if (data.department_name) {
                newAccounts[rowIndex].department = data.department_name;
            }
            setAccounts(newAccounts);
            setSuggestions([]);
            setActiveRowIndex(null);
        } catch (error) {
            console.error('Failed to fetch full GP details:', error);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newAccounts = [...accounts];
        if (field === 'department') {
            const selectedDept = departmentList.find(d => String(d.DEPT_CODE) === value);
            if (selectedDept) {
                newAccounts[index].dept_code = selectedDept.DEPT_CODE;
                newAccounts[index].department = selectedDept.DEPT_NAME;
            } else {
                newAccounts[index].dept_code = null;
                newAccounts[index].department = '';
            }
        } else {
            newAccounts[index][field] = value;
        }
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
            if (colIndex < 4) {
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

    const handleSave = async () => {
        const validRows = accounts.filter(acc =>
            acc.department.trim() !== '' ||
            acc.amount.trim() !== ''
        );

        if (validRows.length === 0) {
            alert('Please enter at least one transaction row with a department or amount.');
            return;
        }

        // Validate strictly for existing GP and dept_code
        for (const row of validRows) {
            if (!row.gp_id) {
                alert(`Select from existing GP only for: ${row.partyName || 'empty party'}`);
                return;
            }
            if (!row.dept_code) {
                alert(`Department code is missing for: ${row.partyName}. Cannot create a new department from transaction.`);
                return;
            }
        }

        setLoading(true);
        try {
            if (isEditMode) {
                const mainRow = validRows[0];
                await updateTransaction(id, {
                    gp_id: mainRow.gp_id,
                    dept_code: mainRow.dept_code,
                    work_code: mainRow.work_code,
                    amount: parseFloat(mainRow.amount.replace(/,/g, '')) || 0,
                    status: mainRow.status || 'Pending',
                    message: message
                });
            } else {
                for (const row of validRows) {
                    await createTransaction({
                        gp_id: row.gp_id,
                        dept_code: row.dept_code,
                        work_code: row.work_code,
                        amount: parseFloat(row.amount.replace(/,/g, '')) || 0,
                        status: row.status || 'Pending',
                        message: message
                    });
                }
            }
            navigate('/account-voucher-creation');
        } catch (error) {
            console.error('Error saving transactions:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalRecords = accounts.filter(acc =>
        acc.partyName.trim() !== '' ||
        acc.department.trim() !== '' ||
        acc.work.trim() !== '' ||
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
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-r border-[#00332e] flex-1">Work</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-r border-[#00332e] flex-1 text-right">Amount</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-[#00332e] w-32">Status</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-l border-[#00332e] w-24 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 flex-1 overflow-y-auto custom-scrollbar">
                        {accounts.map((account, index) => (
                            <tr key={account.id} className="flex w-full items-center hover:bg-gray-50/50 transition-colors">
                                <td className="border-r border-gray-200 flex-1 relative">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={0}
                                        value={account.partyName}
                                        onChange={(e) => handlePartyChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 0)}
                                        onBlur={() => setTimeout(() => setActiveRowIndex(null), 200)}
                                        className="ac-input w-full h-full px-3 font-bold text-[#004d40] bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Search existing GP..." : ""}
                                        autoFocus={index === 0}
                                    />
                                    {activeRowIndex === index && suggestions.length > 0 && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded max-h-48 overflow-y-auto">
                                            {suggestions.map((gp) => (
                                                <div
                                                    key={gp.id}
                                                    onClick={() => handleSelectSuggestion(index, gp)}
                                                    className="px-3 py-2 hover:bg-[#fdd55ce1] cursor-pointer text-[#004d40] font-bold text-[12px] border-b border-gray-100 last:border-b-0"
                                                >
                                                    {gp.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <select
                                        data-row={index}
                                        data-col={1}
                                        value={account.dept_code || ''}
                                        onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 1)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                    >
                                        <option value="" disabled className="text-gray-400">
                                            {index === 0 ? "Select dept..." : ""}
                                        </option>
                                        {departmentList.map(dept => (
                                            <option key={dept.SL_NO} value={dept.DEPT_CODE}>
                                                {dept.DEPT_NAME}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={2}
                                        value={account.work}
                                        onChange={(e) => handleInputChange(index, 'work', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Enter work..." : ""}
                                    />
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={3}
                                        value={account.amount}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 3)}
                                        className="ac-input w-full h-full px-3 text-right font-black bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "0.00" : ""}
                                    />
                                </td>
                                <td className="border-gray-200 w-32">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={4}
                                        value={account.status}
                                        onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 4)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1] uppercase font-bold text-gray-600"
                                        placeholder={index === 0 ? "Status" : ""}
                                    />
                                </td>
                                <td className="border-l border-gray-200 w-24 flex items-center justify-center bg-white z-10">
                                    {totalRecords > 1 && (account.partyName.trim() || account.department.trim() || account.work.trim() || account.amount.trim()) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newAccounts = [...accounts];
                                                newAccounts[index] = { id: account.id, partyName: '', department: '', work: '', amount: '', status: '' };
                                                setAccounts(newAccounts);
                                            }}
                                            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-all"
                                            title="Clear Row"
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
                        onClick={handleSave}
                        disabled={loading}
                        className="ac-btn bg-[#004d40] hover:bg-[#00332e] disabled:opacity-50 text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={16} className="group-hover:scale-110 transition-transform" />
                        )}
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
