import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-12 mt-auto">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Korea Zinc</h3>
                        <p className="text-sm text-gray-500">
                            서울특별시 강남구 강남대로 542 (논현동, 영풍빌딩)<br />
                            Tel: 02-519-3416
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2026 Korea Zinc. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
