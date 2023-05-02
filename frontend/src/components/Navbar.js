import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  //   let [isActive, setIsActive] = useState(false);

  const handleClick = (event) => {
    event.currentTarget.classList.add("nav-link-visited");
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? "nav-link-visited" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              isActive ? "nav-link-visited" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to={"/account"}
            className={({ isActive }) =>
              isActive ? "nav-link-visited" : "nav-link"
            }
          >
            Account
          </NavLink>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
