import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function EditorHeroPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = () => {
    navigate(user ? '/dashboard' : '/signup?redirect=/dashboard');
  };

  return (
    <div
      onClick={handleAction}
      className="w-full bg-white text-gray-900 select-none cursor-pointer flex flex-col font-sans overflow-hidden group"
    >
      <div className="relative w-full overflow-hidden">
        <img
          src="/images/cvarchitect hero.webp"
          alt="Create Resume Editor Preview"
          loading="eager"
          className="w-full h-auto object-cover object-top transition-transform duration-300 group-hover:scale-[1.003]"
        />
      </div>
    </div>
  );
}
