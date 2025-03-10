import React from "react";
import { loginWithSpotify } from "../api";

const Login = () => {
    return (
        <div>
            <h1>Spotify Playlist Merger</h1>
            <button onClick={loginWithSpotify}>Login com Spotify</button>
        </div>
    );
};

export default Login;
