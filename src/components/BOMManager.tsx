import React, { useState, useEffect } from 'react';
import { 
  Box, Plus, Trash2, Edit2, Check, X, Download, RefreshCw, 
  DollarSign, Package, ShoppingCart, Tag, ExternalLink, 
  AlertCircle, ChevronDown, CheckCircle, Clock, Calendar, AlertTriangle
} from 'lucide-react';

interface BOMItem {
  id: string;
  name: string;
  category: 'Structure' | 'Motion' | 'Control' | 'Fasteners' | 'Electronics' | 'Other';
  supplier: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  status: 'Arrived' | 'Ordered' | 'Planned';
  notes?: string;
}

const DEFAULT_BOM: BOMItem[] = [
  { id: '1', name: 'goBILDA Strafer Chassis Kit V5', category: 'Motion', supplier: 'goBILDA', partNumber: '1120-0002-0005', quantity: 1, unitPrice: 349.99, status: 'Arrived', notes: 'Main mecanum drivetrain structure.' },
  { id: '2', name: 'REV Control Hub', category: 'Electronics', supplier: 'REV Robotics', partNumber: 'REV-31-1595', quantity: 1, unitPrice: 360.00, status: 'Arrived', notes: 'Primary robot controller with Android onboard.' },
  { id: '3', name: 'REV Expansion Hub', category: 'Electronics', supplier: 'REV Robotics', partNumber: 'REV-31-1153', quantity: 1, unitPrice: 190.00, status: 'Planned', notes: 'Secondary expansion module.' },
  { id: '4', name: 'goBILDA 312 RPM Yellow Jacket Motor', category: 'Motion', supplier: 'goBILDA', partNumber: '5203-2402-0312', quantity: 4, unitPrice: 39.99, status: 'Arrived', notes: 'Main drive motors, high speed/torque.' },
  { id: '5', name: 'Pinpoint Odometry Computer', category: 'Control', supplier: 'goBILDA', partNumber: '1210-0001-0001', quantity: 1, unitPrice: 110.00, status: 'Ordered', notes: 'Extremely accurate displacement coordinates.' },
  { id: '6', name: 'REV Driver Hub', category: 'Electronics', supplier: 'REV Robotics', partNumber: 'REV-31-1596', quantity: 1, unitPrice: 175.00, status: 'Arrived', notes: 'Controller station for team drivers.' },
  { id: '7', name: 'goBILDA Viper Slide Kit (3-Stage)', category: 'Structure', supplier: 'goBILDA', partNumber: '1140-0006-0003', quantity: 2, unitPrice: 129.99, status: 'Ordered', notes: 'Cascading lifts for cascading bucket module.' },
  { id: '8', name: 'Axon MAX Ultra Servo', category: 'Motion', supplier: 'Axon', partNumber: 'AX-MAX-UL', quantity: 3, unitPrice: 84.99, status: 'Planned', notes: 'Ultra torque servos for intake/pivot joint.' },
  { id: '9', name: 'Custom Carbon Fiber Intake Plates', category: 'Structure', supplier: 'SendCutSend', partNumber: 'CF-INTK-02', quantity: 2, unitPrice: 45.00, status: 'Planned', notes: 'Laser-cut custom plates for active roller grab.' },
  { id: '10', name: 'Fasteners & Spacers Multipack', category: 'Fasteners', supplier: 'McMASTER-CARR', partNumber: '91292A110', quantity: 3, unitPrice: 29.95, status: 'Arrived', notes: 'M4 steel hex screws and nylon spacers.' }
];

