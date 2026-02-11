import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
    const variants = {
        primary: "bg-red-900/50 text-red-200 border-red-700/50",
        secondary: "bg-gray-800 text-gray-300 border-gray-700",
        outline: "bg-transparent text-gray-400 border-gray-600",
        success: "bg-green-900/50 text-green-200 border-green-700/50",
        warning: "bg-yellow-900/50 text-yellow-200 border-yellow-700/50",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
            {children}
        </span>
    );
};

export default Badge;
