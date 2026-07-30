
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#E8DDE2] rounded-[32px] bg-[#FFF7F9] hover:bg-white hover:border-[#7FB7A6] transition-all cursor-pointer group"
         onClick={() => fileInputRef.current?.click()}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,application/pdf"
      />
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#4A6FA5] shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-2xl`}></i>
      </div>
      <p className="text-[#1F2933] font-bold tracking-tight">Cargar archivos o multimedia</p>
      <p className="text-[#5F6C7B] text-xs font-medium mt-1">Fotos, videos o documentos (Max. 50MB)</p>
      
      <div className="flex gap-4 mt-6">
        <div className="flex items-center gap-2 text-[#7FB7A6] text-[10px] font-black uppercase tracking-widest">
          <i className="fas fa-camera"></i> Cámara
        </div>
        <div className="flex items-center gap-2 text-[#4A6FA5] text-[10px] font-black uppercase tracking-widest">
          <i className="fas fa-video"></i> Video
        </div>
        <div className="flex items-center gap-2 text-[#5F6C7B] text-[10px] font-black uppercase tracking-widest">
          <i className="fas fa-file-pdf"></i> PDF
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
