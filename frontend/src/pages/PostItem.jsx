import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Tag, 
  Image as ImageIcon, 
  Phone, 
  AlertCircle,
  FileText 
} from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Documents & ID',
  'Accessories',
  'Books & Stationery',
  'Others',
];

export default function PostItem() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    contactInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/items', formData);
      navigate('/my-items');
    } catch (err) {
      console.error('Post item error:', err);
      setError(err.response?.data?.message || 'Failed to submit report. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            New Campus Listing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Report a Lost or Found Item
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide accurate details so other students or finders can recognize and return it swiftly.
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
          
          {/* Item Type Toggle (Lost vs Found) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Listing Type
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Lost' })}
                className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'Lost'
                    ? 'border-rose-500 bg-rose-50/80 text-rose-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Found' })}
                className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'Found'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                I Found Something
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Item Title / Name *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Space Gray MacBook Pro 14-inch or Blue Spiral Notebook"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Category & Date Grid */}
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
                Date Lost / Found *
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
              placeholder="e.g. Central Library - 2nd Floor Reading Room or Science Complex Block B"
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
              placeholder="Provide distinguishing features, stickers, serial prefixes, case color, contents, etc."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg (Direct image link)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
            {formData.image && (
              <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-xs">
                <p className="text-[11px] font-semibold text-slate-500 mb-1">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="rounded-lg h-32 w-full object-cover"
                />
              </div>
            )}
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
              placeholder="e.g. Phone: +1 555-0199 or Room 304, Hall 2"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
            <p className="text-xs text-slate-400 mt-1">
              This info is visible to users viewing your post details so they can reach you.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Publish Listing
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

