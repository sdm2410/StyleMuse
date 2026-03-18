import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/noticias/${id}`)
      .then(res => setNoticia(res.data));
  }, [id]);

  if (!noticia) return <p>Cargando...</p>;

  return (
    <div className="noticia-detalle">
      <h1>{noticia.titulo}</h1>
      <p><strong>{noticia.autor}</strong></p>
      <img src={noticia.imagen} alt={noticia.titulo} style={{ maxWidth: "600px" }} />
      <p>{noticia.contenido}</p>
    </div>
  );
}

export default NoticiaDetalle;
