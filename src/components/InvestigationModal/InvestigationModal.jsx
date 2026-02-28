import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigations } from '../../hooks/useInvestigations';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal';

export default function InvestigationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { addInvestigation } = useInvestigations();
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newEntries = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].url);
      next.splice(index, 1);
      return next;
    });
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const imageUrls = images.map((img) => img.url);
    const id = addInvestigation(trimmed, imageUrls);
    setName('');
    setImages.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    onClose();
    navigate(`/investigation/${id}`);
  };

  const handleCancel = () => {
    setName('');
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-[420px] rounded-xl border border-slate-700/60 bg-slate-800 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-xl font-semibold text-slate-100">New Investigation</h2>

        <label className="mb-2 block text-sm font-medium text-slate-400">
          Investigation Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Downtown incident"
          className="mb-5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
          autoFocus
        />

        <div className="mb-6">
          <button
            type="button"
            className="rounded-lg border border-dashed border-slate-600 bg-slate-800/80 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
          />
          {images.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Preview ({images.length} {images.length === 1 ? 'image' : 'images'})
              </p>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div
                    key={`${img.url}-${i}`}
                    className="relative h-[88px] w-[88px] shrink-0"
                  >
                    <div
                      className="h-full w-full cursor-pointer overflow-hidden rounded-lg border border-slate-600 shadow-sm transition hover:border-slate-500"
                      onClick={() => setPreviewImage(img.url)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPreviewImage(img.url);
                        }
                      }}
                      aria-label={`Preview image ${i + 1}`}
                    >
                      <img
                        src={img.url}
                        alt={`Preview ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-105 hover:shadow-lg"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-red-500 text-sm font-medium text-white shadow-md transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      aria-label={`Remove image ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-600 bg-transparent px-5 py-2.5 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create Investigation
          </button>
        </div>
      </div>
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
