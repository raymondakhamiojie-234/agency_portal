import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

export default function CreatorInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('/api/invoices', { withCredentials: true });
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, curr: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: curr }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Invoices</h1>
        <p className="text-gray-400 mt-1">View and download your official payout invoices.</p>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-white">All Invoices</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices found.</td></tr>
              ) : (
                invoices.map((i) => (
                  <tr key={i.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{i.invoice_number}</td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(i.issue_date)}</td>
                    <td className="px-6 py-4 text-gray-300">{i.period}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(i.amount)}</td>
                    <td className="px-6 py-4">
                      {i.status === 'PAID' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          <Clock className="h-3 w-3 mr-1" /> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={`http://localhost:4000/api/invoices/${i.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg"
                      >
                        <Download className="h-4 w-4 mr-1.5" /> Download PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
