import React, { useEffect, useState, useRef } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { toast } from 'sonner';
import { Upload, Copy, Check, X, FileText, ImageIcon, Trash2 } from 'lucide-react';

interface MediaFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
}

const MediaPage: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Naming Modal State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ id: string, name: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/images/list');
      const fileData = (res.data.data || []).filter((f: any) => f.type !== 'folder');
      setFiles(fileData);
    } catch (error) {
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter and Sort Logic
  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date((a as any).createdAt || 0).getTime();
      const dateB = new Date((b as any).createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setCustomName(file.name.split('.')[0]);
    setPreviewUrl(URL.createObjectURL(file));
    setShowModal(true);
    e.target.value = '';
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setShowModal(false);

    try {
      const authRes = await api.get('/images/auth');
      const auth = authRes.data.data;

      const formData = new FormData();
      formData.append('file', selectedFile);

      const finalName = customName.trim()
        ? `${customName.trim()}.${selectedFile.name.split('.').pop()}`
        : selectedFile.name;

      formData.append('fileName', finalName);
      formData.append('publicKey', String(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY));
      formData.append('signature', auth.signature);
      formData.append('token', auth.token);
      formData.append('expire', String(auth.expire));
      formData.append('folder', '/visit-vagad/media');
      formData.append('useUniqueFileName', 'true');

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      toast.success(`'${finalName}' uploaded successfully`);
      setTimeout(() => fetchFiles(), 1000);
    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCustomName('');
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    // Append a cache-buster if needed for copied URLs? No, usually direct is better.
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDeleteModal = (id: string, name: string) => {
    setFileToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      await api.delete(`/images/${fileToDelete.id}`);
      setFiles(prev => prev.filter(f => f.fileId !== fileToDelete.id));
      toast.success(`'${fileToDelete.name}' deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete file');
      fetchFiles();
    } finally {
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <AdminPageHeader
          title="Media Library"
          description="Manage and upload visual assets for destinations, hotels, and stories."
        />
        <label className="group relative cursor-pointer bg-primary text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap">
          <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          <span>{uploading ? 'Processing...' : 'Upload Media'}</span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
            accept="image/*"
          />
        </label>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface-container-lowest p-4 rounded-[32px] border border-outline-variant/10 shadow-sm">
        <div className="flex-1 relative group">
          <Check size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-2xl border border-outline-variant/5">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortOrder === 'newest' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:text-on-surface'}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortOrder === 'oldest' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:text-on-surface'}`}
          >
            Oldest
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-surface-container-low animate-pulse rounded-3xl border border-outline-variant/10"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.fileId} className="group relative aspect-square bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                {file.thumbnailUrl ? (
                  <img 
                    src={`${file.thumbnailUrl}?tr=w-400,h-400&v=${new Date().getTime()}`} 

                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Preview';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-on-surface/20">
                    <ImageIcon size={40} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">No Preview</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(file.url, file.fileId)}
                    className="w-10 h-10 bg-white rounded-xl text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg active:scale-90"
                    title="Copy Direct URL"
                  >
                    {copiedId === file.fileId ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={() => openDeleteModal(file.fileId, file.name)}
                    className="w-10 h-10 bg-white rounded-xl text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90"
                    title="Delete Image"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-white font-bold tracking-wider uppercase text-center truncate w-full px-2">
                  {file.name}
                </p>
                <p className="text-[8px] text-white/60 font-medium">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- UPLOAD NAMING MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-[40px] shadow-2xl shadow-on-surface/10 border border-outline-variant/10 overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="text-xl font-epilogue font-bold text-on-surface">New Asset</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X size={20} className="text-on-surface/40" />
                </button>
              </div>

              {/* Preview */}
              <div className="aspect-video w-full rounded-3xl overflow-hidden border border-outline-variant/10 bg-surface-container-low">
                {previewUrl && <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 px-1">
                  Custom Filename (Optional)
                </label>
                <div className="relative group">
                  <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter file name..."
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-on-surface/30 px-1">
                  Extension will be added automatically.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-outline-variant/20 text-on-surface/60 hover:bg-surface-container-low transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpload}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />

          <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-[40px] shadow-2xl shadow-on-surface/20 border border-outline-variant/10 overflow-hidden">
            <div className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-epilogue font-bold text-on-surface">Delete Asset?</h3>
                <p className="text-sm text-on-surface/60 px-4">
                  Are you sure you want to delete <span className="font-bold text-on-surface">'{fileToDelete?.name}'</span>? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                >
                  Permanently Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-on-surface/40 hover:bg-surface-container-low transition-all"
                >
                  Keep Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
