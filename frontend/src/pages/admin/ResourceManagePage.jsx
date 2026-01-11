import React, { useState } from 'react';
import ImageUploader from '../../components/admin/ImageUploader';

const ResourceManagePage = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleUploadSuccess = (url) => {
        setUploadedFiles(prev => [{ url, id: Date.now() }, ...prev]);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('URL이 복사되었습니다: ' + text);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">리소스 관리</h1>

            <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">새 이미지 업로드</h2>
                <ImageUploader
                    category="resources"
                    onUploadSuccess={handleUploadSuccess}
                    className="max-w-xl mx-auto"
                />
            </div>

            {uploadedFiles.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">최근 업로드된 파일</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {uploadedFiles.map(file => (
                            <div key={file.id} className="group relative border border-gray-200 rounded-lg overflow-hidden">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                    <img
                                        src={file.url}
                                        alt="Uploaded resource"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-3 bg-white border-t border-gray-100">
                                    <input
                                        type="text"
                                        readOnly
                                        value={file.url}
                                        className="w-full text-xs text-gray-500 border-none bg-gray-50 rounded p-1 mb-2 truncate"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="w-full py-1 px-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                    >
                                        URL 복사
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceManagePage;
