import React from 'react';
import { Music2, Sparkles } from 'lucide-react';
import { Progress } from './ui/progress';

interface MergePreloaderProps {
    progress: number;
    isVisible: boolean;
}

const MergePreloader: React.FC<MergePreloaderProps> = ({ progress, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Music2 className="text-white animate-wiggle" size={32} />
                        <Sparkles className="text-yellow-300 animate-bounce-gentle" size={24} />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">
                        Mesclando Playlists
                    </h3>
                    <p className="text-white/80 text-sm">
                        Criando sua playlist perfeita... ??
                    </p>
                </div>

                <div className="space-y-3">
                    <Progress value={progress} className="h-3 bg-white/20" />
                    <div className="flex justify-between text-white/60 text-xs">
                        <span>Processando...</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergePreloader;