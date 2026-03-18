// components/RectificarBD.jsx
import React, { useState } from "react";
import axios from "axios";

const RectificarBD = () => {
  const [dbMessage, setDbMessage] = useState("");
  const token = localStorage.getItem("token");

  const rectificarBD = async () => {
    try {
      const res = await axios.post("http://localhost:3000/rectificar-bd", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDbMessage(`🔄 Rectificación: ${res.data.message}`);
    } catch (err) {
      console.error("❌ Error rectificando BD:", err);
      setDbMessage("❌ Error al rectificar la base de datos");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <button onClick={rectificarBD} className="writer-button">
        Rectificar BD
      </button>
      {dbMessage && (
        <p style={{ marginTop: "10px", fontFamily: "Cambria", color: "#500075" }}>
          {dbMessage}
        </p>
      )}
    </div>
  );
};

export default RectificarBD;
