import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
    // Mock Categories Fallback
    const displayCategories = categories || [
        { categoryId: null, name: '전체' },
        { categoryId: 1, name: 'Special' },
        { categoryId: 2, name: 'People' },
        { categoryId: 3, name: 'Life' }
    ];

    return (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
            {displayCategories.map((category) => (
                <button
                    key={category.categoryId || 'all'}
                    onClick={() => onCategoryChange(category.categoryId)}
                    className={`
                        px-6 py-3 font-medium text-sm transition-all relative top-[2px] border-b-[3px]
                        ${(activeCategory === category.categoryId)
                            ? 'text-primary border-primary'
                            : 'text-secondary-medium border-transparent hover:text-primary'}
                    `}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
