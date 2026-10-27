"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  PlusCircle, 
  LogOut, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Download,
  AlertCircle,
  TrendingUp,
  Settings,
  Building2,
  X
} from "lucide-react";

interface Invoice {
  id: string;
  clientName: string;
  productName?: string;
  itemNumber?: string;
  hsnNumber?: string;
  quantity?: number;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  dueDate: string;
  status: string;
  email?: string;
}

interface CompanySettings {
  companyName: string;
  companyAddress: string;
  phone: string;
  gstin: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Form states
  const [clientName, setClientName] = useState("");
  const [productName, setProductName] = useState("");
  const [itemNumber, setItemNumber] = useState("");
  const [hsnNumber, setHsnNumber] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");

  // Company Settings state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: "",
    companyAddress: "",
    phone: "",
    gstin: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/login");
      return;
    }
    setUserEmail(email);
    fetchInvoices(email);
    fetchSettings(email);
  }, [router]);

  const fetchInvoices = async (email: string) => {
    try {
      const res = await fetch(`/api/invoices?email=${email}`);
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const fetchSettings = async (email: string) => {
    try {
      const savedLocal = localStorage.getItem(`settings_${email}`);
      if (savedLocal) {
        setSettings(JSON.parse(savedLocal));
      }
      const res = await fetch(`/api/settings?email=${email}`);
      const text = await res.text();
      if (text && text.startsWith("{")) {
        const data = JSON.parse(text);
        if (data.success && data.settings?.companyName) {
          setSettings(data.settings);
          localStorage.setItem(`settings_${email}`, JSON.stringify(data.settings));
        }
      }
    } catch (err) {
      console.error("Failed to load settings from server, using local fallback", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(`settings_${userEmail}`, JSON.stringify(settings));
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, ...settings }),
      });
      setShowSettingsModal(false);
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const unitRate = parseFloat(amount) || 0;
    const qty = parseInt(quantity) || 1;
    const subtotal = unitRate * qty;

    const rate = parseFloat(gstRate) || 0;
    const calculatedGst = (subtotal * rate) / 100;
    const total = subtotal + calculatedGst;

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          clientName,
          productName,
          itemNumber,
          hsnNumber,
          quantity: qty,
          amount: subtotal,
          gstAmount: calculatedGst,
          totalAmount: total,
          dueDate,
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClientName("");
        setProductName("");
        setItemNumber("");
        setHsnNumber("");
        setQuantity("1");
        setAmount("");
        setDueDate("");
        setStatus("Pending");
        fetchInvoices(userEmail);
      } else {
        setError(data.error || "Failed to create invoice");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchInvoices(userEmail);
      }
    } catch (err) {
      console.error("Failed to delete invoice", err);
    }
  };

  const toggleStatus = async (inv: Invoice) => {
    const newStatus = inv.status === "Paid" ? "Pending" : "Paid";
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inv.id,
          email: userEmail,
          clientName: inv.clientName,
          productName: inv.productName,
          itemNumber: inv.itemNumber,
          hsnNumber: inv.hsnNumber,
          quantity: inv.quantity || 1,
          amount: inv.amount,
          gstAmount: inv.gstAmount || 0,
          totalAmount: inv.totalAmount || inv.amount,
          dueDate: inv.dueDate,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInvoices(userEmail);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const downloadPDF = (inv: Invoice) => {
    const qty = inv.quantity || 1;
    const unitRate = Number(inv.amount) / qty;
    const totalPayable = Number(inv.totalAmount || inv.amount);

    // Conditional QR code logic: show ONLY if status is Pending or Overdue
    const isPendingOrOverdue = inv.status === "Pending" || inv.status === "Overdue" || !inv.status;
    const upiPayee = settings.upiId ? settings.upiId.trim() : "";
    const companyDisplayName = settings.companyName || userEmail;
    
    const upiDeepLink = (upiPayee && isPendingOrOverdue)
      ? `upi://pay?pa=${encodeURIComponent(upiPayee)}&pn=${encodeURIComponent(companyDisplayName)}&am=${totalPayable.toFixed(2)}&cu=INR`
      : "";

    const qrCodeUrl = upiDeepLink 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiDeepLink)}`
      : "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice-${inv.id}</title>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; background: #f8fafc; }
            .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
            .header-flex { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; }
            .invoice-title { font-size: 32px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; margin: 0; }
            .invoice-id { font-size: 12px; color: #64748b; margin-top: 6px; font-family: monospace; }
            .company-info { text-align: right; font-size: 13px; color: #475569; line-height: 1.5; }
            .billing-grid { display: flex; justify-content: space-between; margin-top: 30px; font-size: 14px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; }
            .section-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 4px; }
            .client-name { font-size: 16px; font-weight: 700; color: #0f172a; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .badge-paid { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
            .badge-pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
            .badge-overdue { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
            table { width: 100%; margin-top: 35px; border-collapse: collapse; }
            th { background: #f8fafc; color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; padding: 12px 14px; border-bottom: 2px solid #e2e8f0; text-align: left; }
            td { padding: 16px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
            .text-right { text-align: right; }
            .summary-box { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
            .payment-container { display: flex; gap: 20px; align-items: center; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9; max-width: 420px; }
            .payment-info { font-size: 12px; color: #475569; flex: 1; }
            .qr-box { text-align: center; }
            .qr-img { width: 110px; height: 110px; border-radius: 8px; border: 1px solid #cbd5e1; padding: 4px; background: #ffffff; }
            .summary-table { width: 300px; font-size: 14px; }
            .summary-row { display: flex; justify-content: space-between; padding: 6px 0; color: #64748b; }
            .summary-total { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; margin-top: 4px; }
            .footer-note { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header-flex">
              <div>
                <h1 class="invoice-title">INVOICE</h1>
                <div class="invoice-id">REF: ${inv.id}</div>
              </div>
              <div class="company-info">
                <p><strong>${companyDisplayName}</strong></p>
                ${settings.companyAddress ? `<p>${settings.companyAddress}</p>` : ""}
                ${settings.gstin ? `<p><strong>GSTIN:</strong> ${settings.gstin}</p>` : ""}
                <p><strong>Due Date:</strong> ${inv.dueDate}</p>
              </div>
            </div>

            <div class="billing-grid">
              <div>
                <div class="section-label">Billed To</div>
                <div class="client-name">${inv.clientName}</div>
              </div>
              <div style="text-align: right;">
                <div class="section-label">Payment Status</div>
                <div style="margin-top: 4px;">
                  <span class="badge ${inv.status === 'Paid' ? 'badge-paid' : inv.status === 'Overdue' ? 'badge-overdue' : 'badge-pending'}">
                    ${inv.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item / Product Details</th>
                  <th>Item No. / HSN</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${inv.productName || "Professional Services"}</strong>
                  </td>
                  <td>
                    <span style="font-family: monospace; font-size: 12px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
                      ${inv.itemNumber || "N/A"}
                    </span>
                    ${inv.hsnNumber ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">HSN: ${inv.hsnNumber}</div>` : ""}
                  </td>
                  <td class="text-right">${qty}</td>
                  <td class="text-right">₹${unitRate.toFixed(2)}</td>
                  <td class="text-right" style="font-weight: 700; color: #0f172a;">₹${Number(inv.amount).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="summary-box">
              <div class="payment-container">
                <div class="payment-info">
                  <strong style="color: #0f172a;">Payment Details:</strong>
                  ${settings.bankName ? `<div style="margin-top: 4px;">Bank: ${settings.bankName}</div>` : ""}
                  ${settings.accountNumber ? `<div>Account No: ${settings.accountNumber}</div>` : ""}
                  ${settings.ifscCode ? `<div>IFSC: ${settings.ifscCode}</div>` : ""}
                  ${settings.upiId ? `<div>UPI ID: <strong>${settings.upiId}</strong></div>` : ""}
                </div>

                ${qrCodeUrl ? `
                  <div class="qr-box">
                    <img src="${qrCodeUrl}" class="qr-img" alt="Scan to Pay via UPI" />
                    <div style="font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 600;">Scan with GPay / PhonePe</div>
                  </div>
                ` : `
                  <div style="font-size: 11px; color: #15803d; font-weight: 700; background: #dcfce7; padding: 8px 12px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0;">
                    ✓ PAID IN FULL
                  </div>
                `}
              </div>

              <div class="summary-table">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹${Number(inv.amount).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>GST Tax Included</span>
                  <span>₹${Number(inv.gstAmount || 0).toFixed(2)}</span>
                </div>
                <div class="summary-total">
                  <span>Grand Total</span>
                  <span>₹${totalPayable.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer-note">
              <p>Thank you for your business! Generated securely via SaaS Invoice Hub.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${inv.clientName.replace(/\s+/g, '_')}-${inv.id.slice(0, 6)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  // Financial Calculations for Metrics
  const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount || inv.amount) || 0), 0);
  
  const paidInvoices = invoices.filter(inv => inv.status === "Paid");
  const paidAmount = paidInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount || inv.amount) || 0), 0);
  const paidCount = paidInvoices.length;

  const pendingInvoices = invoices.filter(inv => inv.status === "Pending" || !inv.status);
  const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount || inv.amount) || 0), 0);
  const pendingCount = pendingInvoices.length;

  const overdueInvoices = invoices.filter(inv => inv.status === "Overdue");
  const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount || inv.amount) || 0), 0);
  const overdueCount = overdueInvoices.length;

  const filteredInvoices = invoices.filter(inv => 
    inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{settings.companyName || "SaaS Invoice Hub"}</h1>
              <p className="text-xs text-slate-400">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Company Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-8 flex-1">
        
        {/* KPI Summary Cards Grid (4-Column Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/85 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-500">
              <TrendingUp className="w-16 h-16" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Volume</p>
            <h3 className="text-2xl font-extrabold mt-2 text-white">₹{totalRevenue.toFixed(2)}</h3>
            <span className="text-xs text-slate-400 font-medium mt-1 inline-block">{invoices.length} total records</span>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-500">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid Amount</p>
            <h3 className="text-2xl font-extrabold mt-2 text-emerald-400">₹{paidAmount.toFixed(2)}</h3>
            <span className="text-xs text-emerald-500/80 font-medium mt-1 inline-block">{paidCount} invoices cleared</span>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-amber-500">
              <Clock className="w-16 h-16" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Amount</p>
            <h3 className="text-2xl font-extrabold mt-2 text-amber-400">₹{pendingAmount.toFixed(2)}</h3>
            <span className="text-xs text-amber-500/80 font-medium mt-1 inline-block">{pendingCount} pending review</span>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-red-500">
              <AlertCircle className="w-16 h-16" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Amount</p>
            <h3 className="text-2xl font-extrabold mt-2 text-red-400">₹{overdueAmount.toFixed(2)}</h3>
            <span className="text-xs text-red-500/80 font-medium mt-1 inline-block">{overdueCount} overdue bills</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Core Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Create Invoice Panel */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
              <PlusCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-white">Create New Invoice</h2>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Product / Service Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600"
                  placeholder="e.g. Full-Stack Web Development"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Item No. / SKU</label>
                  <input
                    type="text"
                    value={itemNumber}
                    onChange={(e) => setItemNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600"
                    placeholder="e.g. PRD-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={hsnNumber}
                    onChange={(e) => setHsnNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600"
                    placeholder="e.g. 998314"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">GST Rate</label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl text-sm shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? "Generating..." : "Generate & Save Invoice"}
              </button>
            </form>
          </div>

          {/* Invoices List Panel */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Invoice Records</h2>
                <p className="text-xs text-slate-400">Manage billing history, GST, and approvals</p>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="bg-slate-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-sm">No invoices found matching your filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 font-semibold">Client / Product</th>
                      <th className="pb-3 font-semibold">Total (Inc. GST)</th>
                      <th className="pb-3 font-semibold">Due Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredInvoices.map((inv) => {
                      const statusColor = 
                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        inv.status === "Overdue" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                        "bg-amber-500/10 text-amber-400 border-amber-500/20";

                      const displayTotal = inv.totalAmount || inv.amount;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="py-4 font-medium text-white">
                            <div>{inv.clientName}</div>
                            <div className="text-xs text-slate-400 font-normal">{inv.productName || "Professional Services"} (Qty: {inv.quantity || 1})</div>
                          </td>
                          <td className="py-4 font-semibold text-slate-200">
                            ₹{Number(displayTotal).toFixed(2)}
                            {inv.gstAmount ? <span className="block text-[10px] text-slate-400 font-normal">Includes ₹{Number(inv.gstAmount).toFixed(2)} GST</span> : null}
                          </td>
                          <td className="py-4 text-slate-400 text-xs">{inv.dueDate}</td>
                          <td className="py-4">
                            <button 
                              onClick={() => toggleStatus(inv)}
                              title="Click to toggle status"
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-transform active:scale-95 ${statusColor}`}
                            >
                              {inv.status || "Pending"} 🔄
                            </button>
                          </td>
                          <td className="py-4 text-right space-x-1">
                            <button 
                              title="Download official invoice file"
                              onClick={() => downloadPDF(inv)}
                              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors inline-flex items-center"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              title="Delete invoice record"
                              onClick={() => handleDelete(inv.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors inline-flex items-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Company & Billing Profile</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  placeholder="e.g. Apex Tech Solutions Services"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Business Address</label>
                <textarea
                  rows={2}
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                  placeholder="e.g. Suite 402, Cyber Tower, Mumbai, India"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={settings.gstin}
                    onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bank & Payment Details (Appears on Receipt)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={settings.accountNumber}
                        onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                        placeholder="50100012345678"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={settings.ifscCode}
                        onChange={(e) => setSettings({ ...settings, ifscCode: e.target.value })}
                        placeholder="HDFC0001234"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">UPI ID (VPA)</label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                      placeholder="businessname@okaxis"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
                >
                  Save Company Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}