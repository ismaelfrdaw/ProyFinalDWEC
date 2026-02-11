import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { useLanguage } from '../../context/LanguageContext';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative flex items-center gap-3">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full p-2.5 rounded-lg bg-gray-900/80 border border-gray-700 focus:outline-none focus:border-red-600 text-white placeholder-gray-500 shadow-inner"
            />
            <Button type="submit" variant="primary" className="shadow-lg shadow-red-900/20">
                {t.search.button}
            </Button>
        </form>
    );
};

export default SearchBar;
