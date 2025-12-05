import CONFIGURACION from './config.js';

class API {
    static obtenerCabeceras() {
        return {
            accept: 'application/json',
            Authorization: `Bearer ${CONFIGURACION.CLAVE_API}`
        };
    }

    static async buscarPeliculas(consulta, pagina = 1) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/search/movie?query=${encodeURIComponent(consulta)}&page=${pagina}&language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al buscar películas');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerPeliculasPopulares(pagina = 1) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/popular?page=${pagina}&language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener películas populares');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerMejorValoradas(pagina = 1) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/top_rated?page=${pagina}&language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener películas mejor valoradas');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerProximosEstrenos(pagina = 1) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/upcoming?page=${pagina}&language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener próximos estrenos');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerEnCartelera(pagina = 1) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/now_playing?page=${pagina}&language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener películas en cartelera');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerDetallesPelicula(id) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/${id}?language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener detalles de la película');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerVideosPelicula(id) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/${id}/videos?language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener videos');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerGeneros() {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/genre/movie/list?language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener géneros');
            const datos = await respuesta.json();
            return datos.genres;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async descubrirPeliculas(pagina = 1, idGenero = null, anio = null, calificacion = null) {
        try {
            let url = `${CONFIGURACION.URL_BASE}/discover/movie?page=${pagina}&language=es-ES&sort_by=popularity.desc`;
            if (idGenero) {
                url += `&with_genres=${idGenero}`;
            }
            if (anio) {
                if (anio === 'old') {
                    url += `&primary_release_date.lte=2000-01-01`;
                } else {
                    url += `&primary_release_year=${anio}`;
                }
            }
            if (calificacion) {
                url += `&vote_average.gte=${calificacion}`;
            }
            
            const respuesta = await fetch(url, { headers: this.obtenerCabeceras() });
            if (!respuesta.ok) throw new Error('Error al descubrir películas');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerCreditosPelicula(id) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/${id}/credits?language=es-ES`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener créditos');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerRecomendaciones(id) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/${id}/recommendations?language=es-ES&page=1`,
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener recomendaciones');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }

    static async obtenerResenasPelicula(id) {
        try {
            const respuesta = await fetch(
                `${CONFIGURACION.URL_BASE}/movie/${id}/reviews?language=es-MX&page=1`, 
                { headers: this.obtenerCabeceras() }
            );
            if (!respuesta.ok) throw new Error('Error al obtener reseñas');
            const datos = await respuesta.json();
            return datos;
        } catch (error) {
            console.error('Error de API:', error);
            throw error;
        }
    }
}

export default API;
