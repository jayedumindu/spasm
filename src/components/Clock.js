import React, { useEffect, useState } from "react";

function Clock() {
  const [date, setDate] = useState(new Date().toLocaleTimeString("en-US"));
  const refreshClock = () => {
    setDate(new Date().toLocaleTimeString("en-US"));
  };
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <>
      <span>{date}</span>
    </>
  );
}

export default Clock;
