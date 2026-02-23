import React, { useState } from 'react';
import { X, Printer, CheckSquare, Square } from 'lucide-react';

const PrintModal = ({ isOpen, onClose, voucherData, onPrint }) => {
    const columns = [
        { id: 'billNo', label: 'Bill No' },
        { id: 'billDate', label: 'Bill Date' },
        { id: 'partyName', label: 'Party Name' },
        { id: 'contract', label: 'Contract' },
        { id: 'gp', label: 'GP' },
        { id: 'zone', label: 'Zone' },
        { id: 'dept', label: 'Dept' },
        { id: 'message', label: 'Message' },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' }
    ];

    const [selectedColumns, setSelectedColumns] = useState(
        columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
    );

    if (!isOpen) return null;

    const toggleColumn = (id) => {
        setSelectedColumns(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSelectAll = (value) => {
        const newState = columns.reduce((acc, col) => ({ ...acc, [col.id]: value }), {});
        setSelectedColumns(newState);
    };

    const handlePrintClick = () => {
        const activeColumns = columns.filter(col => selectedColumns[col.id]);
        onPrint({ columns: activeColumns, data: voucherData });
        onClose();

        // Simple print implementation
        const printContent = `
            <html>
                <head>
                    <title>Account Vouchers</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 12px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { bg-color: #f4f4f4; }
                    </style>
                </head>
                <body>
                    <h2>Account Voucher List</h2>
                    <table>
                        <thead>
                            <tr>
                                ${activeColumns.map(col => `<th>${col.label}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${voucherData.map(row => `
                                <tr>
                                    ${activeColumns.map(col => `<td>${row[col.id]}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-[#004d40]/20 flex flex-col">
                {/* Header */}
                <div className="bg-[#004d40] px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Printer size={20} className="text-yellow-400" />
                        <div>
                            <h3 className="text-lg font-bold leading-none">Print Options</h3>
                            <p className="text-[10px] text-white/60 mt-1 uppercase tracking-widest font-bold">Select columns to include</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50 flex-1">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Columns</span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleSelectAll(true)}
                                className="text-[10px] font-black uppercase text-[#004d40] hover:underline"
                            >
                                Select All
                            </button>
                            <button
                                onClick={() => handleSelectAll(false)}
                                className="text-[10px] font-black uppercase text-red-600 hover:underline"
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {columns.map(col => (
                            <button
                                key={col.id}
                                onClick={() => toggleColumn(col.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedColumns[col.id]
                                        ? 'bg-white border-[#004d40] shadow-sm text-[#004d40]'
                                        : 'bg-gray-100 border-gray-200 text-gray-400 grayscale'
                                    }`}
                            >
                                {selectedColumns[col.id] ? (
                                    <CheckSquare size={18} className="fill-[#004d40] text-white" />
                                ) : (
                                    <Square size={18} />
                                )}
                                <span className="text-sm font-bold">{col.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePrintClick}
                        className="px-8 py-2.5 bg-[#004d40] hover:bg-[#00332e] text-white rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Printer size={18} />
                        <span className="text-sm font-black uppercase tracking-widest">Generate Print</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintModal;
