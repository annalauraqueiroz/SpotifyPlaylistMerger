import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "../api";

const PlaylistSelector = ({ token, onSelectionChange }) => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const data = await getUserPlaylists(token);
            setPlaylists(data);
        };
        fetchPlaylists();
    }, [token]);

    const handleChange = (playlistId) => {
        onSelectionChange((prevSelected) =>
            prevSelected.includes(playlistId)
                ? prevSelected.filter((id) => id !== playlistId)
                : [...prevSelected, playlistId]
        );
    };

    return (
        <div>
            <h2>Selecione as Playlists</h2>
            {playlists && playlists.length > 0 ? ( 
                playlists.map((playlist) => (
                    <label key={playlist.id}>
                        <input
                            type="checkbox"
                            value={playlist.id}
                            
                            onChange={() => handleChange(playlist.id)}
                        />
                        {playlist.name}
                    </label>
                ))
            ) : (
                <p>N�o h� playlists dispon�veis.</p> // Mensagem caso n�o existam playlists
            )}

        </div>
    );
};

export default PlaylistSelector;
