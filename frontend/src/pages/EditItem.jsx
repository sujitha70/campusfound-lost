import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Tag, 
  Image as ImageIcon, 
  Phone, 
  AlertCircle,
  FileText,
  CheckCircle2 
} from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Documents & ID',
  'Accessories',
  'Books & Stationery',
  'Others',
];

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: '',
    image: '',
    contactInfo: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`/items/${id}`);
        const item = response.data;

        // Ensure owner match
        if (item.postedBy?._id && user && item.postedBy._id !== user._id) {
          setError('You are not authorized to edit this listing.');
          return;
        }

        setFormData({
          title: item.title || '',
          type: item.type || 'Lost',
          category: item.category || 'Electronics',
          description: item.description || '',
          location: item.location || '',
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          image: item.image || '',
          contactInfo: item.contactInfo || '',
          status: item.status || 'Active',
        });
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Could not retrieve item data.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axiosInstance.put(`/items/${id}`, formData);
      navigate('/my-items');
    } catch (err) {
      console.error('Update item error:', err);
      setError(err.response?.data?.message || 'Failed to update item listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Listing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Update Listing Details
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Modify description, update contact channels, or mark the item as claimed.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Status & Type Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Listing Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Active' })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.status === 'Active'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Claimed' })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    formData.status === 'Claimed'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Claimed
                </button>
              </div>
            </div>

            {/* Type Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Lost' })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.type === 'Lost'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Found' })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.type === 'Found'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Campus Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Detailed Description *
            </label>
            <textarea
              name="description"
              rows={4}
              required
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              Contact Information *
            </label>
            <input
              type="text"
              name="contactInfo"
              required
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-items')}
              className="px-5 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 text-sm"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

