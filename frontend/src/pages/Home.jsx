import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ItemCard from '../components/ItemCard';
import { 
  Search, 
  Filter, 
  PackageSearch, 
  AlertCircle, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Documents & ID',
  'Accessories',
  'Books & Stationery',
  'Others',
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'Lost', 'Found'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active'); // 'All', 'Active', 'Claimed'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const response = await axiosInstance.get('/items', { params });
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Unable to load listings. Make sure the backend server is running.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleResetFilters = () => {
    setTypeFilter('All');
    setCategoryFilter('All');
    setStatusFilter('Active');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl shadow-indigo-950/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold tracking-wide border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            University Lost & Found Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Lost something on campus? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-300">
              Find it or report it here.
            </span>
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg leading-relaxed max-w-2xl">
            A centralized recovery directory for students & staff. Filter by campus block, category, or search items to connect with finders in seconds.
          </p>

          {/* Search bar inside hero */}
          <form onSubmit={handleSearchSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item name, location, or keyword..."
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 shadow-lg text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Search
            </button>
          </form>
        </div>

        {/* Ambient decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-72 h-72 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Filter Toolbar */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Top filter row: Type & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Type Toggle (All, Lost, Found) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['All', 'Lost', 'Found'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  typeFilter === t
                    ? t === 'Lost'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : t === 'Found'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'All' ? 'All Items' : t}
              </button>
            ))}
          </div>

          {/* Status Toggle (Active / Claimed / All) */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active Only</option>
              <option value="Claimed">Claimed Only</option>
              <option value="All">All Statuses</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 flex-shrink-0 mr-1">
            <Filter className="w-3 h-3" />
            Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </section>

      {/* Main Grid Feed */}
      <section>
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No items match your criteria</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms, changing the category filter, or check back later.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

