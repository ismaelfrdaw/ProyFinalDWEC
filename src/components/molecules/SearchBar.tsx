import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../atoms/Input';
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
        <form onSubmit={handleSubmit} className="w-full max-w-3xl relative flex items-center">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full p-2.5 rounded-lg bg-gray-900/80 border border-gray-700 focus:outline-none focus:border-red-500 text-white"
            />
            <Button type="submit" variant="primary">
                {t.search.button}
            </Button>
        </form>
    );
};

export default SearchBar;
