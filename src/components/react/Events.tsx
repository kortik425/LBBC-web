import { useState, useEffect } from "react";
import events from "../../data/events.json";
import evangel from "../../assets/evangelistic 3.png";
import temp from "../../assets/temp-camp.png";

const Events = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
      {events.map((churchEvent, i) => (
        <div
          style={{
            width: 600,
            aspectRatio: 3 / 2,
            backgroundImage: `url("${i === 0 ? evangel.src : temp.src}")`,
            backgroundSize: "cover",
          }}
        ></div>
      ))}
    </div>
  );
};

export default Events;
