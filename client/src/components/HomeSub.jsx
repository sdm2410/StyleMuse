import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from "react-router-dom";

function HomeS() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticias, setNoticias] = useState([]);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const startHome = async () => {
    const response = await axios.post('http://localhost:5173/HomeS');
    localStorage.setItem('token', response.data.token);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    axios.get("http://localhost:3000/noticias")
      .then(res => setNoticias(res.data.noticias))
      .catch(error => {
        console.error("Error al obtener noticias:", error);
        // Si hay error, dejar las noticias estáticas
      });
  }, []);


  return (
    <>
      <div className="grid_header">
        <article className="grid_a">
          <section className="grid_logo">
            <Link to="/home">
              <img className="logo" src="/logo.png" alt="Logo" />
            </Link>
          </section>
          <section className="grid_titulo">
            <h1 className="titulo">Style Muse</h1>
          </section>
          <section className="grid_menu">
            <nav className="dropdown">
              <button className="dropdown-toggle" onClick={toggleMenu}>
                Menú ▼
              </button>
              {menuOpen && (
                <ul className="dropdown-list">
                  <li><a href="#belleza">Belleza</a></li>
                  <li><a href="#moda">Moda</a></li>
                  <li><a href="#pasarela">Pasarelas</a></li>
                  <li><a href="#famosas">Famosas</a></li>
                  <li><a href="#grwm">GRWM</a></li>
                  <li><a href="#exclusivo">Contenido exclusivo</a></li>
                  <li><a href="#recomendado">Recomendadas</a></li>
                  <br />
                  <Link to="/perfil"><li>Perfil</li></Link>
                  <Link to="/suscribirse"><li>Suscribirse</li></Link>
                  <li><a href="#footer">Contacto</a></li>
                  <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
                </ul>
              )}
            </nav>
          </section>

        </article>
      </div>
      <article className="grid_b"></article>

      <main>
        <div className="homesub-separator"></div>

        <div className="tarjetas" id="belleza">
          <div className="tarjetas__titulo">
            <h2 className="productos">Belleza</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/rutina.webp" className="card-img-top img-short" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Rutinas que transforman tu piel en 7 días</h5>
                <p className="card-text">Por Valentina Ríos</p>
                <Link to="/noticia" className="btn btn-secondary" title="Ir a comprar">Leer noticia</Link>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/aceites.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Aceites faciales: ¿mito o milagro para pieles grasas?</h5>
                <p className="card-text">Por Clara Méndez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/minimalista.jpg" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El nuevo look minimalista en maquillaje</h5>
                <p className="card-text">Por Kiana Murden</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/ingredientes.avif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">10 ingredientes que tu piel necesita</h5>
                <p className="card-text">Por Sofía Legrand</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/glow.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Cómo lograr un glow natural sin iluminador</h5>
                <p className="card-text">Por Camila Sanz</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            {/* Noticias dinámicas de Belleza - Excluyendo duplicados */}
            {noticias.filter(n =>
              n.categoria.toLowerCase() === 'belleza' &&
              !n.tituloNoticia.toLowerCase().includes('rutina') &&
              !n.tituloNoticia.toLowerCase().includes('aceite') &&
              !n.tituloNoticia.toLowerCase().includes('minimalista') &&
              !n.tituloNoticia.toLowerCase().includes('glow') &&
              !n.tituloNoticia.toLowerCase().includes('ingrediente')
            ).map((n) => (
              <div key={n.id} className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
                <img src={n.imagen || '/rutina.webp'} className="card-img-top img-short" alt={n.tituloNoticia} />
                <div className="card-body bg-light text-dark">
                  <h5 className="card-title">{n.tituloNoticia}</h5>
                  <p className="card-text">Por {n.escritorAsignado}</p>
                  <a href="#" className="btn btn-secondary" title="Ver más" onClick={(e) => {
                    e.preventDefault();
                    alert('Esta es una vista previa. Para ver el contenido completo, contacta al editor.');
                  }}>Ver más</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tarjetas" id="moda">
          <div className="tarjetas__titulo">
            <h2 className="productos">Moda</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/jeans.webp" className="card-img-top img-short" alt="Moda 1" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El regreso de los pantalones cargo: cómo llevarlos con elegancia</h5>
                <p className="card-text">Por Tatiana Ojea</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/croma.jpg" className="card-img-top" alt="Moda 2" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Cómo armar un outfit cromático sin parecer uniforme</h5>
                <p className="card-text">Por Renata Varela</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/carteramarron.jpg" className="card-img-top" alt="Moda 3" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">5 formas de combinar tu blazer oversized sin parecer aburrida</h5>
                <p className="card-text">Por Lucía Ferraro</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/denim.jfif" className="card-img-top" alt="Moda 4" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Tendencias 2025: el denim se reinventa con cortes asimétricos</h5>
                <p className="card-text">Por Julián Méndez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/invierno.jpg" className="card-img-top" alt="Moda 5" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Vestidos de punto: el básico inesperado del invierno</h5>
                <p className="card-text">Por Martina Luján</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            {/* Noticias dinámicas de Moda - Excluyendo duplicados */}
            {noticias.filter(n =>
              n.categoria.toLowerCase() === 'moda' &&
              !n.tituloNoticia.toLowerCase().includes('cargo') &&
              !n.tituloNoticia.toLowerCase().includes('cromático') &&
              !n.tituloNoticia.toLowerCase().includes('blazer') &&
              !n.tituloNoticia.toLowerCase().includes('denim') &&
              !n.tituloNoticia.toLowerCase().includes('invierno') &&
              !n.tituloNoticia.toLowerCase().includes('vestidos')
            ).map((n) => (
              <div key={n.id} className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
                <img src={n.imagen || '/jeans.webp'} className="card-img-top img-short" alt={n.tituloNoticia} />
                <div className="card-body bg-light text-dark">
                  <h5 className="card-title">{n.tituloNoticia}</h5>
                  <p className="card-text">Por {n.escritorAsignado}</p>
                  <a href="#" className="btn btn-secondary" title="Ver más" onClick={(e) => {
                    e.preventDefault();
                    alert('Esta es una vista previa. Para ver el contenido completo, contacta al editor.');
                  }}>Ver más</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="imagen_uno"></section>

        <div className="tarjetas" id="pasarela">
          <div className="tarjetas__titulo">
            <h2 className="productos">Pasarelas</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/alta.jpg" className="card-img-top img-short" alt="Pasarela 1" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Alta costura 2025: transparencias, volumen y nostalgia</h5>
                <p className="card-text">Por María Munsuri</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/tejidos.webp" className="card-img-top" alt="Pasarela 2" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Milán se rinde ante los tejidos reciclados y el diseño circular</h5>
                <p className="card-text">Por Esteban Rinaldi</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/brutalista.jfif" className="card-img-top" alt="Pasarela 3" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">La pasarela que se convierte en un homenaje brutalista</h5>
                <p className="card-text">Por Paula Gutiérrez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/modelos.webp" className="card-img-top" alt="Pasarela 4" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Modelos: la revolución silenciosa de París Fashion Week</h5>
                <p className="card-text">Por Joaquín Salas</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/punk.jpg" className="card-img-top" alt="Pasarela 5" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El desfile de Dior mezcla ballet clásico con punk londinense</h5>
                <p className="card-text">Por Ana Beltrán</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            {/* Noticias dinámicas de Pasarelas - Excluyendo duplicados */}
            {noticias.filter(n =>
              n.categoria.toLowerCase() === 'pasarela' &&
              !n.tituloNoticia.toLowerCase().includes('costura') &&
              !n.tituloNoticia.toLowerCase().includes('milán') &&
              !n.tituloNoticia.toLowerCase().includes('tejidos') &&
              !n.tituloNoticia.toLowerCase().includes('brutalista') &&
              !n.tituloNoticia.toLowerCase().includes('modelo')
            ).map((n) => (
              <div key={n.id} className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
                <img src={n.imagen || '/alta.jpg'} className="card-img-top img-short" alt={n.tituloNoticia} />
                <div className="card-body bg-light text-dark">
                  <h5 className="card-title">{n.tituloNoticia}</h5>
                  <p className="card-text">Por {n.escritorAsignado}</p>
                  <a href="#" className="btn btn-secondary" title="Ver más" onClick={(e) => {
                    e.preventDefault();
                    alert('Esta es una vista previa. Para ver el contenido completo, contacta al editor.');
                  }}>Ver más</a>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="tarjetas" id="famosas">
          <div className="tarjetas__titulo">
            <h2 className="productos">Famosas</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/zendaya.jfif" className="card-img-top img-short" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Zendaya y el vestido que redefinió la alfombra roja</h5>
                <p className="card-text">Por Nicolás Duarte</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/rosalia.avif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Rosalía sorprende con un look gótico en la Semana de la Moda</h5>
                <p className="card-text">Por Abril Torres</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/margot.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Margot Robbie apuesta por el estilo Barbiecore fuera de pantalla</h5>
                <p className="card-text">Por Lara Benítez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/dua.webp" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Dua Lipa lanza su propia línea de ropa inspirada en los 2000</h5>
                <p className="card-text">Por Tomás Aguirre</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <img src="/taylor.avif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Taylor Swift y el vestido vintage que enamoró a Nueva York</h5>
                <p className="card-text">Por Micaela Fontana</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            {/* Noticias dinámicas de Famosas - Excluyendo duplicados */}
            {noticias.filter(n =>
              n.categoria.toLowerCase() === 'famosas' &&
              !n.tituloNoticia.toLowerCase().includes('zendaya') &&
              !n.tituloNoticia.toLowerCase().includes('rosalía') &&
              !n.tituloNoticia.toLowerCase().includes('margot') &&
              !n.tituloNoticia.toLowerCase().includes('dua') &&
              !n.tituloNoticia.toLowerCase().includes('taylor')
            ).map((n) => (
              <div key={n.id} className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
                <img src={n.imagen || '/zendaya.jfif'} className="card-img-top img-short" alt={n.tituloNoticia} />
                <div className="card-body bg-light text-dark">
                  <h5 className="card-title">{n.tituloNoticia}</h5>
                  <p className="card-text">Por {n.escritorAsignado}</p>
                  <a href="#" className="btn btn-secondary" title="Ver más" onClick={(e) => {
                    e.preventDefault();
                    alert('Esta es una vista previa. Para ver el contenido completo, contacta al editor.');
                  }}>Ver más</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="imagen_dos"></section>

        <article>
          <div className="tarjetas" id="grwm">
            <div className="tarjetas__titulo">
              <h2 className="productos">Get Ready With Me</h2>
            </div>

            <section className="grid_video">
              <iframe
                className="video"
                src="https://www.youtube.com/embed/gHx1akspUbk"
                title="Dua Lipa - MET Gala 2025"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>

              <iframe
                className="video3"
                src="https://www.youtube.com/embed/he5CfMZRUdI"
                title="Katy Perry - Balenciaga"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>

              <iframe
                className="video2"
                src="https://www.youtube.com/embed/-CJ-jwfQhto"
                title="GRWM Video 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>


            </section>
          </div>
        </article>

        <div className="tarjetas" id="exclusivo">
          <div className="tarjetas__titulo">
            <h2 className="productos">Contenido exclusivo</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Exclusivo</p>
              <img src="/triunfal.webp" className="card-img-top img-short" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El regreso triunfal del minimalismo en las pasarelas 2025</h5>
                <p className="card-text">Por Valentina Dupré</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Exclusivo</p>
              <img src="/zapatos.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Zapatos escultóricos: la nueva obsesión de las editoras de moda</h5>
                <p className="card-text">Por Lorenzo Álvarez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Exclusivo</p>
              <img src="/estilo.webp" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Estilo con conciencia: el lujo sostenible conquista las pasarelas internacionales</h5>
                <p className="card-text">Por Isabella Moretti</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Exclusivo</p>
              <img src="/metalicos.jpg" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Belleza futurista: los tonos metálicos que dominarán la próxima temporada</h5>
                <p className="card-text">Por Sofía Marín</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Exclusivo</p>
              <img src="/movimiento.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Lujo en movimiento: la silueta fluida que conquista las calles y pasarelas</h5>
                <p className="card-text">Por Camila Estévez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>
          </div>
        </div>


        <div className="tarjetas" id="recomendado">
          <div className="tarjetas__titulo">
            <h2 className="productos">Recomendaciones de lectura</h2>
          </div>

          <div className="grid_cards3">
            <div className="card1 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Moda</p>
              <img src="/renacimiento.webp" className="card-img-top img-short" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El renacimiento del minimalismo es la nueva tendencia 2025</h5>
                <p className="card-text">Por Lucía Méndez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Belleza</p>
              <img src="/circular.webp" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Belleza circular: marcas que reinventan el skincare sostenible</h5>
                <p className="card-text">Por Camila Torres</p>
                <Link to="/noticia2" className="btn btn-secondary" title="Ir a comprar">Leer noticia</Link>
              </div>
            </div>

            <div className="card2 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Belleza</p>
              <img src="/perfume.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">El poder del perfume: cómo elegir tu aroma insignia</h5>
                <p className="card-text">Por Valentina Ríos</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Famosas</p>
              <img src="/dua.webp" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">Dua Lipa lanza su propia línea de ropa inspirada en los 2000</h5>
                <p className="card-text">Por Sofía Álvarez</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>

            <div className="card3 border-dark shadow-lg p-3 mb-5 bg-body rounded" style={{ width: '18rem' }}>
              <p className="card-text">Pasarelas</p>
              <img src="/brutalista.jfif" className="card-img-top" />
              <div className="card-body bg-light text-dark">
                <h5 className="card-title">La pasarela que se convierte en un homenaje brutalista</h5>
                <p className="card-text">Por Martina López</p>
                <a className="btn btn-secondary" title="Ir a comprar">Leer noticia</a>
              </div>
            </div>
          </div>
        </div>


      </main>

      <div className="grid-footer" id="footer">
        <div className="redes">
          <a className="icono" target="_blank" href="https://www.instagram.com/stylemuse.okk/">
            <img src="/insta.svg" alt="Instagram" />
          </a>
          <br />
          <a className="icono" target="_blank" href="https://www.tiktok.com/@stylemuse.tk">
            <img src="/tiktok.svg" alt="Tiktok" />
          </a>
          <br />
          <a className="icono" target="_blank" href="https://www.youtube.com/@stylemusenoticias">
            <img src="/youtube.svg" alt="Youtube" />
          </a>
        </div>
        <div className="copy"><h4>©Copyright</h4></div>
        <div className="conta"><h4>Contacto +54 11 4967-1832</h4></div>
      </div>
    </>
  );
}

export default HomeS;
