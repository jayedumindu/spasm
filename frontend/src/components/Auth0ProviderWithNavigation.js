import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Auth0ProviderWithNavigation({ children }) {
  const navigate = useNavigate();

  const domain = "dev-snbwyi7z31co7yqt.us.auth0.com";
  const clientId = "Lukroc1eVy8beJUmNFS2Nq41UAkC3Erc";
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  // console.log(domain);

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
