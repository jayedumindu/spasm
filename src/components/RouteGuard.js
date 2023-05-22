import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import SplashScreen from "./SplashScreen";

function RouteGuard({ component }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <SplashScreen />
    ),
  });

  return <Component />;
}

export default RouteGuard;
