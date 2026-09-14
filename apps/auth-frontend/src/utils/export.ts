import Papa from 'papaparse';

/**
 * Export an array of objects to a CSV file and trigger a download
 * @param data Array of objects to export
 * @param filename Name of the file (e.g. 'earnings.csv')
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
