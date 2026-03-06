/**
 * Exports data to a CSV file and triggers a browser download.
 * @param {Array<Object>} data - The array of objects to export.
 * @param {string} fileName - The name of the file to download (without .csv).
 * @param {Array<string>} [headers] - Optional array of header names. If not provided, keys of the first object are used.
 */
export const exportToCSV = (data, fileName, headers) => {
    if (!data || !data.length) {
        console.error('No data provided for export');
        return;
    }

    // Use provided headers or object keys
    const columnHeaders = headers || Object.keys(data[0]);
    const csvRows = [];

    // Add headers row
    csvRows.push(columnHeaders.join(','));

    // Add data rows
    for (const row of data) {
        const values = columnHeaders.map(header => {
            const val = row[header] !== undefined ? row[header] : '';
            // Escape double quotes and wrap in double quotes if containing comma
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    // Create a Blob from the CSV rows
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link and click it to trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
