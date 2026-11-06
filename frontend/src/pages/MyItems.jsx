import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ItemCard from '../components/ItemCard';
import { 
  Layers, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  PackageSearch 
} from 'lucide-react';

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Active', 'Claimed'

  const navigate = useNavigate();

  const fetchMyItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/items/user/me');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching user listings:', err);
      setError('Unable to fetch your listings. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleToggleClaim = async (item) => {
    const newStatus = item.status === 'Active' ? 'Claimed' : 'Active';
    try {
      const response = await axiosInstance.put(`/items/${item._id}`, {
        status: newStatus,
      });
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? response.data : it))
      );
    } catch (err) {
      console.error('Error toggling claim status:', err);
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (item) => {
    navigate(`/edit-item/${item._id}`);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/items/${itemId}`);
      setItems((prev) => prev.filter((it) => it._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete listing: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter items by tab
  const filteredItems = items.filter((item) => {
    if (activeTab === 'All') return true;
    return item.status === activeTab;
  });

  const totalCount = items.length;
  const activeCount = items.filter((i) => i.status === 'Active').length;
  const claimedCount = items.filter((i) => i.status === 'Claimed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Campus Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your reported lost and found items, update statuses, or remove resolved posts.
          </p>
        </div>

        <Link
          to="/post-item"
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all text-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Another Item
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</p>
            <p className="text-2xl font-black text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved / Claimed</p>
            <p className="text-2xl font-black text-amber-600">{claimedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Active', 'Claimed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab} Listings
          </button>
        ))}
      </div>

      {/* Content Area */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
              <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No {activeTab.toLowerCase()} listings found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't posted any items matching this tab yet.
          </p>
          <Link
            to="/post-item"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report an Item Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              isOwner={true}
              onToggleClaim={handleToggleClaim}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}

