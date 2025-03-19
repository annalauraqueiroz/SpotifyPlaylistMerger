import React from "react";
import { mergePlaylists } from "../api";

const PlaylistMerger = ({ token, selectedPlaylists }) => {
    const handleMerge = async () => {
        if (selectedPlaylists.length < 2) {
            alert("Selecione pelo menos duas playlists para mesclar.");
            return;
        }
        const result = await mergePlaylists(token, selectedPlaylists);
        alert(`Playlist criada: ${result.name}`);
    };

    return (
        <div>
            <button onClick={handleMerge}>Mesclar Playlists</button>
        </div>
    );
};

export default PlaylistMerger;
