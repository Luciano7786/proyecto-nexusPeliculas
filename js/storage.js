const CLAVES_ALMACENAMIENTO = {
    TEMA: 'movie_dashboard_theme',
    ULTIMA_BUSQUEDA: 'movie_dashboard_last_search'
};

export const guardarTema = (tema) => {
    localStorage.setItem(CLAVES_ALMACENAMIENTO.TEMA, tema);
};

export const obtenerTema = () => {
    return localStorage.getItem(CLAVES_ALMACENAMIENTO.TEMA) || 'light';
};

export const guardarUltimaBusqueda = (busqueda) => {
    localStorage.setItem(CLAVES_ALMACENAMIENTO.ULTIMA_BUSQUEDA, busqueda);
};

export const obtenerUltimaBusqueda = () => {
    return localStorage.getItem(CLAVES_ALMACENAMIENTO.ULTIMA_BUSQUEDA);
};

// Sistema de Favoritos
export const obtenerFavoritos = () => {
    const favoritos = localStorage.getItem('movie_dashboard_favorites');
    return favoritos ? JSON.parse(favoritos) : [];
};

export const alternarFavorito = (pelicula) => {
    const favoritos = obtenerFavoritos();
    const indice = favoritos.findIndex(p => p.id == pelicula.id);
    if (indice === -1) {
        favoritos.push(pelicula);
    } else {
        favoritos.splice(indice, 1);
    }
    localStorage.setItem('movie_dashboard_favorites', JSON.stringify(favoritos));
    return indice === -1; // Retorna true si se añadió, false si se eliminó
};

export const esFavorito = (id) => {
    const favoritos = obtenerFavoritos();
    return favoritos.some(p => p.id == id);
};

// Sistema de Pendientes
export const guardarPendientes = (pendientes) => {
    localStorage.setItem('movie_dashboard_watchlist', JSON.stringify(pendientes));
};

export const obtenerPendientes = () => {
    const pendientes = localStorage.getItem('movie_dashboard_watchlist');
    return pendientes ? JSON.parse(pendientes) : [];
};

export const alternarPendiente = (pelicula) => {
    const pendientes = obtenerPendientes();
    const indice = pendientes.findIndex(p => p.id == pelicula.id);
    let agregado = false;

    if (indice === -1) {
        pendientes.push(pelicula);
        agregado = true;
    } else {
        pendientes.splice(indice, 1);
        agregado = false;
    }

    guardarPendientes(pendientes);
    return agregado;
};

export const estaEnPendientes = (id) => {
    const pendientes = obtenerPendientes();
    return pendientes.some(p => p.id == id);
};
