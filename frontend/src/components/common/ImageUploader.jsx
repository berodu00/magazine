import React, { useState, useRef } from 'react';
import { fileService } from '../../services/fileService';

const ImageUploader = ({ currentImage, onUploadSuccess, category = 'popups' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('파일 크기는 10MB 이하여야 합니다.');
            return;
        }

        try {
            setUploading(true);

            // Preview immediately
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload
            const result = await fileService.uploadFile(file, category);

            // Provide result to parent
            if (onUploadSuccess) {
                onUploadSuccess(result); // Expected: { fileName, filePath, ... }
            }

            // Update preview with server path if needed (or keep local)
            // setPreview(result.filePath); 
        } catch (error) {
            console.error('Upload failed:', error);
            alert('이미지 업로드에 실패했습니다.');
            setPreview(currentImage); // Revert
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden transition-colors ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
            >
                {preview ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100"
                            >
                                이미지 변경
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                            >
                                파일 선택
                            </button>
                            {' '}또는 드래그 앤 드롭
                        </p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};

export default ImageUploader;
