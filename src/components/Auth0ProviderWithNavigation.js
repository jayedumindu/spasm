import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Auth0ProviderWithNavigation({ children }) {
  const navigate = useNavigate();

  const domain = "dev-snbwyi7z31co7yqt.us.auth0.com";
  const clientId = "Lukroc1eVy8beJUmNFS2Nq41UAkC3Erc";
  const redirectUri = window.location.origin;
  const BASE_URL = "http://127.0.0.1:6500";

  const onRedirectCallback = (appState, user) => {
    let data = {
      _id: user.email,
      avatar: user.picture,
      name: user.name,
    };
    axios.post(`${BASE_URL}/save/user`, data);
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithNavigation;
