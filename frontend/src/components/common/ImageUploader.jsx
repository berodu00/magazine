import React, { useState, useRef } from 'react';
import { fileService } from '../../services/fileService';

const ImageUploader = ({ currentImage, onUploadSuccess, category = 'popups' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = async (file) => {
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
                onUploadSuccess(result);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('이미지 업로드에 실패했습니다.');
            setPreview(currentImage); // Revert
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        await processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden transition-all duration-200 ${isDragging
                        ? 'bg-blue-50 border-blue-400 scale-[1.02]'
                        : uploading
                            ? 'bg-gray-50 border-gray-300'
                            : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                        {isDragging ? (
                            <>
                                <div className="mx-auto h-12 w-12 text-blue-500 mb-2">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <p className="text-blue-600 font-medium">여기에 드롭하세요!</p>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
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

