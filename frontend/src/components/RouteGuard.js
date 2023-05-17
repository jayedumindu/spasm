import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

function RouteGuard({ component }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <h1>Loading..............</h1>
      </div>
    ),
  });

  return <Component />;
}

export default RouteGuard;
