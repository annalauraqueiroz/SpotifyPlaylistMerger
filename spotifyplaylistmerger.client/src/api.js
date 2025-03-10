import axios from "axios";
    
const API_URL = "https://localhost:7286/api"; // Backend /SpotifyAuth/login

export const loginWithSpotify = () => {
    window.location.href = `${API_URL}/SpotifyAuth/login`;
};

export const getUserPlaylists = async (token) => {
    const response = await axios.get(`${API_URL}/SpotifyData/playlists`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.items;
};

export const mergePlaylists = async (token, selectedPlaylists) => {
    const response = await axios.post(
        `${API_URL}/SpotifyData/merge`,
        { playlists: selectedPlaylists },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};


export const getAccessToken = async (code) => {
    try {
        const response = await fetch(`${API_URL}/spotifyauth/callback?code=${code}`);
        const data = await response.json();

        if (data.access_token) {
            return data.access_token; 
        } else {
            throw new Error("Falha ao obter o token de acesso");
        }
    } catch (error) {
        console.error("Erro ao fazer a requisição ao backend", error);
        throw error; 
    }
};
