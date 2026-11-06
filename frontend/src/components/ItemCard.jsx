import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  ExternalLink,
  X
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=600&auto=format&fit=crop';

export default function ItemCard({ item, isOwner = false, onToggleClaim, onDelete, onEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

  const isLost = item.type === 'Lost';
  const isClaimed = item.status === 'Claimed';

  const dateObj = new Date(item.date || item.createdAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <>
      <div className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isClaimed 
          ? 'border-slate-200 opacity-80' 
          : 'border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5'
      }`}>
        
        {/* Card Header & Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={item.title}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm backdrop-blur-md ${
              isLost
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}>
              {item.type}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
              {item.category}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isClaimed ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Claimed
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                Active
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>

            <p className="mt-2 text-slate-600 text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Actions & Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Details
            </button>

            {isOwner && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleClaim(item)}
                  title={isClaimed ? "Mark as Active" : "Mark as Claimed"}
                  className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isClaimed
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(item)}
                  title="Edit Listing"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  title="Delete Listing"
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full bg-slate-100">
              <img
                src={imgSrc}
                alt={item.title}
                onError={() => setImgSrc(FALLBACK_IMAGE)}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                  isLost ? 'bg-rose-500' : 'bg-emerald-500'
                }`}>
                  {item.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-md">
                  {item.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                  isClaimed ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {item.location}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="mt-1 text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Contact Information Box */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Contact & Claim Instructions
                </h4>
                <p className="text-sm font-medium text-indigo-950">
                  {item.contactInfo}
                </p>
                {item.postedBy && (
                  <p className="text-xs text-indigo-700/80 pt-1 border-t border-indigo-200/60">
                    Reported by: <span className="font-semibold">{item.postedBy.name}</span> ({item.postedBy.email} • {item.postedBy.registrationNumber})
                  </p>
                )}
              </div>

              {/* Modal footer */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

