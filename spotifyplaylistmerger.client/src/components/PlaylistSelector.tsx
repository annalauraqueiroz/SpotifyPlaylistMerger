import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "../api";
import { Music2, Sparkles, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import PlaylistCard from './PlaylistCard';
import MergePreloader from './MergePreloader';
interface Playlist {
    id: string;
    name: string;
    image?: string;
}

interface PlaylistSelectorProps {
    token: string;
    selectedPlaylists: string[];
    onSelectionChange: (playlists: string[]) => void;
}
const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({
    token,
    selectedPlaylists = [],
    onSelectionChange
}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMerging, setIsMerging] = useState(false);
    const [mergeProgress, setMergeProgress] = useState(0);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const data = await getUserPlaylists(token);
                setPlaylists(data);
            } catch (error) {
                console.error('Erro ao carregar playlists:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchPlaylists();
        }
    }, [token, getUserPlaylists]);


    const handleTogglePlaylist = (playlistId: string) => {
        const updatedSelection = selectedPlaylists.includes(playlistId)
            ? selectedPlaylists.filter((id) => id !== playlistId)
            : [...selectedPlaylists, playlistId];

        onSelectionChange(updatedSelection);
    };

    const handleMergePlaylists = async () => {
        if (selectedPlaylists.length < 2) return;

        setIsMerging(true);
        setMergeProgress(0);

        // Simula o progresso do merge
        const progressInterval = setInterval(() => {
            setMergeProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        setIsMerging(false);
                        setMergeProgress(0);
                        console.log('Merge concluído para as playlists:', selectedPlaylists);
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-wiggle mb-4">
                        <Music2 size={48} className="text-white mx-auto" />
                    </div>
                    <p className="text-white text-xl font-medium">Carregando suas playlists...</p>
                </div>
            </div>
        );
    }

    //return (
    //    <div>
    //        <h2>Selecione as Playlists</h2>
    //        {playlists && playlists.length > 0 ? (
    //            playlists.map((playlist) => (
    //                <label key={playlist.id}>
    //                    <input
    //                        type="checkbox"
    //                        value={playlist.id}

    //                        onChange={() => handleChange(playlist.id)}
    //                    />
    //                    {playlist.name}
    //                </label>
    //            ))
    //        ) : (
    //            <p>Não há playlists disponíveis.</p> // Mensagem caso não existam playlists
    //        )}

    //    </div>
    //);
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="text-yellow-300 animate-bounce-gentle" size={32} />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Suas Playlists
                            </h1>
                            <Sparkles className="text-yellow-300 animate-bounce-gentle" size={32} />
                        </div>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                            Selecione as playlists que você quer sincronizar.
                            Toque nos cards para adicionar ou remover da seleção! 🎵
                        </p>
                    </div>

                    {/* Contador de selecionados e botão de merge */}
                    {selectedPlaylists && selectedPlaylists.length > 0 && (
                        <div className="text-center mb-6 space-y-4">
                            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                                <span className="text-white font-medium">
                                    {selectedPlaylists.length} playlist{selectedPlaylists.length > 1 ? 's' : ''} selecionada{selectedPlaylists.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            {selectedPlaylists.length >= 2 && (
                                <div>
                                    <Button
                                        onClick={handleMergePlaylists}
                                        disabled={isMerging}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                                    >
                                        <Shuffle className="mr-2" size={20} />
                                        Mesclar Playlists
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grid de playlists - ajustado para 6 colunas */}
                    {playlists && playlists.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {playlists.map((playlist, index) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={playlist}
                                    isSelected={selectedPlaylists.includes(playlist.id)}
                                    onToggle={handleTogglePlaylist}
                                    colorIndex={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
                                <Music2 size={64} className="text-white/60 mx-auto mb-4" />
                                <h3 className="text-white text-xl font-bold mb-2">
                                    Nenhuma playlist encontrada
                                </h3>
                                <p className="text-white/70">
                                    Parece que você ainda não tem playlists criadas.
                                    Que tal criar algumas primeiro? 🎶
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preloader de merge */}
            <MergePreloader progress={mergeProgress} isVisible={isMerging} />
        </>
    );
};

export default PlaylistSelector;
