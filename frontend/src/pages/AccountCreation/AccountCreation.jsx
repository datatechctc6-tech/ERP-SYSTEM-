import React, { useState, useEffect } from 'react';
import { Save, Edit3, XCircle, ArrowLeft, Trash2 } from 'lucide-react';
import './AccountCreation.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createTransaction, updateTransaction, searchGps, getGpById, getDepartments, getWorks, getParties } from '../../services/transaction.service';

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
    const [workList, setWorkList] = useState([]);
    const [allParties, setAllParties] = useState([]);
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [activeDeptRowIndex, setActiveDeptRowIndex] = useState(null);
    const [activeWorkRowIndex, setActiveWorkRowIndex] = useState(null);
    const [activeStatusRowIndex, setActiveStatusRowIndex] = useState(null);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
    const statusOptions = ['Pending', 'Ongoing', 'Not Started', 'Completed'];

    const getStatusTextColorClass = (status) => {
        const base = status?.trim().toLowerCase();
        switch (base) {
            case 'pending':
                return 'text-yellow-600';
            case 'ongoing':
                return 'text-blue-600';
            case 'not started':
                return 'text-gray-500';
            case 'completed':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

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
        const fetchWorks = async () => {
            try {
                const fetchedWorks = await getWorks();
                setWorkList(fetchedWorks);
            } catch (error) {
                console.error('Failed to fetch works:', error);
            }
        };
        const fetchPartiesList = async () => {
            try {
                const fetchedParties = await getParties();
                setAllParties(fetchedParties);
                if (!isEditMode) {
                    setSuggestions(fetchedParties);
                    setActiveRowIndex(0);
                }
            } catch (error) {
                console.error('Failed to fetch parties:', error);
            }
        };
        fetchDepts();
        fetchWorks();
        fetchPartiesList();
    }, []);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [accounts, message]); // Re-bind when data changes so handleSave has latest state

    const handlePartyChange = async (index, value) => {
        const newAccounts = [...accounts];
        newAccounts[index].partyName = value;
        newAccounts[index].gp_id = null;
        setAccounts(newAccounts);
        setFocusedSuggestionIndex(-1);

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
            setSuggestions(allParties);
            setActiveRowIndex(index);
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
            setFocusedSuggestionIndex(-1);
        } catch (error) {
            console.error('Failed to fetch full GP details:', error);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newAccounts = [...accounts];
        setFocusedSuggestionIndex(-1);
        if (field === 'department') {
            newAccounts[index].department = value;
            const selectedDept = departmentList.find(d => String(d.DEPT_NAME).toLowerCase() === String(value).toLowerCase());
            if (selectedDept) {
                newAccounts[index].dept_code = selectedDept.DEPT_CODE;
            } else {
                newAccounts[index].dept_code = null;
            }
        } else if (field === 'work') {
            newAccounts[index].work = value;
            const selectedWork = workList.find(w => String(w.WORK_NAME).toLowerCase() === String(value).toLowerCase());
            if (selectedWork) {
                newAccounts[index].work_code = selectedWork.WORK_CODE
                    ? parseInt(String(selectedWork.WORK_CODE).replace('WRK', ''), 10)
                    : null;
            } else {
                newAccounts[index].work_code = null;
            }
        } else {
            newAccounts[index][field] = value;
        }
        setAccounts(newAccounts);
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        let isDropdownOpen = false;
        let currentOptions = [];
        let handleSelect = null;

        if (colIndex === 0 && activeRowIndex === rowIndex && suggestions.length > 0) {
            isDropdownOpen = true;
            currentOptions = suggestions;
            handleSelect = (gp) => handleSelectSuggestion(rowIndex, gp);
        } else if (colIndex === 1 && activeDeptRowIndex === rowIndex) {
            currentOptions = departmentList.filter(dept => dept.DEPT_NAME.toLowerCase().includes((accounts[rowIndex].department || '').toLowerCase()));
            isDropdownOpen = currentOptions.length > 0;
            handleSelect = (dept) => {
                handleInputChange(rowIndex, 'department', dept.DEPT_NAME);
                setActiveDeptRowIndex(null);
                setFocusedSuggestionIndex(-1);
            };
        } else if (colIndex === 2 && activeWorkRowIndex === rowIndex) {
            currentOptions = workList.filter(work => (work.WORK_NAME || '').toLowerCase().includes((accounts[rowIndex].work || '').toLowerCase()));
            isDropdownOpen = currentOptions.length > 0;
            handleSelect = (work) => {
                handleInputChange(rowIndex, 'work', work.WORK_NAME);
                setActiveWorkRowIndex(null);
                setFocusedSuggestionIndex(-1);
            };
        } else if (colIndex === 4 && activeStatusRowIndex === rowIndex) {
            currentOptions = statusOptions.filter(opt => opt.toLowerCase().includes((accounts[rowIndex].status || '').toLowerCase()));
            isDropdownOpen = currentOptions.length > 0;
            handleSelect = (opt) => {
                handleInputChange(rowIndex, 'status', opt);
                setActiveStatusRowIndex(null);
                setFocusedSuggestionIndex(-1);
            };
        }

        if (isDropdownOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedSuggestionIndex(prev => Math.min(prev + 1, currentOptions.length - 1));
                return;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedSuggestionIndex(prev => Math.max(0, prev - 1));
                return;
            } else if (e.key === 'Enter') {
                if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < currentOptions.length) {
                    e.preventDefault();
                    handleSelect(currentOptions[focusedSuggestionIndex]);
                    setFocusedSuggestionIndex(-1);
                    return;
                }
            }
        }

        let targetRow = rowIndex;
        let targetCol = colIndex;

        if (e.key === 'ArrowUp') {
            targetRow = Math.max(0, rowIndex - 1);
        } else if (e.key === 'ArrowDown') {
            targetRow = Math.min(accounts.length - 1, rowIndex + 1);
        } else if (e.key === 'Enter') {
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
                    amount: mainRow.amount.replace(/,/g, '') || "0",
                    status: mainRow.status || 'Pending',
                    message: message
                });
            } else {
                for (const row of validRows) {
                    await createTransaction({
                        gp_id: row.gp_id,
                        dept_code: row.dept_code,
                        work_code: row.work_code,
                        amount: row.amount.replace(/,/g, '') || "0",
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
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-[#00332e] w-32 flex-shrink-0">Status</th>
                            <th className="ac-th px-3 py-3 font-black uppercase tracking-widest border-l border-[#00332e] w-28 flex-shrink-0 text-center">Action</th>
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
                                        onFocus={() => {
                                            setActiveRowIndex(index);
                                            if (account.partyName.trim() === '') {
                                                setSuggestions(allParties);
                                            }
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, index, 0)}
                                        onBlur={() => setTimeout(() => { setActiveRowIndex(null); setFocusedSuggestionIndex(-1); }, 200)}
                                        className="ac-input w-full h-full px-3 font-bold text-[#004d40] bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Search existing GP..." : ""}
                                        autoFocus={index === 0}
                                    />
                                    {activeRowIndex === index && suggestions.length > 0 && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded max-h-48 overflow-y-auto animate-dropdown">
                                            {suggestions.map((gp, idx) => (
                                                <div
                                                    key={gp.id}
                                                    onClick={() => handleSelectSuggestion(index, gp)}
                                                    className={`px-3 py-2 cursor-pointer text-[#004d40] font-bold text-[12px] border-b border-gray-100 last:border-b-0 ${focusedSuggestionIndex === idx ? 'bg-[#fdd55ce1]' : 'hover:bg-[#fdd55ce1]'}`}
                                                >
                                                    {gp.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="border-r border-gray-200 flex-1 relative">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={1}
                                        value={account.department}
                                        onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                                        onFocus={() => { setActiveDeptRowIndex(index); setFocusedSuggestionIndex(-1); }}
                                        onBlur={() => setTimeout(() => { setActiveDeptRowIndex(null); setFocusedSuggestionIndex(-1); }, 200)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 1)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Enter dept..." : ""}
                                    />
                                    {activeDeptRowIndex === index && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded max-h-48 overflow-y-auto animate-dropdown">
                                            {departmentList.filter(dept => dept.DEPT_NAME.toLowerCase().includes((account.department || '').toLowerCase())).map((dept, idx) => (
                                                <div
                                                    key={dept.SL_NO}
                                                    onClick={() => {
                                                        handleInputChange(index, 'department', dept.DEPT_NAME);
                                                        setActiveDeptRowIndex(null);
                                                        setFocusedSuggestionIndex(-1);
                                                    }}
                                                    className={`px-3 py-2 cursor-pointer text-gray-800 font-bold text-[12px] border-b border-gray-100 last:border-b-0 uppercase ${focusedSuggestionIndex === idx ? 'bg-[#fdd55ce1]' : 'hover:bg-[#fdd55ce1]'}`}
                                                >
                                                    {dept.DEPT_NAME}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="border-r border-gray-200 flex-1 relative">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={2}
                                        value={account.work}
                                        onChange={(e) => handleInputChange(index, 'work', e.target.value)}
                                        onFocus={() => { setActiveWorkRowIndex(index); setFocusedSuggestionIndex(-1); }}
                                        onBlur={() => setTimeout(() => { setActiveWorkRowIndex(null); setFocusedSuggestionIndex(-1); }, 200)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                        className="ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "Enter work..." : ""}
                                    />
                                    {activeWorkRowIndex === index && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded max-h-48 overflow-y-auto animate-dropdown">
                                            {workList.filter(work => (work.WORK_NAME || '').toLowerCase().includes((account.work || '').toLowerCase())).map((work, idx) => (
                                                <div
                                                    key={work.SL_NO || work.ID || idx}
                                                    onClick={() => {
                                                        handleInputChange(index, 'work', work.WORK_NAME);
                                                        setActiveWorkRowIndex(null);
                                                        setFocusedSuggestionIndex(-1);
                                                    }}
                                                    className={`px-3 py-2 cursor-pointer text-gray-800 font-bold text-[12px] border-b border-gray-100 last:border-b-0 uppercase ${focusedSuggestionIndex === idx ? 'bg-[#fdd55ce1]' : 'hover:bg-[#fdd55ce1]'}`}
                                                >
                                                    {work.WORK_NAME}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="border-r border-gray-200 flex-1">
                                    <input
                                        type="text"
                                        maxLength={15}
                                        data-row={index}
                                        data-col={3}
                                        value={account.amount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[0-9.,]*$/.test(val)) {
                                                handleInputChange(index, 'amount', val);
                                            }
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, index, 3)}
                                        className="ac-input w-full h-full px-3 text-right font-black bg-transparent focus:outline-none focus:bg-[#fdd55ce1]"
                                        placeholder={index === 0 ? "0.00" : ""}
                                    />
                                </td>
                                <td className="border-gray-200 w-32 flex-shrink-0 relative">
                                    <input
                                        type="text"
                                        data-row={index}
                                        data-col={4}
                                        value={account.status}
                                        onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                        onFocus={() => { setActiveStatusRowIndex(index); setFocusedSuggestionIndex(-1); }}
                                        onBlur={() => setTimeout(() => { setActiveStatusRowIndex(null); setFocusedSuggestionIndex(-1); }, 200)}
                                        onKeyDown={(e) => handleKeyDown(e, index, 4)}
                                        className={`ac-input w-full h-full px-3 bg-transparent focus:outline-none focus:bg-[#fdd55ce1] uppercase font-bold transition-colors ${getStatusTextColorClass(account.status)}`}
                                        placeholder={index === 0 ? "Status" : ""}
                                    />
                                    {activeStatusRowIndex === index && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded max-h-48 overflow-y-auto animate-dropdown">
                                            {statusOptions.filter(opt => opt.toLowerCase().includes((account.status || '').toLowerCase())).map((opt, idx) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => {
                                                        handleInputChange(index, 'status', opt);
                                                        setActiveStatusRowIndex(null);
                                                        setFocusedSuggestionIndex(-1);
                                                    }}
                                                    className={`px-3 py-2 cursor-pointer font-bold text-[11px] border-b border-gray-100 last:border-b-0 uppercase transition-colors ${focusedSuggestionIndex === idx ? 'bg-[#fdd55ce1]' : 'hover:bg-[#fdd55ce1]'} ${getStatusTextColorClass(opt)}`}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="border-l border-gray-200 w-28 flex-shrink-0 flex items-center justify-center bg-white z-10">
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
                    <button
                        onClick={() => navigate('/account-voucher-creation')}
                        className="ac-btn bg-[#004d40] hover:bg-red-600 text-white rounded flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                        <XCircle size={16} className="group-hover:rotate-90 transition-transform" />
                        <span className="ac-btn-text text-[12px] font-black uppercase tracking-widest">Close</span>
                    </button>
                </div>
            </div>

            <style>
                {`
                @keyframes dropdownEntry {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px) scaleY(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scaleY(1);
                    }
                }
                .animate-dropdown {
                    animation: dropdownEntry 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    transform-origin: top;
                }
                `}
            </style>
        </div>
    );
};

export default AccountCreation;
