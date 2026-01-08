import React from 'react';

type LoaderProps = {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${sizeClasses[size]} rounded-full border-indigo-600 border-t-transparent animate-spin`}
            />
        </div>
    );
};

export default Loader;
