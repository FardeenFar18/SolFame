import React, { useState, useEffect } from "react";
import axios from "axios";

const HallList = () => {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/halls").then((res) => {
      setHalls(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Available Halls</h1>
      <div>
        {halls.map((hall) => (
          <div key={hall._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h2>{hall.name}</h2>
            <p>Location: {hall.location}</p>
            <p>Capacity: {hall.capacity}</p>
            <p>Price: ₹{hall.price}</p>
            <img src={hall.image} alt={hall.name} style={{ width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallList;
