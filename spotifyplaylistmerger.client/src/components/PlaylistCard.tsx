
import React from 'react';
import { Music, Check } from 'lucide-react';

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    image?: string;
  };
  isSelected: boolean;
  onToggle: (playlistId: string) => void;
  colorIndex: number;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ 
  playlist, 
  isSelected, 
  onToggle, 
  colorIndex 
}) => {
  const gradients = [
    'bg-playlist-1',
    'bg-playlist-2', 
    'bg-playlist-3',
    'bg-playlist-4',
    'bg-playlist-5',
    'bg-playlist-6'
  ];

  const gradient = gradients[colorIndex % gradients.length];

  return (
    <div
      onClick={() => onToggle(playlist.id)}
      className={`
        relative cursor-pointer group transition-all duration-300 transform
        ${isSelected ? 'scale-105' : 'hover:scale-102'}
        ${isSelected ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}
      `}
    >
      <div className={`
        ${gradient} rounded-xl p-4 h-24 flex flex-col justify-between
        border-3 transition-all duration-300 relative overflow-hidden
        ${isSelected ? 'border-white' : 'border-transparent'}
        ${isSelected ? 'animate-pulse-gentle' : ''}
      `}>
        {/* Imagem de capa como background, se existir */}
        {playlist.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${playlist.image})` }}
          />
        )}
        
        {/* Gradient overlay para garantir legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Header com ícone e check */}
        <div className="flex justify-between items-start relative z-10">
          <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
            <Music size={14} className="text-white" />
          </div>
          
          {isSelected && (
            <div className="p-1 bg-white rounded-full animate-bounce-gentle">
              <Check size={12} className="text-green-500" />
            </div>
          )}
        </div>

        {/* Nome da playlist com z-index para ficar acima do overlay */}
        <div className="mt-1 relative z-10">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
            {playlist.name}
          </h3>
        </div>

        {/* Overlay de seleção mais sutil */}
        {isSelected && (
          <div className="absolute inset-0 bg-white/3 rounded-xl backdrop-blur-sm transition-opacity duration-700" />
        )}
      </div>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default PlaylistCard;
