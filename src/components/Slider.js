import * as React from "react";
import { Paper, Typography, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";

function Slider () {
  return (
    <Carousel className="slider">
      {/* Change above line to <> and it works, maybe some issues in carousel */}
      <Paper elevation={0} className="slider-element">
        <div className="slider-element-inner" id="slider-element-inner-1" />
        <h3>Get a link you can share</h3>
        <p>click <b>New Meeting</b> to get a code you can share</p>
      </Paper>
      <Paper elevation={0} className="slider-element">
        <div className="slider-element-inner" id="slider-element-inner-3" />
        <h3>Your meeting is safe!</h3>
        <p>No one can join without the secret code unless you are invited</p>
      </Paper>
    </Carousel>
  );
  
}

export default Slider;
