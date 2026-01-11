import React, { useState, useRef } from 'react';
import { fileService } from '../../services/fileService';

const ImageUploader = ({ onUploadSuccess, category = 'common', className = '' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await uploadFile(file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (!file) return;
        await uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const uploadFile = async (file) => {
        // Validate
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setError(null);
        setUploading(true);

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        try {
            const data = await fileService.uploadFile(file, category);
            if (onUploadSuccess) {
                onUploadSuccess(data.url);
            }
        } catch (err) {
            console.error('Upload failed', err);
            setError('업로드에 실패했습니다. 다시 시도해주세요.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                {uploading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <span className="text-sm text-gray-500">업로드 중...</span>
                    </div>
                ) : preview ? (
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                            <span className="text-white text-sm font-medium">클릭하여 변경</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                            이미지를 드래그하거나 클릭하여 업로드
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
};

export default ImageUploader;
