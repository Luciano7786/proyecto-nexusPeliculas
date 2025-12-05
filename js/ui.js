import CONFIGURACION from "./config.js";
import { esFavorito, estaEnPendientes } from "./storage.js";

import API from "./api.js"; // Import API for fetching details

export const renderizarPeliculas = (peliculas, contenedor, generos = []) => {
  // Filtrar películas sin póster
  const peliculasValidas = peliculas.filter((pelicula) => pelicula.poster_path);

  if (peliculasValidas.length === 0 && contenedor.innerHTML === "") {
    contenedor.innerHTML = "<p>No se encontraron películas.</p>";
    return;
  }

  peliculasValidas.forEach((pelicula, indice) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "movie-card fade-in";
    tarjeta.style.animationDelay = `${indice * 0.05}s`; // Animación escalonada
    tarjeta.dataset.id = pelicula.id;

    const rutaPoster = `${CONFIGURACION.URL_BASE_IMAGEN}${pelicula.poster_path}`;
    const claseFav = esFavorito(pelicula.id) ? "active" : "";
    const clasePendiente = estaEnPendientes(pelicula.id) ? "active" : "";

    tarjeta.innerHTML = `
            <span class="fav-heart ${claseFav}" data-id="${
      pelicula.id
    }">♥</span>
            <span class="watchlist-btn ${clasePendiente}" data-id="${
      pelicula.id
    }">🕒</span>
            <img src="${rutaPoster}" alt="${
      pelicula.title
    }" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h3 class="movie-title">${pelicula.title}</h3>
                <span class="movie-rating">★ ${pelicula.vote_average.toFixed(
                  1
                )}</span>
            </div>
        `;

    contenedor.appendChild(tarjeta);
  });
};

export const mostrarNotificacion = (mensaje) => {
  const contenedor = document.getElementById("contenedor-notificaciones");
  if (!contenedor) return;

  const notificacion = document.createElement("div");
  notificacion.className = "toast";
  notificacion.textContent = mensaje;

  contenedor.appendChild(notificacion);

  // Eliminar después de la animación (3s total: 0.3s entrada + 2.4s espera + 0.3s salida)
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
};

export const renderizarDetallesPelicula = (
  pelicula,
  contenedor,
  claveVideo = null,
  creditos = null,
  recomendaciones = null,
  resenas = null
) => {
  // ... (código existente para backdrop, póster, video)
  const rutaFondo = pelicula.backdrop_path
    ? `${CONFIGURACION.URL_BASE_FONDO}${pelicula.backdrop_path}`
    : "";

  const rutaPoster = pelicula.poster_path
    ? `${CONFIGURACION.URL_BASE_IMAGEN}${pelicula.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  let htmlVideo = "";
  if (claveVideo) {
    htmlVideo = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${claveVideo}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
  }

  // HTML del Reparto
  let htmlReparto = "";
  if (creditos && creditos.cast) {
    const repartoValido = creditos.cast.filter((actor) => actor.profile_path); // Filtrar actores sin imagen
    if (repartoValido.length > 0) {
      htmlReparto = `
                <div class="cast-section">
                    <h3>Reparto Principal</h3>
                    <div class="cast-container">
                        ${repartoValido
                          .slice(0, 10)
                          .map(
                            (actor) => `
                            <div class="cast-card">
                                <img src="${
                                  CONFIGURACION.URL_BASE_IMAGEN +
                                  actor.profile_path
                                }" alt="${actor.name}">
                                <p>${actor.name}</p>
                                <small>${actor.character}</small>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `;
    }
  }

  // HTML de Recomendaciones
  let htmlRecomendaciones = "";
  if (recomendaciones && recomendaciones.results) {
    const recomendacionesValidas = recomendaciones.results.filter(
      (rec) => rec.poster_path
    );
    if (recomendacionesValidas.length > 0) {
      htmlRecomendaciones = `
                <div class="recommendations-section">
                    <h3>Recomendaciones</h3>
                    <div class="recommendations-container">
                        ${recomendacionesValidas
                          .slice(0, 5)
                          .map(
                            (rec) => `
                            <div class="rec-card" data-id="${rec.id}">
                                <img src="${
                                  CONFIGURACION.URL_BASE_IMAGEN +
                                  rec.poster_path
                                }" alt="${rec.title}" title="${rec.title}">
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `;
    }
  }

  // HTML de Reseñas
  let htmlResenas = "";
  if (resenas && resenas.results && resenas.results.length > 0) {
    htmlResenas = `
            <div class="reviews-section">
                <h3>Reseñas de Usuarios</h3>
                ${resenas.results
                  .slice(0, 3)
                  .map(
                    (resena) => `
                    <div class="review-card">
                        <div class="review-header">
                            <span>${resena.author}</span>
                            <span>★ ${
                              resena.author_details.rating || "-"
                            }</span>
                        </div>
                        <div class="review-content">${resena.content}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  } else if (resenas) {
    htmlResenas =
      '<div class="reviews-section"><p>No hay reseñas disponibles.</p></div>';
  }

  contenedor.innerHTML = `
        <div class="movie-details-content" style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <img src="${rutaPoster}" alt="${
    pelicula.title
  }" style="width: 300px; border-radius: 8px;" loading="lazy">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h2>${pelicula.title} (${new Date(
    pelicula.release_date
  ).getFullYear()})</h2>
                    <button class="share-btn" title="Compartir">🔗</button>
                </div>
                <p style="margin: 1rem 0;"><em>${pelicula.tagline}</em></p>
                <p><strong>Géneros:</strong> ${pelicula.genres
                  .map((g) => g.name)
                  .join(", ")}</p>
                <p><strong>Resumen:</strong> ${pelicula.overview}</p>
                <p style="margin-top: 1rem;"><strong>Calificación:</strong> ★ ${pelicula.vote_average.toFixed(
                  1
                )}</p>
                ${htmlVideo}
                ${htmlReparto}
                ${htmlRecomendaciones}
                ${htmlResenas}
            </div>
        </div>
    `;
};

export const renderizarEsqueletos = (contenedor, cantidad = 8) => {
  // Solo limpiar si no estamos añadiendo (para scroll infinito podríamos querer añadir esqueletos)
  // Pero por ahora, asumimos que limpiamos para carga inicial, o añadimos para scroll.
  // Vamos a hacerlo solo añadir si el contenedor tiene hijos? No, más simple controlar desde fuera.
  // Para esta implementación, añadiremos esqueletos.

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "skeleton-card";
    tarjeta.innerHTML = `
            <div class="skeleton skeleton-poster"></div>
            <div class="skeleton-info">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
            </div>
        `;
    contenedor.appendChild(tarjeta);
  }
};

export const eliminarEsqueletos = (contenedor) => {
  const esqueletos = contenedor.querySelectorAll(".skeleton-card");
  esqueletos.forEach((s) => s.remove());
};

export const renderizarGeneros = (generos, contenedor) => {
  contenedor.innerHTML = '<div class="genre-tag active" data-id="">Todos</div>';
  generos.forEach((genero) => {
    const etiqueta = document.createElement("div");
    etiqueta.className = "genre-tag";
    etiqueta.dataset.id = genero.id;
    etiqueta.textContent = genero.name;
    contenedor.appendChild(etiqueta);
  });
};

export const alternarTema = (esOscuro) => {
  document.documentElement.setAttribute(
    "data-theme",
    esOscuro ? "dark" : "light"
  );
  const btn = document.getElementById("toggle-tema");
  if (btn) {
    btn.textContent = esOscuro ? "☀️" : "🌙";
  }
};