export default function BOMManager() {
  const [items, setItems] = useState<BOMItem[]>(() => {
    const saved = localStorage.getItem('vortex_bom');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing component states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<BOMItem['category']>('Structure');
  const [formSupplier, setFormSupplier] = useState('');
  const [formPartNumber, setFormPartNumber] = useState('');
  const [formQuantity, setFormQuantity] = useState<string | number>('');
  const [formUnitPrice, setFormUnitPrice] = useState<string | number>('');
  const [formStatus, setFormStatus] = useState<BOMItem['status']>('Planned');
  const [formNotes, setFormNotes] = useState('');

  // Persist to localstorage on change
  useEffect(() => {
    localStorage.setItem('vortex_bom', JSON.stringify(items));
  }, [items]);

  const resetForm = () => {
    setFormName('');
    setFormCategory('Structure');
    setFormSupplier('');
    setFormPartNumber('');
    setFormQuantity('');
    setFormUnitPrice('');
    setFormStatus('Planned');
    setFormNotes('');
    setEditingId(null);
    setIsAdding(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedQty = typeof formQuantity === 'number' ? formQuantity : parseInt(formQuantity);
    const parsedPrice = typeof formUnitPrice === 'number' ? formUnitPrice : parseFloat(formUnitPrice);

    const newItem: BOMItem = {
      id: Date.now().toString(),
      name: formName.trim(),
      category: formCategory,
      supplier: formSupplier.trim() || 'N/A',
      partNumber: formPartNumber.trim() || 'N/A',
      quantity: isNaN(parsedQty) ? 1 : Math.max(1, parsedQty),
      unitPrice: isNaN(parsedPrice) ? 0 : Math.max(0, parsedPrice),
      status: formStatus,
      notes: formNotes.trim()
    };

    setItems(prev => [newItem, ...prev]);
    resetForm();
  };

  const handleStartEdit = (item: BOMItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSupplier(item.supplier);
    setFormPartNumber(item.partNumber);
    setFormQuantity(item.quantity);
    setFormUnitPrice(item.unitPrice);
    setFormStatus(item.status);
    setFormNotes(item.notes || '');
    setIsAdding(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formName.trim()) return;

    const parsedQty = typeof formQuantity === 'number' ? formQuantity : parseInt(formQuantity);
    const parsedPrice = typeof formUnitPrice === 'number' ? formUnitPrice : parseFloat(formUnitPrice);

    setItems(prev => prev.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          name: formName.trim(),
          category: formCategory,
          supplier: formSupplier.trim() || 'N/A',
          partNumber: formPartNumber.trim() || 'N/A',
          quantity: isNaN(parsedQty) ? 1 : Math.max(1, parsedQty),
          unitPrice: isNaN(parsedPrice) ? 0 : Math.max(0, parsedPrice),
          status: formStatus,
          notes: formNotes.trim()
        };
      }
      return item;
    }));

    resetForm();
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_BOM);
  };

  const handleClearAll = () => {
    setItems([]);
  };

  // Mathematical statistical aggregations
  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalPartsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const costByStatus = {
    Arrived: items.filter(i => i.status === 'Arrived').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Ordered: items.filter(i => i.status === 'Ordered').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Planned: items.filter(i => i.status === 'Planned').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
  };

  const costByCategory = {
    Structure: items.filter(i => i.category === 'Structure').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Motion: items.filter(i => i.category === 'Motion').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Control: items.filter(i => i.category === 'Control').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Fasteners: items.filter(i => i.category === 'Fasteners').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Electronics: items.filter(i => i.category === 'Electronics').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
    Other: items.filter(i => i.category === 'Other').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesStatus = activeStatus === 'All' || item.status === activeStatus;
    const matchesQuery = searchQuery.trim() === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesQuery;
  });

  const exportCSV = () => {
    const headers = ['Part Name', 'Category', 'Supplier', 'Part Number', 'Quantity', 'Unit Cost ($)', 'Total Cost ($)', 'Status', 'Notes'];
    const rows = items.map(item => [
      `"${item.name}"`,
      item.category,
      `"${item.supplier}"`,
      `"${item.partNumber}"`,
      item.quantity,
      item.unitPrice.toFixed(2),
      (item.quantity * item.unitPrice).toFixed(2),
      item.status,
      `"${item.notes || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Vortex_FTC_Robot_BOM.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 flex flex-col gap-10" id="bom-page-view animate-fadeIn">
      
      {/* Title block */}
      <div className="border-b border-[var(--border)] pb-8 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-1">Budget Tracker</span>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] uppercase">Bill of Materials (BOM)</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl">
            Model, calculate, and review our official competition parts checklist. Fully customizable planner with structural expense distributions.
          </p>
        </div>
        
        {/* Actions buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-2 text-xs font-bold uppercase text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--text-primary)] transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Load Default Parts</span>
          </button>

          <button 
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-2 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </button>
          
          <button 
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-2 text-xs font-bold uppercase text-[var(--btn-text)] hover:opacity-90 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* STATS DECK */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 text-left flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-secondary)]">Total Expenses</span>
            <DollarSign className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[var(--text-primary)]">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Budget limit: $10,000 FTC cap</div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 text-left flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-secondary)]">Unique Components</span>
            <Package className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[var(--text-primary)]">{items.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Total part count: {totalPartsCount} units</div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 text-left flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-secondary)]">Arrived & Spent</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-400">${costByStatus.Arrived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{items.filter(i => i.status === 'Arrived').length} parts received</div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 text-left flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-secondary)]">On Order / Planned</span>
            <ShoppingCart className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-500">${(costByStatus.Ordered + costByStatus.Planned).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ordered: ${costByStatus.Ordered.toFixed(2)} | Planned: ${costByStatus.Planned.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* DYNAMIC GRAPHS GRID (Bespoke SVGs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category breakdown visual bar */}
        <div className="lg:col-span-7 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 text-left flex flex-col gap-5 justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Expense Distribution by Category</h4>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">Numerical allocation percentages of available budget assets.</p>
          </div>

          <div className="flex flex-col gap-3.5">
            {Object.entries(costByCategory).map(([cat, amount]) => {
              const percent = totalCost > 0 ? (amount / totalCost) * 100 : 0;
              const barColors: Record<string, string> = {
                Structure: 'bg-indigo-500 shadow-indigo-500/10',
                Motion: 'bg-cyan-500 shadow-cyan-500/10',
                Control: 'bg-emerald-500 shadow-emerald-500/10',
                Fasteners: 'bg-amber-500 shadow-amber-500/10',
                Electronics: 'bg-rose-500 shadow-rose-500/10',
                Other: 'bg-slate-500 shadow-slate-500/10'
              };

              return (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="font-bold text-[var(--text-primary)] uppercase tracking-tight">{cat}</span>
                    <span className="font-mono text-[var(--text-secondary)]">
                      ${amount.toFixed(2)} <span className="font-bold text-[var(--accent)] ml-1">({percent.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border)]/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${barColors[cat] || 'bg-slate-550'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget efficiency donuts visual */}
        <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 text-left flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Acquisition Status Indicators</h4>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">Fulfillment status of custom designs and commercial components.</p>
          </div>

          <div className="flex items-center justify-center py-4 relative">
            {/* SVG Ring Segment calculations of statuses */}
            {(() => {
              const arrP = totalCost > 0 ? (costByStatus.Arrived / totalCost) * 100 : 0;
              const ordP = totalCost > 0 ? (costByStatus.Ordered / totalCost) * 100 : 0;
              const plaP = totalCost > 0 ? (costByStatus.Planned / totalCost) * 100 : 0;

              // Circumference is 2 * PI * r = 2 * 3.1415 * 50 = 314.15
              const circ = 314.16;
              const strokeArr = (arrP / 100) * circ;
              const strokeOrd = (ordP / 100) * circ;
              const strokePla = (plaP / 100) * circ;

              return (
                <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-around">
                  <div className="relative h-32 w-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Base Track */}
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="8" className="opacity-30" />
                      
                      {/* Planned segment */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="8" 
                        strokeDasharray={`${strokePla} ${circ}`} 
                        strokeDashoffset="0"
                        className="transition-all duration-1000"
                      />
                      {/* Ordered segment */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="8" 
                        strokeDasharray={`${strokeOrd} ${circ}`} 
                        strokeDashoffset={`-${strokePla}`} 
                        className="transition-all duration-1000"
                      />
                      {/* Arrived segment */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="8" 
                        strokeDasharray={`${strokeArr} ${circ}`} 
                        strokeDashoffset={`-${strokePla + strokeOrd}`} 
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Arrived</span>
                      <span className="text-md font-black text-emerald-400">{arrP.toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Status Legend */}
                  <div className="flex flex-col gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                      <span className="font-bold text-[var(--text-primary)]">Arrived:</span>
                      <span className="text-[var(--text-secondary)] font-mono">${costByStatus.Arrived.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0" />
                      <span className="font-bold text-[var(--text-primary)]">Ordered:</span>
                      <span className="text-[var(--text-secondary)] font-mono">${costByStatus.Ordered.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0" />
                      <span className="font-bold text-[var(--text-primary)]">Planned:</span>
                      <span className="text-[var(--text-secondary)] font-mono">${costByStatus.Planned.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

      </div>

      {/* FILTER & INTERACTIVE DATATABLE segment */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl pt-6 flex flex-col gap-4 overflow-hidden">
        
        {/* Search and Filters Header */}
        <div className="px-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <h4 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Custom Parts Catalogue</h4>
            <span className="text-[10px] text-[var(--text-secondary)] font-medium">Create models, track arrivals, and filter dimensions.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Search bar */}
            <input 
              type="text" 
              placeholder="Search components or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition duration-150 min-w-[200px]"
            />

            {/* Filter Category selection dropdown */}
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition duration-150"
            >
              <option value="All">All Categories</option>
              <option value="Structure">Structure</option>
              <option value="Motion">Motion</option>
              <option value="Control">Control</option>
              <option value="Fasteners">Fasteners</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>

            {/* Filter Status */}
            <select 
              value={activeStatus} 
              onChange={(e) => setActiveStatus(e.target.value)}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition duration-150"
            >
              <option value="All">All Statuses</option>
              <option value="Arrived">Arrived</option>
              <option value="Ordered">Ordered</option>
              <option value="Planned">Planned</option>
            </select>

            {/* Add Part button */}
            {!isAdding && (
              <button 
                onClick={() => {
                  resetForm();
                  setIsAdding(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--btn-text)] hover:opacity-90 transition active:scale-97 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Part</span>
              </button>
            )}
          </div>
        </div>

        {/* Form panel for Add/Edit Part */}
        {isAdding && (
          <form 
            onSubmit={editingId ? handleUpdate : handleCreate}
            className="m-6 p-5 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-primary)]/40 flex flex-col gap-4 animate-scaleIn text-left text-xs"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-3">
              <span className="font-extrabold text-[var(--accent)] uppercase tracking-wider flex items-center gap-1.5">
                <Box className="h-4 w-4" />
                {editingId ? 'Edit Selected BOM Component' : 'Add New Custom Component'}
              </span>
              <button 
                type="button" 
                onClick={resetForm}
                className="p-1 text-[var(--text-secondary)] hover:text-rose-500 rounded-full transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Item/Part Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mecanum Wheels v5"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Category</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as BOMItem['category'])}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                >
                  <option value="Structure">Structure</option>
                  <option value="Motion">Motion</option>
                  <option value="Control">Control</option>
                  <option value="Fasteners">Fasteners</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Supplier</label>
                <input 
                  type="text" 
                  placeholder="e.g. goBILDA, REV Robotics"
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Product ID / Part Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 5202-0002-0001"
                  value={formPartNumber}
                  onChange={(e) => setFormPartNumber(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Quantity Required *</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="1"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Unit Cost ($ USD) *</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formUnitPrice}
                  onChange={(e) => setFormUnitPrice(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Shipping/Fulfillment Status</label>
                <select 
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as BOMItem['status'])}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                >
                  <option value="Planned">Planned (To Acquire)</option>
                  <option value="Ordered">Ordered (In Transit)</option>
                  <option value="Arrived">Arrived (On Hand)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-bold text-[var(--text-secondary)] uppercase text-[9px] tracking-wider">Brief Component Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Need to tap these threaded hulls, check mounting spacing"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-[var(--border)]/40">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[var(--accent)] text-xs font-bold uppercase text-[var(--btn-text)] rounded-full hover:opacity-90 transition shadow-sm cursor-pointer"
              >
                {editingId ? 'Modify Record' : 'Record Component'}
              </button>
            </div>
          </form>
        )}

        {/* Actual Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-[var(--border)] border-b bg-[var(--bg-primary)]/40 text-[10px] uppercase font-extrabold tracking-widest text-[var(--text-secondary)]">
                <th className="py-3 px-6">Part Information</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Supplier / ID</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total Price</th>
                <th className="py-3 px-4 text-center">Acquisitions</th>
                <th className="py-3 px-6 text-center">Settings</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans border-b border-[var(--border)]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-bold">No components matched criteria</span>
                      <span className="text-[10px]">Try resetting search guidelines or active categories filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const itemTotal = item.quantity * item.unitPrice;
                  
                  const catBadges: Record<string, string> = {
                    Structure: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
                    Motion: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
                    Control: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                    Fasteners: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                    Electronics: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                    Other: 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  };

                  return (
                    <tr 
                      key={item.id} 
                      className="border-b border-[var(--border)]/40 hover:bg-[var(--accent)]/5 transition font-sans items-center"
                    >
                      <td className="py-3.5 px-6 min-w-[220px]">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-[var(--text-primary)] text-sm">{item.name}</span>
                          {item.notes && <span className="text-[10px] text-slate-500 font-normal mt-0.5 max-w-xs line-clamp-1">{item.notes}</span>}
                        </div>
                      </td>
                      
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase inline-block ${catBadges[item.category] || 'bg-slate-500/10 text-slate-400'}`}>
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-slate-450">{item.supplier}</span>
                          <span className="font-mono text-[9px] text-slate-500">{item.partNumber}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-[var(--text-primary)]">
                        {item.quantity}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[var(--text-secondary)]">
                        ${item.unitPrice.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[var(--text-primary)]">
                        ${itemTotal.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {item.status === 'Arrived' ? (
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Arrived</span>
                          </div>
                        ) : item.status === 'Ordered' ? (
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Ordered</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Planned</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-6 table-cell">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleStartEdit(item)}
                            className="p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] hover:border-cyan-500 hover:text-cyan-400 text-slate-500 transition"
                            title="Edit Record"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] hover:border-rose-500 hover:text-rose-500 text-slate-500 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Total stats bar print footer */}
        <div className="p-4 px-6 bg-[var(--bg-primary)]/40 border-t border-[var(--border)]/60 text-right text-[11px] text-[var(--text-secondary)] font-sans">
          Showing {filteredItems.length} of {items.length} component listings. All financial models are logged in real-time.
        </div>
      </div>
    </div>
  );
}
