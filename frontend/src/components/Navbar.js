import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Fade,
  Popper,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Clock from "./Clock";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth0, User } from "@auth0/auth0-react";
import logo from "../assets/images/spasm-high-resolution-logo-black-on-transparent-background.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClickAwayListener from "@mui/base/ClickAwayListener";

function Navbar() {
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const buttons = [
    <Button key="one" onClick={() => window.location.pathname = "/account"}>My Account</Button>,
    <Button key="two" onClick={logout}>Logout</Button>,
  ];

  const handleClick = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.target);
      setOpen((prev) => !prev);
    } else {
      loginWithRedirect()
    }
  };

  useEffect(() => {
    console.log("renders");
  }, []);

  useEffect(() => {
    console.log(user);
  });

  return (
    <>
      <AppBar elevation={0} position="static" className="navbar">
        <Toolbar className="nav-inner">
          <div className="nav-inner-1">
            <Box
              component="img"
              sx={{
                height: "80px",
                width: "200px",
                marginTop: "10px",
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={logo}
            />
          </div>
          <div className="nav-inner-2">
            <h3>
              <Clock />
            </h3>
            <IconButton children={<SettingsIcon />} />
            <ClickAwayListener
              onClickAway={() => {
                open && setOpen(!open);
              }}
            >
              <Button className="profile-btn" onClick={handleClick}>
                {!isAuthenticated && (
                  <Tooltip title="login">
                    <AccountCircleIcon
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Tooltip>
                )}
                {isAuthenticated && (
                  <>
                    <Box
                      component="img"
                      className="nav-profile-success"
                      alt="profile"
                      src={user?.picture}
                    />
                    <Popper
                      open={open}
                      anchorEl={anchorEl}
                      placement="bottom-end"
                      transition
                    >
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps}>
                          <Box className="nav-profile-success-inner">
                            <h1>Welcome! {user?.name}</h1>
                            <ButtonGroup
                              orientation="vertical"
                              variant="contained"
                            >
                              {buttons}
                            </ButtonGroup>
                          </Box>
                        </Fade>
                      )}
                    </Popper>
                  </>
                )}
              </Button>
            </ClickAwayListener>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
