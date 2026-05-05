import React, { useEffect, useState } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import api from '../../apis/axiosInstance';
import { toast } from 'sonner';
import { Upload, Copy, Check } from 'lucide-react';

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

  const fetchFiles = async () => {
    try {
      const res = await api.get('/images/list');
      setFiles(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const authRes = await api.get('/images/auth');
      const auth = authRes.data.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('publicKey', String(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY));
      formData.append('signature', auth.signature);
      formData.append('token', auth.token);
      formData.append('expire', String(auth.expire));
      formData.append('folder', '/visit-vagad/media');

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      
      toast.success('File uploaded successfully');
      fetchFiles();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminPageHeader 
          title="Media Library" 
          description="Manage and upload visual assets" 
        />
        <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
          <Upload size={18} />
          <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div key={file.fileId} className="group relative aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <img 
                src={file.thumbnailUrl} 
                alt={file.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button 
                  onClick={() => copyToClipboard(file.url, file.fileId)}
                  className="p-2 bg-white rounded-full text-gray-700 hover:bg-primary hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedId === file.fileId ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <p className="text-[10px] text-white font-medium px-2 text-center truncate w-full">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaPage;
