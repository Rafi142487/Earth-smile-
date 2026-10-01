import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { authService, AdminSession } from '../../services/authService';
import { productService } from '../../services/productService';
import { supabase, supabaseService, SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SQL_SETUP } from '../../services/supabaseService';
import { LeadEnquiry, Product } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { calculateQuotePricing } from '../../utils/quotePricing';
import {
  ShieldCheck,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  MessageCircle,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  Building,
  MapPin,
  Sparkles,
  Package,
  Layers,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Save,
  Check,
  Database,
  Copy,
  CheckCheck,
  Printer,
  Download,
  Receipt,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  onExit: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit, onLogout }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [leads, setLeads] = useState<LeadEnquiry[]>(() => leadService.getLeads());
  const [supabaseQueries, setSupabaseQueries] = useState<LeadEnquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'products' | 'security' | 'database'>('enquiries');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ connected: boolean; tableFound: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandingFilter, setBrandingFilter] = useState<'all' | 'custom' | 'standard'>('all');
  const [volumeFilter, setVolumeFilter] = useState<'all' | 'bulk' | 'standard'>('all');
  
  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<LeadEnquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);

  // Manual Add Client Requirement Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: 'India',
    productName: 'Bamboo Toothbrush',
    quantity: 100,
    customBranding: true,
    brandingDetails: '',
    message: '',
    adminNotes: '',
    leadSource: 'Manual Admin Entry',
  });

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reload & sync data with Supabase
  const refreshLeads = async () => {
    setIsSyncing(true);
    try {
      const synced = await leadService.fetchAndSyncWithSupabase();
      setLeads(synced);

      const remote = await supabaseService.fetchQuotations();
      if (remote.success && Array.isArray(remote.data)) {
        setSupabaseQueries(remote.data);
      }
    } catch {
      setLeads(leadService.getLeads());
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setSession(authService.getSession());
    setProducts(productService.getProducts());

    // Load initial leads and sync immediately with Supabase
    refreshLeads();

    // Auto-test Supabase connectivity on mount
    supabaseService.testConnection().then(res => {
      setDbTestResult(res);
    }).catch(() => {});

    // Auto-sync polling every 10 seconds to ensure live updates
    const pollInterval = setInterval(() => {
      refreshLeads();
    }, 10000);

    // Sync on tab focus
    const handleFocus = () => {
      refreshLeads();
    };
    window.addEventListener('focus', handleFocus);

    // Supabase Real-time Listener: Live quotation updates
    let channel: any = null;
    try {
      channel = supabase
        .channel('realtime:quotations-admin')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'quotations' },
          () => {
            refreshLeads();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime channel error:', e);
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleTestSupabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await supabaseService.testConnection();
      setDbTestResult(res);
    } catch (e: any) {
      setDbTestResult({
        connected: false,
        tableFound: false,
        message: e?.message || 'Connection failed',
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Sync editing notes when selectedLead changes
  useEffect(() => {
    if (selectedLead) {
      setEditingNotes(selectedLead.adminNotes || '');
      setNoteSavedMessage(false);
    }
  }, [selectedLead]);

  // Update lead status
  const handleStatusChange = (id: string, newStatus: LeadEnquiry['status']) => {
    const updated = leadService.updateLeadStatus(id, newStatus);
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  // Save admin notes
  const handleSaveNotes = (id: string) => {
    const updated = leadService.updateLeadNotes(id, editingNotes);
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, adminNotes: editingNotes });
    }
    setNoteSavedMessage(true);
    setTimeout(() => setNoteSavedMessage(false), 2500);
  };

  // Delete lead
  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this client requirement record?')) {
      const updated = leadService.deleteLead(id);
      setLeads(updated);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  // Add manual lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name || !newClientData.phone) {
      alert('Please provide at least a Client Name and Phone number.');
      return;
    }

    const created = leadService.submitLead({
      name: newClientData.name.trim(),
      phone: newClientData.phone.trim(),
      email: newClientData.email.trim(),
      company: newClientData.company.trim() || 'Private Practice / Buyer',
      city: newClientData.city.trim() || 'India',
      productName: newClientData.productName,
      quantity: Number(newClientData.quantity),
      customBranding: newClientData.customBranding,
      brandingDetails: newClientData.brandingDetails.trim(),
      message: newClientData.message.trim(),
      leadSource: newClientData.leadSource,
      adminNotes: newClientData.adminNotes.trim(),
    });

    setLeads(leadService.getLeads());
    setIsAddModalOpen(false);
    setNewClientData({
      name: '',
      phone: '',
      email: '',
      company: '',
      city: 'India',
      productName: 'Bamboo Toothbrush',
      quantity: 100,
      customBranding: true,
      brandingDetails: '',
      message: '',
      adminNotes: '',
      leadSource: 'Manual Admin Entry',
    });
    setSelectedLead(created);
  };

  // Export leads to CSV
  const handleExportCSV = () => {
    const headers = [
      'Enquiry ID',
      'Date Created',
      'Status',
      'Client Name',
      'Company / Clinic',
      'Email',
      'Phone',
      'City',
      'Product Requested',
      'Quantity (Units)',
      'Custom Branding Required',
      'Laser Branding Details',
      'Client Requirements & Message',
      'Admin Internal Notes',
      'Lead Source',
    ];

    const rows = leads.map(l => [
      `"${l?.id || ''}"`,
      `"${l?.createdAt ? new Date(l.createdAt).toLocaleString() : ''}"`,
      `"${(l?.status || 'new').toUpperCase()}"`,
      `"${(l?.name || '').replace(/"/g, '""')}"`,
      `"${(l?.company || '').replace(/"/g, '""')}"`,
      `"${l?.email || ''}"`,
      `"${l?.phone || ''}"`,
      `"${(l?.city || '').replace(/"/g, '""')}"`,
      `"${(l?.productName || '').replace(/"/g, '""')}"`,
      Number(l?.quantity) || 50,
      l?.customBranding ? 'YES' : 'NO',
      `"${(l?.brandingDetails || '').replace(/"/g, '""')}"`,
      `"${(l?.message || '').replace(/"/g, '""')}"`,
      `"${(l?.adminNotes || '').replace(/"/g, '""')}"`,
      `"${l?.leadSource || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EarthSmile_Client_Requirements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const res = authService.changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMessage({ type: 'success', text: 'Administrator password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Failed to change password.' });
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    if (!lead) return false;

    // Status
    if (statusFilter !== 'all' && (lead.status || 'new') !== statusFilter) return false;
    
    // Branding
    if (brandingFilter === 'custom' && !lead.customBranding) return false;
    if (brandingFilter === 'standard' && lead.customBranding) return false;

    // Volume
    const qty = Number(lead.quantity) || 0;
    if (volumeFilter === 'bulk' && qty < 500) return false;
    if (volumeFilter === 'standard' && qty >= 500) return false;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (lead.name || '').toLowerCase().includes(q);
      const matchComp = (lead.company || '').toLowerCase().includes(q);
      const matchEmail = (lead.email || '').toLowerCase().includes(q);
      const matchPhone = (lead.phone || '').toLowerCase().includes(q);
      const matchProd = (lead.productName || '').toLowerCase().includes(q);
      const matchCity = (lead.city || '').toLowerCase().includes(q);
      const matchMsg = (lead.message || '').toLowerCase().includes(q);
      const matchBranding = (lead.brandingDetails || '').toLowerCase().includes(q);
      const matchNotes = (lead.adminNotes || '').toLowerCase().includes(q);
      return matchName || matchComp || matchEmail || matchPhone || matchProd || matchCity || matchMsg || matchBranding || matchNotes;
    }
    return true;
  });

  // Key performance numbers
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => (l?.status || 'new') === 'new').length;
  const customBrandingCount = leads.filter(l => Boolean(l?.customBranding)).length;
  const totalUnits = leads.reduce((acc, l) => acc + (Number(l?.quantity) || 0), 0);
  const totalPipelineValue = leads.reduce((acc, l) => acc + calculateQuotePricing(l).grandTotal, 0);
  const bulkOrdersCount = leads.filter(l => (Number(l?.quantity) || 0) >= 500).length;

  return (
    <div className="min-h-screen bg-[#F6F5EF] text-[#1C1F1D] flex flex-col font-sans selection:bg-[#E2ECE3] selection:text-[#192E22]">
      {/* 1. Global Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E1D7] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <BrandLogo variant="dark" size="sm" />
            <div className="h-5 w-[1px] bg-[#DDD9CE]" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#192E22] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C8DACB]">
                Admin Portal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#5D6760]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Client Quotations & Enquiries</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Add a manual client requirement"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Client Requirement</span>
              <span className="sm:hidden">Add</span>
            </button>

            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2E3631] bg-[#FAF9F5] hover:bg-[#F0EFE8] border border-[#DEDCCE] rounded-lg transition-colors cursor-pointer"
              title="Return to Earth Smile front-facing store"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#BD7B3C]" />
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-lg transition-colors cursor-pointer"
              title="End admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* KPI Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#69726B] mb-1">
              Quotation Requests & Quotes
            </div>
            <div className="text-2xl font-serif font-bold text-[#192E22]">
              {totalLeads}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Total customer quote requests</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] shadow-xs relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#BD7B3C] font-semibold mb-1 flex items-center justify-between">
              <span>Action Required</span>
              {newLeadsCount > 0 && <span className="w-2 h-2 rounded-full bg-[#BD7B3C] animate-ping" />}
            </div>
            <div className="text-2xl font-serif font-bold text-[#BD7B3C]">
              {newLeadsCount}
            </div>
            <div className="text-[11px] text-[#8C643E] mt-1 font-medium">New unquoted leads</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-semibold mb-1">
              Total Quotation Pipeline
            </div>
            <div className="text-2xl font-serif font-bold text-emerald-800">
              ₹{totalPipelineValue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Estimated commercial value</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#69726B] mb-1">
              Total Units Demanded
            </div>
            <div className="text-2xl font-serif font-bold text-[#192E22] tabular-nums">
              {totalUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Across all quotations</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] shadow-xs col-span-2 sm:col-span-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#69726B] mb-1">
              Custom Laser Branding
            </div>
            <div className="text-2xl font-serif font-bold text-[#192E22]">
              {customBrandingCount}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Logo engraving requested</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-[#E3E1D7] shadow-xs overflow-hidden">
          <div className="flex border-b border-[#EAE8DE] px-4 pt-2">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'border-[#192E22] text-[#192E22] bg-[#FAF9F5]'
                  : 'border-transparent text-[#626A65] hover:text-[#192E22]'
              }`}
            >
              <Package className="w-4 h-4 text-[#BD7B3C]" />
              <span>Quotations & Client Quotes</span>
              <span className="bg-[#E7EFE9] text-[#192E22] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#192E22] text-[#192E22] bg-[#FAF9F5]'
                  : 'border-transparent text-[#626A65] hover:text-[#192E22]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#BD7B3C]" />
              <span>Catalog & Specs Reference</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'security'
                  ? 'border-[#192E22] text-[#192E22] bg-[#FAF9F5]'
                  : 'border-transparent text-[#626A65] hover:text-[#192E22]'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#BD7B3C]" />
              <span>Security & Password</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'database'
                  ? 'border-[#192E22] text-[#192E22] bg-[#FAF9F5]'
                  : 'border-transparent text-[#626A65] hover:text-[#192E22]'
              }`}
            >
              <Database className="w-4 h-4 text-[#2E7D4E]" />
              <span>Supabase Database</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          {/* TAB 1: CLIENT REQUIREMENTS MANAGEMENT */}
          {activeTab === 'enquiries' && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Controls Bar */}
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by client, clinic, requirements, city, email, phone..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg p-1">
                    <span className="text-stone-400 pl-2 text-[11px] font-mono">Status:</span>
                    {(['all', 'new', 'contacted', 'quoted', 'closed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2 py-1 rounded capitalize font-medium cursor-pointer transition-colors ${
                          statusFilter === st
                            ? 'bg-[#192E22] text-white'
                            : 'text-[#4A534E] hover:bg-[#EBE9DF]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Branding Filter */}
                  <select
                    value={brandingFilter}
                    onChange={e => setBrandingFilter(e.target.value as any)}
                    className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#2A312D] focus:outline-none"
                  >
                    <option value="all">All Branding Specs</option>
                    <option value="custom">Custom Engraving Only</option>
                    <option value="standard">Standard Box Packaging</option>
                  </select>

                  {/* Volume Filter */}
                  <select
                    value={volumeFilter}
                    onChange={e => setVolumeFilter(e.target.value as any)}
                    className="bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#2A312D] focus:outline-none"
                  >
                    <option value="all">All Order Sizes</option>
                    <option value="bulk">Bulk (≥500 Units)</option>
                    <option value="standard">Standard (&lt;500 Units)</option>
                  </select>

                  {/* Export CSV Button */}
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EAF2EC] hover:bg-[#DCEAE0] text-[#192E22] font-semibold rounded-lg border border-[#BED3C3] transition-colors cursor-pointer"
                    title="Export complete client requirements to CSV spreadsheet"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#2E7D4E]" />
                    <span>Export CSV</span>
                  </button>

                  {/* Refresh */}
                  <button
                    onClick={refreshLeads}
                    className="p-2 text-stone-600 hover:text-stone-900 bg-[#FAF9F5] hover:bg-[#EFECE3] border border-[#DDD9CE] rounded-lg transition-colors cursor-pointer"
                    title="Reload data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inquiries Table / Empty State */}
              {filteredLeads.length === 0 ? (
                <div className="bg-[#FAF9F5] rounded-xl border border-dashed border-[#DCD7C9] p-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFECE2] text-stone-500 mx-auto flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#192E22]">
                    No client requirements match the current filters
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    New inquiries submitted by website visitors will appear here automatically. You can also manually log a requirement.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={refreshLeads}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#192E22] bg-white border border-[#D5D0C2] rounded-lg hover:bg-stone-50 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3 h-3 text-[#BD7B3C]" />
                      <span>Refresh Inquiries</span>
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#192E22] rounded-lg hover:bg-[#254231] cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Log New Requirement</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#E3E1D7] bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] text-[#556059] uppercase tracking-wider font-mono text-[10px] border-b border-[#E3E1D7]">
                        <th className="py-3 px-4">Quote Ref & Client</th>
                        <th className="py-3 px-4">Product Demanded</th>
                        <th className="py-3 px-4">Branding Spec</th>
                        <th className="py-3 px-4">Quotation Value (INR)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Direct Response</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE4]">
                      {filteredLeads.map(lead => {
                        const pricing = calculateQuotePricing(lead);
                        const statusColors = {
                          new: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
                          contacted: 'bg-blue-100 text-blue-900 border-blue-300',
                          quoted: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
                          closed: 'bg-stone-200 text-stone-800 border-stone-300',
                          archived: 'bg-stone-100 text-stone-500 border-stone-200',
                        };

                        const whatsAppUrl = buildWhatsAppUrl({
                          productName: lead.productName || 'Bamboo Toothbrush',
                          quantity: pricing.quantity,
                          customBranding: Boolean(lead.customBranding),
                          companyName: lead.company || 'Practice',
                          senderName: lead.name || 'Client',
                          customQuery: `Hello ${lead.name || 'Client'}, thank you for contacting Earth Smile. We have prepared your official quotation (${pricing.referenceCode}) for ${pricing.quantity} units of ${lead.productName || 'Bamboo Toothbrush'}${lead.customBranding ? ' with custom laser engraving' : ''}.\n\n• Unit Rate: ₹${pricing.effectiveRate}/unit\n• Total Quotation: ₹${pricing.grandTotal.toLocaleString('en-IN')}\n• Dispatch Timeline: ${pricing.dispatchTimeline}\n\nPlease let us know if you would like to proceed with sample verification.`,
                        });

                        return (
                          <tr
                            key={lead.id}
                            onClick={e => {
                              if (!(e.target as HTMLElement).closest('button, a, select, input')) {
                                setSelectedLead(lead);
                              }
                            }}
                            className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
                          >
                            {/* Quote Ref & Client */}
                            <td className="py-3.5 px-4 min-w-[200px]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-[11px] text-[#BD7B3C] bg-[#F8EFE4] px-1.5 py-0.5 rounded border border-[#E9D6C4]">
                                  {pricing.referenceCode}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {lead.leadSource || 'Supabase DB'}
                                </span>
                              </div>
                              <div className="font-bold text-[#192E22] text-sm group-hover:text-[#BD7B3C] transition-colors">
                                {lead.name || 'Anonymous Client'}
                              </div>
                              <div className="text-[11px] text-[#59635C] flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-[#BD7B3C]" />
                                <span className="font-medium truncate max-w-[170px]">{lead.company || 'Direct Inquiry'}</span>
                              </div>
                              <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                                <MapPin className="w-2.5 h-2.5" />
                                <span>{lead.city || 'India'}</span>
                              </div>
                              <div className="text-[10px] text-stone-500 font-mono mt-1">
                                <span>{lead.phone}</span>
                                {lead.email && <span className="text-stone-400"> • {lead.email}</span>}
                              </div>
                            </td>

                            {/* Product & Volume Requirement */}
                            <td className="py-3.5 px-4 min-w-[180px]">
                              <div className="font-semibold text-[#192E22] text-sm">
                                {lead.productName || 'Bamboo Toothbrush'}
                              </div>
                              <div className="text-[11px] text-stone-600 font-mono mt-0.5 flex items-center gap-1.5">
                                <strong className="text-[#192E22] font-bold text-sm">{pricing.quantity.toLocaleString()}</strong> units
                                {pricing.quantity >= 500 && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">
                                    BULK
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-400 mt-1 font-mono">
                                Recv: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                              </div>
                            </td>

                            {/* Branding Spec */}
                            <td className="py-3.5 px-4 max-w-[190px]">
                              {lead.customBranding ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 bg-[#F9EFE4] text-[#8F5620] border border-[#EACBB0] text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                                    <Sparkles className="w-2.5 h-2.5 text-[#BD7B3C]" />
                                    Custom Laser
                                  </span>
                                  {lead.brandingDetails ? (
                                    <p className="text-[11px] text-[#474E49] mt-1 line-clamp-2 italic font-serif">
                                      "{lead.brandingDetails}"
                                    </p>
                                  ) : (
                                    <p className="text-[10px] text-stone-400 mt-0.5 italic">
                                      Client requested custom logo engraving
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center text-stone-500 text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded">
                                  Standard Box Packaging
                                </span>
                              )}
                            </td>

                            {/* Commercial Quote Value (INR) */}
                            <td className="py-3.5 px-4 min-w-[170px]">
                              <div className="text-sm font-mono font-bold text-emerald-800">
                                ₹{pricing.grandTotal.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                                ₹{pricing.effectiveRate}/unit • Net Commercial
                              </div>
                              <div className="mt-1">
                                <span className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono border border-stone-200">
                                  {pricing.tierName}
                                </span>
                              </div>
                            </td>

                            {/* Status with inline selector */}
                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status}
                                onChange={e => handleStatusChange(lead.id, e.target.value as any)}
                                className={`text-[10px] sm:text-[11px] border rounded-md px-2 py-1 uppercase font-mono cursor-pointer focus:outline-none transition-colors ${
                                  statusColors[lead.status] || 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                <option value="new">NEW INQUIRY</option>
                                <option value="contacted">CONTACTED</option>
                                <option value="quoted">QUOTED</option>
                                <option value="closed">CLOSED / WON</option>
                                <option value="archived">ARCHIVED</option>
                              </select>
                            </td>

                            {/* Direct Response */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <a
                                  href={whatsAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-[#E8F5E9] hover:bg-[#D4EDDA] text-[#2E7D4E] rounded-md transition-colors cursor-pointer"
                                  title={`WhatsApp: ${lead.phone}`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`mailto:${lead.email}?subject=Earth Smile Commercial Quotation: ${lead.productName}&body=Dear ${lead.name},%0D%0A%0D%0AThank you for contacting Earth Smile about your inquiry for ${pricing.quantity} units of ${lead.productName}. We have prepared your commercial quotation (${pricing.referenceCode}):%0D%0A%0D%0A• Total Quotation: ₹${pricing.grandTotal}%0D%0A• Unit Rate: ₹${pricing.effectiveRate}/unit%0D%0A• Dispatch Timeline: ${pricing.dispatchTimeline}%0D%0A%0D%0ABest regards,%0D%0AEarth Smile Commercial Team`}
                                  className="p-1.5 bg-[#EEF2F6] hover:bg-[#DEE5ED] text-[#255D8C] rounded-md transition-colors cursor-pointer"
                                  title={`Email: ${lead.email}`}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors cursor-pointer"
                                  title={`Call: ${lead.phone}`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#192E22] bg-[#FAF9F5] hover:bg-[#EDE9DE] border border-[#DDD9CE] rounded-md transition-colors cursor-pointer shadow-2xs"
                                  title="View Full Quotation Dossier & Breakdown"
                                >
                                  <FileText className="w-3 h-3 text-[#BD7B3C]" />
                                  <span>View Quote</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS SPECIFICATION REFERENCE */}
          {activeTab === 'products' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#192E22]">
                    Production Catalog & Minimum Order Quantities (MOQ)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live technical specifications and branding setup parameters for Earth Smile inventory.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {products.map(product => (
                  <div key={product.id} className="bg-[#FAF9F5] border border-[#E3E1D7] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#BD7B3C] font-semibold bg-[#F5EDE1] px-2 py-0.5 rounded">
                          {product.categoryLabel}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#192E22] mb-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {product.shortDescription}
                      </p>

                      <div className="space-y-1.5 text-xs border-t border-[#EAE7DC] pt-3 text-stone-700">
                        <div className="flex justify-between">
                          <span className="text-stone-400">MOQ:</span>
                          <strong className="font-mono text-[#192E22]">{product.moq} {product.moqUnit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Material:</span>
                          <span className="font-medium text-[#192E22]">{product.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Dimensions:</span>
                          <span className="font-mono text-[11px]">{product.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Branding:</span>
                          <span className="text-emerald-700 font-semibold">Laser Engraving Ready</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE7DC] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-stone-500">Slug: {product.slug}</span>
                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#192E22] hover:text-[#BD7B3C] inline-flex items-center gap-1"
                      >
                        <span>Preview PDP</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ADMIN SETTINGS */}
          {activeTab === 'security' && (
            <div className="p-4 sm:p-6 max-w-2xl space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#192E22]">
                  Administrator Credentials & Session Security
                </h3>
                <p className="text-xs text-stone-500">
                  Manage the password required to access this dashboard.
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="space-y-4 bg-[#FAF9F5] p-5 rounded-xl border border-[#E3E1D7]">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Current Administrator Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 pr-10 text-sm bg-white border border-[#DEDCCE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                      aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    New Administrator Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 pr-10 text-sm bg-white border border-[#DEDCCE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                      aria-label={showNewPw ? 'Hide password' : 'Show password'}
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 pr-10 text-sm bg-white border border-[#DEDCCE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                      aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Update Administrator Password
                  </button>
                </div>
              </form>

              {/* System Session Info Box */}
              <div className="bg-white p-4 rounded-xl border border-[#E3E1D7] text-xs space-y-2">
                <div className="font-semibold text-[#192E22]">Active Session Details</div>
                <div className="text-stone-500 font-mono text-[11px] space-y-1">
                  <div>User ID: <strong className="text-stone-800">admin</strong></div>
                  <div>User Role: <strong className="text-stone-800">Root Administrator</strong></div>
                  <div>Login Timestamp: {session?.loginTime ? new Date(session.loginTime).toLocaleString() : 'Active session'}</div>
                  <div>Storage Mechanism: Encrypted local browser session</div>
                </div>

                <div className="pt-3 border-t border-[#EAE7DC]">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset credentials back to factory default?')) {
                        authService.resetCredentials();
                        setPasswordMessage({ type: 'success', text: 'Factory credentials restored successfully.' });
                      }
                    }}
                    className="text-stone-500 hover:text-stone-800 text-[11px] underline cursor-pointer"
                  >
                    Reset credentials to factory default
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE DATABASE INTEGRATION */}
          {activeTab === 'database' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECEBE2]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      Supabase Cloud Connected
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#192E22]">
                    Supabase Database Configuration
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Customer quotation submissions and inquiry forms are automatically saved to your Supabase PostgreSQL database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshLeads}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#192E22] bg-[#FAF9F5] hover:bg-[#EFECE3] border border-[#DDD9CE] rounded-lg transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#BD7B3C] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync From Supabase'}</span>
                  </button>

                  <button
                    onClick={handleTestSupabase}
                    disabled={isTestingDb}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isTestingDb ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>

              {/* Live Test Result Banner */}
              {dbTestResult && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                    dbTestResult.tableFound
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : dbTestResult.connected
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-red-50/80 border-red-200 text-red-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {dbTestResult.tableFound ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">{dbTestResult.message}</p>
                    {!dbTestResult.tableFound && (
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        To enable persistent storage in Supabase, copy the SQL setup script below and execute it in your Supabase SQL Editor.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Active Connection Credentials */}
              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-[#E3E1D7] space-y-4">
                <h4 className="font-serif text-sm font-bold text-[#192E22] flex items-center justify-between">
                  <span>Connection Parameters</span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Active & Configured
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-[#DDD9CE]">
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">Project ID</span>
                    <span className="font-mono font-bold text-[#192E22] text-sm">{SUPABASE_PROJECT_ID}</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#DDD9CE]">
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">Target Database Table</span>
                    <span className="font-mono font-bold text-[#192E22] text-sm">public.quotations</span>
                  </div>

                  <div className="sm:col-span-2 bg-white p-3 rounded-lg border border-[#DDD9CE]">
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">Supabase REST Endpoint</span>
                    <span className="font-mono text-stone-700 text-xs break-all">{SUPABASE_URL}</span>
                  </div>

                  <div className="sm:col-span-2 bg-white p-3 rounded-lg border border-[#DDD9CE]">
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">Publishable / Anon API Key</span>
                    <span className="font-mono text-stone-600 text-xs break-all">{SUPABASE_ANON_KEY}</span>
                  </div>
                </div>
              </div>

              {/* SQL Setup Script Box */}
              <div className="bg-white p-5 rounded-xl border border-[#E3E1D7] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#192E22]">
                      Supabase SQL Table Schema & RLS Policies
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Run this script once in your Supabase SQL Editor to initialize the <code className="text-[#192E22] font-semibold">quotations</code> table.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#192E22] bg-[#FAF9F5] hover:bg-[#EFECE3] border border-[#DDD9CE] rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedSql ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#BD7B3C]" />
                          <span>Copy SQL Script</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-stone-800 bg-[#161B18]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#0F1311] border-b border-stone-800 text-[10px] text-stone-400 font-mono">
                    <span>schema.sql</span>
                    <span>PostgreSQL / Supabase</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-72 leading-relaxed">
                    {SUPABASE_SQL_SETUP}
                  </pre>
                </div>
              </div>

              {/* Direct Supabase Records Table */}
              <div className="bg-white p-5 rounded-xl border border-[#E3E1D7] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#192E22] flex items-center gap-2">
                      <span>Direct Database Records in Supabase (public.quotations)</span>
                      <span className="bg-[#EAF2EC] text-[#192E22] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                        {supabaseQueries.length} Total
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Live records fetched directly from your Supabase PostgreSQL database.
                    </p>
                  </div>

                  <button
                    onClick={refreshLeads}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#192E22] bg-[#FAF9F5] hover:bg-[#EFECE3] border border-[#DDD9CE] rounded-lg transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#BD7B3C] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Refreshing...' : 'Refresh Records'}</span>
                  </button>
                </div>

                {supabaseQueries.length === 0 ? (
                  <div className="py-8 text-center bg-[#FAF9F5] rounded-lg border border-dashed border-[#DDD9CE] space-y-2">
                    <p className="text-xs text-stone-600 font-medium">No quotations recorded in Supabase yet.</p>
                    <p className="text-[11px] text-stone-400">
                      When customers submit inquiries or quote requests, they will populate here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-[#EAE8DE]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] text-stone-500 font-mono text-[10px] uppercase border-b border-[#EAE8DE]">
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Product</th>
                          <th className="py-2.5 px-3">Quantity</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFECE4]">
                        {supabaseQueries.map(q => (
                          <tr key={q.id} className="hover:bg-[#FAF9F5]">
                            <td className="py-2.5 px-3 font-semibold text-[#192E22]">
                              <div>{q.name || 'Anonymous'}</div>
                              <div className="text-[10px] text-stone-500 font-normal">{q.company || 'Direct'}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-stone-600">
                              <div>{q.phone}</div>
                              {q.email && <div className="text-[10px] text-stone-400 truncate max-w-[120px]">{q.email}</div>}
                            </td>
                            <td className="py-2.5 px-3 text-[#192E22] font-medium">
                              {q.productName}
                              {q.customBranding && (
                                <span className="block text-[9px] text-[#BD7B3C] font-mono">Custom Laser</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#192E22]">
                              {(Number(q.quantity) || 50).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                {q.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-stone-400 font-mono text-[10px]">
                              {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setSelectedLead(q)}
                                className="px-2 py-1 text-[11px] font-semibold text-[#192E22] bg-[#FAF9F5] hover:bg-stone-200 border border-stone-300 rounded cursor-pointer"
                              >
                                View Dossier
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Detailed Client Quotation Dossier Modal */}
      {selectedLead && (() => {
        const pricing = calculateQuotePricing(selectedLead);
        const quoteSummaryText = `EARTH SMILE COMMERCIAL QUOTATION\nRef: ${pricing.referenceCode}\nDate: ${new Date(selectedLead.createdAt).toLocaleDateString('en-IN')}\n\nClient: ${selectedLead.name} (${selectedLead.company || 'Direct'})\nContact: ${selectedLead.phone} | ${selectedLead.email || 'N/A'}\nLocation: ${selectedLead.city || 'India'}\n\nProduct: ${selectedLead.productName || 'Bamboo Toothbrush'}\nQuantity: ${pricing.quantity} units\nWholesale Unit Rate: ₹${pricing.unitRate}/unit\nLaser Engraving Surcharge: ${pricing.brandingRate > 0 ? `₹${pricing.brandingRate}/unit` : 'Included / Standard'}\nEffective Rate: ₹${pricing.effectiveRate}/unit\n\nGrand Total: ₹${pricing.grandTotal.toLocaleString('en-IN')}\nDispatch Timeline: ${pricing.dispatchTimeline}\n\nBranding Specs: ${selectedLead.customBranding ? (selectedLead.brandingDetails || 'Custom laser logo engraving requested') : 'Standard Earth Smile unbleached packaging'}`;

        return (
          <div
            role="dialog"
            aria-modal="true"
            onClick={e => {
              if (e.target === e.currentTarget) setSelectedLead(null);
            }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div className="bg-[#FAF9F5] border border-[#E3E1D7] rounded-2xl w-full max-w-3xl my-auto shadow-2xl overflow-hidden relative">
              {/* Modal Top Header */}
              <div className="bg-white border-b border-[#EAE9E1] px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#BD7B3C] font-bold bg-[#F8EFE4] px-2 py-0.5 rounded border border-[#E9D6C4]">
                      Quotation #{pricing.referenceCode}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Database Record
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#192E22]">
                    Commercial Quotation Dossier
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(quoteSummaryText);
                      alert('Quotation summary copied to clipboard!');
                    }}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Copy Quotation Summary"
                  >
                    <Copy className="w-4 h-4 text-[#BD7B3C]" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Print Quotation"
                  >
                    <Printer className="w-4 h-4 text-[#192E22]" />
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
                {/* 1. Status Bar & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8E6DD]">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-mono uppercase font-semibold">Quotation Status</span>
                    <div className="mt-1">
                      <select
                        value={selectedLead.status}
                        onChange={e => handleStatusChange(selectedLead.id, e.target.value as any)}
                        className="text-xs font-semibold uppercase tracking-wider font-mono border border-[#DDD9CE] rounded-lg px-2.5 py-1.5 bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      >
                        <option value="new">NEW INQUIRY</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="quoted">QUOTED</option>
                        <option value="closed">CLOSED / WON</option>
                        <option value="archived">ARCHIVED</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-stone-400 block text-[10px] font-mono uppercase font-semibold">Date Received</span>
                    <span className="font-mono text-stone-800 font-semibold">
                      {new Date(selectedLead.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Origin: {selectedLead.leadSource || 'Website Quotation Form'}</span>
                  </div>
                </div>

                {/* 2. Commercial Pricing Breakdown Card */}
                <div className="bg-white p-5 rounded-xl border border-[#E8E6DD] space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#BD7B3C] font-semibold block">
                        Commercial Quotation Sheet
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#192E22]">
                        {selectedLead.productName || 'Bamboo Toothbrush'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Total Quotation Value</span>
                      <div className="text-2xl font-serif font-bold text-emerald-800">
                        ₹{pricing.grandTotal.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500">
                        ₹{pricing.effectiveRate}/unit • All inclusive
                      </div>
                    </div>
                  </div>

                  {/* Pricing line item table */}
                  <div className="overflow-x-auto rounded-lg border border-[#ECE9DF]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] text-stone-500 font-mono text-[10px] uppercase border-b border-[#ECE9DF]">
                          <th className="py-2 px-3">Description</th>
                          <th className="py-2 px-3 text-center">Batch Qty</th>
                          <th className="py-2 px-3 text-right">Unit Rate</th>
                          <th className="py-2 px-3 text-right">Laser Branding</th>
                          <th className="py-2 px-3 text-right">Effective Rate</th>
                          <th className="py-2 px-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECE9DF] font-mono">
                        <tr>
                          <td className="py-2.5 px-3 font-sans font-medium text-[#192E22]">
                            <div>{selectedLead.productName || 'Bamboo Toothbrush'}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{pricing.tierName}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            {pricing.quantity.toLocaleString()} units
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600">
                            ₹{pricing.unitRate}
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600">
                            {pricing.brandingRate > 0 ? `+₹${pricing.brandingRate}` : '₹0'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#192E22]">
                            ₹{pricing.effectiveRate}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#192E22]">
                            ₹{pricing.subtotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#EAF2EC] text-emerald-950 font-mono text-sm border-t-2 border-emerald-700">
                          <td colSpan={4} className="py-2.5 px-3 text-right font-bold">Total Commercial Quotation (INR):</td>
                          <td colSpan={2} className="py-2.5 px-3 text-right font-bold text-emerald-800 text-base">
                            ₹{pricing.grandTotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 font-mono pt-1 gap-2">
                    <div>Estimated Production & Dispatch: <strong className="text-stone-800 font-bold">{pricing.dispatchTimeline}</strong></div>
                    <div>Payment Terms: <strong>50% Advance with Purchase Order, 50% prior to dispatch</strong></div>
                  </div>
                </div>

                {/* 3. Client & Organization Profile Card */}
                <div className="bg-white p-4 rounded-xl border border-[#E8E6DD] space-y-3">
                  <div className="font-serif font-bold text-sm text-[#192E22] flex items-center justify-between">
                    <span>Buyer & Organization Details</span>
                    <span className="text-[10px] font-mono text-stone-400 font-normal">Client ID: {selectedLead.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#EDE9DF]">
                      <span className="text-stone-400 text-[10px] font-mono uppercase block">Client Name</span>
                      <strong className="text-sm font-semibold text-[#192E22] block mt-0.5">{selectedLead.name || 'Anonymous Client'}</strong>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#EDE9DF]">
                      <span className="text-stone-400 text-[10px] font-mono uppercase block">Organization / Practice</span>
                      <strong className="text-sm font-semibold text-[#192E22] block mt-0.5">{selectedLead.company || 'Direct Inquiry'}</strong>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#EDE9DF]">
                      <span className="text-stone-400 text-[10px] font-mono uppercase block">Delivery Location</span>
                      <span className="text-stone-800 font-medium block mt-0.5">{selectedLead.city || 'India'}</span>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#EDE9DF]">
                      <span className="text-stone-400 text-[10px] font-mono uppercase block">Contact Details</span>
                      <div className="mt-0.5 flex flex-col gap-0.5 font-mono text-xs">
                        <a href={`tel:${selectedLead.phone}`} className="text-stone-800 hover:text-emerald-700 font-semibold underline">
                          {selectedLead.phone}
                        </a>
                        {selectedLead.email ? (
                          <a href={`mailto:${selectedLead.email}`} className="text-[#255D8C] hover:underline truncate">
                            {selectedLead.email}
                          </a>
                        ) : (
                          <span className="text-stone-400">No email specified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consents & Verification row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Age 18+ Verified & Authorized
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      DPDP Act Commercial Consent Given
                    </span>
                  </div>
                </div>

                {/* 4. Branding & Special Requirements Card */}
                <div className="bg-white p-4 rounded-xl border border-[#E8E6DD] space-y-3">
                  <div>
                    <span className="text-stone-400 text-[10px] font-mono uppercase block mb-1">
                      Custom Laser Engraving Specification
                    </span>
                    {selectedLead.customBranding ? (
                      <div className="bg-[#FAF4EB] border border-[#E8D4BE] p-3 rounded-lg">
                        <div className="flex items-center gap-1.5 text-[#8F5620] font-semibold text-xs mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                          <span>Client requested pre-print laser logo engraving on handle:</span>
                        </div>
                        <p className="text-stone-800 italic font-serif">
                          "{selectedLead.brandingDetails || 'Logo engraving as per provided vector artwork'}"
                        </p>
                      </div>
                    ) : (
                      <span className="text-stone-600 bg-stone-100 px-2.5 py-1 rounded inline-block">
                        Standard Earth Smile unbleached packaging without custom logo engraving.
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-400 text-[10px] font-mono uppercase block mb-1">
                      Client Brief & Delivery Instructions
                    </span>
                    <div className="bg-[#FAF9F5] p-3 rounded-lg border border-stone-200 text-stone-800 leading-relaxed font-sans">
                      {selectedLead.message || 'No additional special instructions specified by client.'}
                    </div>
                  </div>

                  {/* Internal Admin Notes */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-stone-600 font-semibold text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#BD7B3C]" />
                        <span>Internal Administrator Follow-up Notes:</span>
                      </span>
                      {noteSavedMessage && (
                        <span className="text-emerald-700 text-[11px] font-mono flex items-center gap-1 font-semibold animate-in fade-in">
                          <Check className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={editingNotes}
                        onChange={e => setEditingNotes(e.target.value)}
                        placeholder="Add internal notes (e.g. 'Quoted ₹45/unit on WhatsApp', 'Sample kit dispatched via courier', 'Artwork file pending review')..."
                        className="w-full p-2.5 bg-[#FAF9F5] border border-[#DDD9CE] rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSaveNotes(selectedLead.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#192E22] hover:bg-[#254231] text-white rounded font-medium text-[11px] shadow-2xs transition-colors cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save Note</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Contact Actions Footer */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={buildWhatsAppUrl({
                      productName: selectedLead.productName,
                      quantity: pricing.quantity,
                      customBranding: selectedLead.customBranding,
                      companyName: selectedLead.company,
                      senderName: selectedLead.name,
                      customQuery: `Hello ${selectedLead.name}, here is your official commercial quotation (${pricing.referenceCode}) from Earth Smile:\n\n• Product: ${selectedLead.productName}\n• Quantity: ${pricing.quantity} units\n• Unit Rate: ₹${pricing.effectiveRate} (incl. laser branding)\n• Total Quotation Value: ₹${pricing.grandTotal.toLocaleString('en-IN')}\n• Dispatch Schedule: ${pricing.dispatchTimeline}\n\nWe are ready to prepare your custom vector mockups. Would you like to confirm the order?`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-lg text-center flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Official Quote via WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${selectedLead.email}?subject=Earth Smile Commercial Quotation: ${selectedLead.productName} (Ref ${pricing.referenceCode})&body=Dear ${selectedLead.name},%0D%0A%0D%0AThank you for contacting Earth Smile. Here is your official commercial quotation for ${pricing.quantity} units of ${selectedLead.productName}:%0D%0A%0D%0A• Quotation Reference: ${pricing.referenceCode}%0D%0A• Batch Quantity: ${pricing.quantity} units%0D%0A• Wholesale Unit Rate: INR ${pricing.effectiveRate}/-%0D%0A• Grand Total Quotation Value: INR ${pricing.grandTotal.toLocaleString('en-IN')}%0D%0A• Production Timeline: ${pricing.dispatchTimeline}%0D%0A%0D%0ABest regards,%0D%0AEarth Smile Commercial Team`}
                    className="py-2.5 px-4 bg-[#192E22] hover:bg-[#254231] text-white font-semibold rounded-lg text-center flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Formal Email Quotation</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. Log Manual Client Requirement Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={e => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#FAF9F5] border border-[#E3E1D7] rounded-2xl w-full max-w-lg my-auto shadow-2xl overflow-hidden relative">
            <div className="bg-white border-b border-[#EAE9E1] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BD7B3C] font-semibold block">
                  Commercial Data Entry
                </span>
                <h2 className="font-serif text-xl font-bold text-[#192E22]">
                  Log New Client Requirement
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientData.name}
                    onChange={e => setNewClientData({ ...newClientData, name: e.target.value })}
                    placeholder="Client full name"
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientData.phone}
                    onChange={e => setNewClientData({ ...newClientData, phone: e.target.value })}
                    placeholder="Phone / WhatsApp number"
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={e => setNewClientData({ ...newClientData, email: e.target.value })}
                    placeholder="Client email address"
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Company / Clinic
                  </label>
                  <input
                    type="text"
                    value={newClientData.company}
                    onChange={e => setNewClientData({ ...newClientData, company: e.target.value })}
                    placeholder="Clinic or business name"
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Product Required
                  </label>
                  <select
                    value={newClientData.productName}
                    onChange={e => setNewClientData({ ...newClientData, productName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  >
                    <option value="Bamboo Toothbrush">Bamboo Toothbrush</option>
                    <option value="Bamboo Tongue Cleaner">Bamboo Tongue Cleaner</option>
                    <option value="Bamboo Dental Care Duo (Brush + Cleaner)">Bamboo Dental Care Duo (Brush + Cleaner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                    Required Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={20}
                    value={newClientData.quantity}
                    onChange={e => setNewClientData({ ...newClientData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newClientData.customBranding}
                    onChange={e => setNewClientData({ ...newClientData, customBranding: e.target.checked })}
                    className="rounded text-[#192E22] focus:ring-[#192E22]"
                  />
                  <span className="font-semibold text-stone-800 text-xs">
                    Client requires custom laser engraving on product
                  </span>
                </label>
                {newClientData.customBranding && (
                  <input
                    type="text"
                    value={newClientData.brandingDetails}
                    onChange={e => setNewClientData({ ...newClientData, brandingDetails: e.target.value })}
                    placeholder="Enter engraving text / logo specification"
                    className="w-full mt-2 px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                  Client Brief / Special Requirements
                </label>
                <textarea
                  rows={2}
                  value={newClientData.message}
                  onChange={e => setNewClientData({ ...newClientData, message: e.target.value })}
                  placeholder="Notes from the client regarding delivery deadlines, packaging, etc."
                  className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-[#192E22] uppercase tracking-wider mb-1">
                  Initial Admin Follow-up Note
                </label>
                <input
                  type="text"
                  value={newClientData.adminNotes}
                  onChange={e => setNewClientData({ ...newClientData, adminNotes: e.target.value })}
                  placeholder="Internal follow-up note"
                  className="w-full px-3 py-2 bg-white border border-[#DDD9CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#192E22] hover:bg-[#254231] text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Save Client Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
