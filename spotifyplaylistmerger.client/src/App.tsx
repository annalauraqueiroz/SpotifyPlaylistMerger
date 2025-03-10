import React, { useState } from "react";
import Login from "./components/Login";
import PlaylistSelector from "./components/PlaylistSelector";
import PlaylistMerger from "./components/PlaylistMerger";
import { getAccessToken } from "./api";
import Preloader from "./components/Preloader";

function App() {
    const [token, setToken] = useState<string | null>(null);
    const [selectedPlaylists, setSelectedPlaylists] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pega o token do Spotify após o login
    React.useEffect(() => {
        setIsLoading(true);
        setError(null);

        const urlParams = new URLSearchParams(window.location.search); 
        const code = urlParams.get("code");

        if (code) {
            // Chama o backend para trocar o código por um token
            getAccessToken(code)
                .then((accessToken) => {
                    setToken(accessToken); // Armazena o token de acesso
                    window.history.replaceState({}, document.title, window.location.pathname); // Limpa o código da URL
                })
                .catch((error) => {
                    console.error("Erro ao obter o token de acesso", error.message);
                    setError(error);
                }).finally(() => {
                    setIsLoading(false); 
                });
        } else {
            setIsLoading(false); 
        }

    }, []);

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            {error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : !token ? (
                <Login />
            ) : (
                <>
                    <PlaylistSelector
                        token={token}
                        onSelectionChange={setSelectedPlaylists}
                    />
                    <PlaylistMerger token={token} selectedPlaylists={selectedPlaylists} />
                </>
            )}
        </div>
        
    );
}

export default App;
