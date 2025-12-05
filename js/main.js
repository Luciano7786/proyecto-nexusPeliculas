import API from './api.js';
import { renderizarPeliculas, renderizarDetallesPelicula, alternarTema, renderizarEsqueletos, eliminarEsqueletos, renderizarGeneros, mostrarNotificacion } from './ui.js';
import { guardarTema, obtenerTema, guardarUltimaBusqueda, obtenerUltimaBusqueda, alternarFavorito, obtenerFavoritos, alternarPendiente, obtenerPendientes } from './storage.js';

// Selectores
const inputBusqueda = document.getElementById('input-busqueda');
const toggleBusqueda = document.getElementById('toggle-busqueda');
const contenedorBarraBusqueda = document.getElementById('contenedor-barra-busqueda');
const btnCerrarBusqueda = document.getElementById('btn-cerrar-busqueda');
const rejillaPeliculas = document.getElementById('rejilla-peliculas');
const toggleTema = document.getElementById('toggle-tema');
const btnFavoritos = document.getElementById('btn-favoritos');
const btnPendientes = document.getElementById('btn-pendientes');
const modalPelicula = document.getElementById('modal-pelicula');
const cuerpoModal = document.getElementById('cuerpo-modal');
const btnCerrar = document.querySelector('.btn-cerrar');
const btnAcercaDe = document.getElementById('btn-acerca-de');
const modalAcercaDe = document.getElementById('modal-acerca-de');
const btnCerrarAcercaDe = modalAcercaDe.querySelector('.btn-cerrar');
const contenedorGeneros = document.getElementById('contenedor-generos');
const btnScrollIzquierda = document.getElementById('scroll-izquierda');
const btnScrollDerecha = document.getElementById('scroll-derecha');
const filtroAnio = document.getElementById('filtro-anio');
const filtroCalificacion = document.getElementById('filtro-calificacion');
const contenedorFiltros = document.getElementById('contenedor-filtros');
const encabezadoFavoritos = document.getElementById('encabezado-favoritos');
const encabezadoPendientes = document.getElementById('encabezado-pendientes');
const btnVolverInicio = document.getElementById('btn-volver-inicio');
const btnVolverInicioPendientes = document.getElementById('btn-volver-inicio-pendientes');
const btnVolverArriba = document.getElementById('btn-volver-arriba');
const logoApp = document.getElementById('logo-app');
const botonesCategoria = document.querySelectorAll('.btn-categoria');

// Estado
let peliculasActuales = [];
let paginaActual = 1;
let cargando = false;
let idGeneroActual = null;
let anioActual = null;
let calificacionActual = null;
let consultaActual = '';
let categoriaActual = 'popular';
let modoBusqueda = false;
let vistaFavoritos = false;
let vistaPendientes = false;
let hayMas = true;
let todosGeneros = [];

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Registro PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('SW Registrado'))
            .catch(err => console.log('SW Error:', err));
    }

    // Tema
    const temaGuardado = obtenerTema();
    alternarTema(temaGuardado === 'dark');
    
    // Cargar Géneros
    await cargarGeneros();

    // Carga Inicial
    const ultimaBusqueda = obtenerUltimaBusqueda();
    if (ultimaBusqueda) {
        inputBusqueda.value = ultimaBusqueda;
        consultaActual = ultimaBusqueda;
        modoBusqueda = true;
        await buscarPeliculas(ultimaBusqueda, true);
    } else {
        await cargarPeliculas(true);
    }
});

// Event Listeners

// Botones de Categoría
botonesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar UI
        botonesCategoria.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Actualizar Estado
        categoriaActual = btn.dataset.category;
        idGeneroActual = null;
        anioActual = null;
        calificacionActual = null;
        modoBusqueda = false;
        inputBusqueda.value = '';
        
        // Resetear Filtros UI
        if (filtroAnio) filtroAnio.value = '';
        if (filtroCalificacion) filtroCalificacion.value = '';
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));

        // Cargar
        cargarPeliculas(true);
    });
});

// Scroll y Volver Arriba
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // Visibilidad Volver Arriba
    if (scrollTop > 300) {
        btnVolverArriba.classList.add('visible');
    } else {
        btnVolverArriba.classList.remove('visible');
    }

    if (vistaFavoritos || vistaPendientes) return;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && !cargando) {
        if (modoBusqueda) {
            buscarPeliculas(consultaActual, false);
        } else {
            cargarPeliculas(false);
        }
    }
});

btnVolverArriba.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Recarga Logo
if (logoApp) {
    logoApp.addEventListener('click', () => {
        window.location.reload();
    });
}

// Búsqueda
if (toggleBusqueda) {
    toggleBusqueda.addEventListener('click', () => {
        contenedorBarraBusqueda.classList.add('active');
        inputBusqueda.focus();
    });
}

if (btnCerrarBusqueda) {
    btnCerrarBusqueda.addEventListener('click', () => {
        contenedorBarraBusqueda.classList.remove('active');
        inputBusqueda.value = '';
    });
}

// Cerrar búsqueda con Esc
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (contenedorBarraBusqueda.classList.contains('active')) {
            contenedorBarraBusqueda.classList.remove('active');
        }
    }
});

inputBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const consulta = inputBusqueda.value.trim();
        if (consulta) {
            realizarBusqueda(consulta);
        }
    }
});

function realizarBusqueda(consulta) {
    consultaActual = consulta;
    modoBusqueda = true;
    buscarPeliculas(consulta, true);
    guardarUltimaBusqueda(consulta);
    btnFavoritos.classList.remove('active');
    btnPendientes.classList.remove('active');
    resetearGeneroActivo();
}

inputBusqueda.addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
        modoBusqueda = false;
        consultaActual = '';
        guardarUltimaBusqueda('');
        cargarPeliculas(true);
    }
});

// Tema
toggleTema.addEventListener('click', () => {
    const temaActual = document.documentElement.getAttribute('data-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    alternarTema(nuevoTema === 'dark');
    guardarTema(nuevoTema);
});

// Navegación (Favoritos, Pendientes, Inicio)
btnFavoritos.addEventListener('click', () => {
    if (vistaFavoritos) {
        mostrarVistaInicio();
    } else {
        mostrarVistaFavoritos();
    }
});

btnPendientes.addEventListener('click', () => {
    if (vistaPendientes) {
        mostrarVistaInicio();
    } else {
        mostrarVistaPendientes();
    }
});

btnVolverInicio.addEventListener('click', () => {
    mostrarVistaInicio();
});

btnVolverInicioPendientes.addEventListener('click', () => {
    mostrarVistaInicio();
});

// Filtros
contenedorGeneros.addEventListener('click', (e) => {
    if (e.target.classList.contains('genre-tag')) {
        const id = e.target.dataset.id;
        idGeneroActual = id || null;
        
        // Actualizar UI
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        btnFavoritos.classList.remove('active');
        btnPendientes.classList.remove('active');

        // Resetear y Cargar
        modoBusqueda = false;
        inputBusqueda.value = '';
        cargarPeliculas(true);
    }
});

btnScrollIzquierda.addEventListener('click', () => {
    contenedorGeneros.scrollBy({ left: -200, behavior: 'smooth' });
});

btnScrollDerecha.addEventListener('click', () => {
    contenedorGeneros.scrollBy({ left: 200, behavior: 'smooth' });
});

if (filtroAnio) {
    filtroAnio.addEventListener('change', () => {
        anioActual = filtroAnio.value || null;
        modoBusqueda = false;
        inputBusqueda.value = '';
        cargarPeliculas(true);
    });
}

if (filtroCalificacion) {
    filtroCalificacion.addEventListener('change', () => {
        calificacionActual = filtroCalificacion.value || null;
        modoBusqueda = false;
        inputBusqueda.value = '';
        cargarPeliculas(true);
    });
}

// Interacciones Rejilla Películas
rejillaPeliculas.addEventListener('click', async (e) => {
    // Click Corazón
    if (e.target.classList.contains('fav-heart')) {
        e.stopPropagation();
        const id = e.target.dataset.id;
        const pelicula = peliculasActuales.find(p => p.id == id);
        if (pelicula) {
            const agregado = alternarFavorito(pelicula);
            e.target.classList.toggle('active', agregado);
            mostrarNotificacion(agregado ? 'Añadido a favoritos' : 'Eliminado de favoritos');

            if (vistaFavoritos && !agregado) {
                 const nuevosFavs = obtenerFavoritos();
                 peliculasActuales = nuevosFavs;
                 if (nuevosFavs.length === 0) {
                    rejillaPeliculas.innerHTML = `
                        <div class="empty-favorites">
                            <p>No tienes películas en favoritos.</p>
                            <p>¡Explora y añade algunas!</p>
                        </div>
                    `;
                 } else {
                    rejillaPeliculas.innerHTML = ''; 
                    renderizarPeliculas(nuevosFavs, rejillaPeliculas);
                 }
            }
        }
        return;
    }

    // Click Pendientes
    if (e.target.classList.contains('watchlist-btn')) {
        e.stopPropagation();
        const id = e.target.dataset.id;
        const pelicula = peliculasActuales.find(p => p.id == id);
        if (pelicula) {
            const agregado = alternarPendiente(pelicula);
            e.target.classList.toggle('active', agregado);
            mostrarNotificacion(agregado ? 'Añadido a pendientes' : 'Eliminado de pendientes');

            if (vistaPendientes && !agregado) {
                 const nuevosPendientes = obtenerPendientes();
                 peliculasActuales = nuevosPendientes;
                 if (nuevosPendientes.length === 0) {
                    rejillaPeliculas.innerHTML = `
                        <div class="empty-favorites">
                            <p>No tienes películas pendientes.</p>
                            <p>¡Añade algunas para ver más tarde!</p>
                        </div>
                    `;
                 } else {
                    rejillaPeliculas.innerHTML = ''; 
                    renderizarPeliculas(nuevosPendientes, rejillaPeliculas);
                 }
            }
        }
        return;
    }

    const tarjeta = e.target.closest('.movie-card');
    if (tarjeta) {
        const idPelicula = tarjeta.dataset.id;
        await mostrarDetallesPelicula(idPelicula);
    }
});

// Modales
btnCerrar.addEventListener('click', () => {
    modalPelicula.classList.remove('show');
    cuerpoModal.innerHTML = ''; 
});

window.addEventListener('click', (e) => {
    if (e.target === modalPelicula) {
        modalPelicula.classList.remove('show');
        cuerpoModal.innerHTML = ''; 
    }
    if (e.target === modalAcercaDe) {
        modalAcercaDe.classList.remove('show');
    }
});

btnAcercaDe.addEventListener('click', () => {
    modalAcercaDe.classList.add('show');
});

btnCerrarAcercaDe.addEventListener('click', () => {
    modalAcercaDe.classList.remove('show');
});

// Botón Compartir
cuerpoModal.addEventListener('click', async (e) => {
    if (e.target.classList.contains('share-btn')) {
        const titulo = cuerpoModal.querySelector('h2').innerText;
        const texto = `¡Mira esta película en Nexus! ${titulo}`;
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'Nexus Movies', text: texto, url: url });
                mostrarNotificacion('¡Compartido con éxito!');
            } catch (err) {
                console.log('Error al compartir:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${texto} ${url}`);
                mostrarNotificacion('Enlace copiado al portapapeles');
            } catch (err) {
                mostrarNotificacion('No se pudo compartir');
            }
        }
    }
});

// Offline/Online
window.addEventListener('offline', () => {
    mostrarNotificacion('Sin conexión 🔌');
});

window.addEventListener('online', () => {
    mostrarNotificacion('Conexión restaurada ⚡');
});

// Esc Key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalPelicula.classList.contains('show')) {
            modalPelicula.classList.remove('show');
            cuerpoModal.innerHTML = '';
        }
        if (modalAcercaDe.classList.contains('show')) {
            modalAcercaDe.classList.remove('show');
        }
    }
});

// Funciones

function resetearGeneroActivo() {
    document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
}

async function cargarGeneros() {
    try {
        const generos = await API.obtenerGeneros();
        todosGeneros = generos;
        renderizarGeneros(generos, contenedorGeneros);
    } catch (error) {
        console.error('Error cargando géneros:', error);
    }
}

async function cargarPeliculas(esNuevo = false) {
    if (cargando || (!esNuevo && !hayMas)) return;
    cargando = true;
    
    if (esNuevo) {
        paginaActual = 1;
        hayMas = true;
        rejillaPeliculas.innerHTML = '';
        peliculasActuales = [];
        const msgExistente = document.getElementById('end-msg');
        if (msgExistente) msgExistente.remove();
    }
    
    renderizarEsqueletos(rejillaPeliculas, 8);

    try {
        let datos;
        
        if (idGeneroActual || anioActual || calificacionActual) {
            datos = await API.descubrirPeliculas(paginaActual, idGeneroActual, anioActual, calificacionActual);
        } else {
            switch (categoriaActual) {
                case 'top_rated':
                    datos = await API.obtenerMejorValoradas(paginaActual);
                    break;
                case 'upcoming':
                    datos = await API.obtenerProximosEstrenos(paginaActual);
                    break;
                case 'now_playing':
                    datos = await API.obtenerEnCartelera(paginaActual);
                    break;
                case 'popular':
                default:
                    datos = await API.obtenerPeliculasPopulares(paginaActual);
                    break;
            }
        }

        eliminarEsqueletos(rejillaPeliculas);
        
        if (datos.results.length === 0 || paginaActual >= datos.total_pages) {
            hayMas = false;
            if (!esNuevo) mostrarMensajeFinLista();
        }
        
        if (esNuevo) {
            peliculasActuales = datos.results;
            renderizarPeliculas(datos.results, rejillaPeliculas);
        } else {
            peliculasActuales = [...peliculasActuales, ...datos.results];
            const divTemp = document.createElement('div');
            renderizarPeliculas(datos.results, divTemp);
            while (divTemp.firstChild) {
                rejillaPeliculas.appendChild(divTemp.firstChild);
            }
        }
        
        paginaActual++;
    } catch (error) {
        console.error(error);
        eliminarEsqueletos(rejillaPeliculas);
        if (esNuevo) rejillaPeliculas.innerHTML = '<p>Error al cargar películas.</p>';
    } finally {
        cargando = false;
    }
}

async function buscarPeliculas(consulta, esNuevo = false) {
    if (cargando || (!esNuevo && !hayMas)) return;
    cargando = true;

    if (esNuevo) {
        paginaActual = 1;
        hayMas = true;
        rejillaPeliculas.innerHTML = '';
        peliculasActuales = [];
        const msgExistente = document.getElementById('end-msg');
        if (msgExistente) msgExistente.remove();
    }

    renderizarEsqueletos(rejillaPeliculas, 8);

    try {
        const datos = await API.buscarPeliculas(consulta, paginaActual);
        eliminarEsqueletos(rejillaPeliculas);

        if (datos.results.length === 0 || paginaActual >= datos.total_pages) {
            hayMas = false;
            if (!esNuevo) mostrarMensajeFinLista();
        }

        if (esNuevo) {
            peliculasActuales = datos.results;
            renderizarPeliculas(datos.results, rejillaPeliculas);
        } else {
            peliculasActuales = [...peliculasActuales, ...datos.results];
            const divTemp = document.createElement('div');
            renderizarPeliculas(datos.results, divTemp);
            while (divTemp.firstChild) {
                rejillaPeliculas.appendChild(divTemp.firstChild);
            }
        }

        paginaActual++;
    } catch (error) {
        console.error(error);
        eliminarEsqueletos(rejillaPeliculas);
        if (esNuevo) rejillaPeliculas.innerHTML = '<p>Error al buscar películas.</p>';
    } finally {
        cargando = false;
    }
}

function mostrarMensajeFinLista() {
    if (document.getElementById('end-msg')) return;
    const msg = document.createElement('p');
    msg.id = 'end-msg';
    msg.style.textAlign = 'center';
    msg.style.width = '100%';
    msg.style.padding = '2rem';
    msg.style.opacity = '0.7';
    msg.textContent = 'No hay más películas disponibles.';
    rejillaPeliculas.parentNode.appendChild(msg);
}

function mostrarVistaPendientes() {
    vistaPendientes = true;
    vistaFavoritos = false;
    btnFavoritos.classList.remove('active');
    btnPendientes.classList.add('active');
    
    contenedorFiltros.style.display = 'none';
    encabezadoFavoritos.style.display = 'none';
    encabezadoPendientes.style.display = 'flex';
    
    rejillaPeliculas.innerHTML = '';
    const msgExistente = document.getElementById('end-msg');
    if (msgExistente) msgExistente.remove();

    const pendientes = obtenerPendientes();
    peliculasActuales = pendientes;
    
    if (pendientes.length === 0) {
        rejillaPeliculas.innerHTML = `
            <div class="empty-favorites">
                <p>No tienes películas pendientes.</p>
                <p>¡Añade algunas para ver más tarde!</p>
            </div>
        `;
    } else {
        renderizarPeliculas(pendientes, rejillaPeliculas);
    }
}

function mostrarVistaFavoritos() {
    vistaFavoritos = true;
    vistaPendientes = false;
    btnFavoritos.classList.add('active');
    btnPendientes.classList.remove('active');
    
    contenedorFiltros.style.display = 'none';
    encabezadoFavoritos.style.display = 'flex';
    encabezadoPendientes.style.display = 'none';
    
    rejillaPeliculas.innerHTML = '';
    const msgExistente = document.getElementById('end-msg');
    if (msgExistente) msgExistente.remove();

    const favoritos = obtenerFavoritos();
    peliculasActuales = favoritos;
    
    if (favoritos.length === 0) {
        rejillaPeliculas.innerHTML = `
            <div class="empty-favorites">
                <p>No tienes películas en favoritos.</p>
                <p>¡Explora y añade algunas!</p>
            </div>
        `;
    } else {
        renderizarPeliculas(favoritos, rejillaPeliculas);
    }
}

function mostrarVistaInicio() {
    vistaFavoritos = false;
    vistaPendientes = false;
    btnFavoritos.classList.remove('active');
    btnPendientes.classList.remove('active');
    
    contenedorFiltros.style.display = 'block';
    encabezadoFavoritos.style.display = 'none';
    encabezadoPendientes.style.display = 'none';
    
    if (modoBusqueda && consultaActual) {
        buscarPeliculas(consultaActual, true);
    } else {
        cargarPeliculas(true);
    }
}

async function mostrarDetallesPelicula(id) {
    try {
        const pelicula = await API.obtenerDetallesPelicula(id);
        const videos = await API.obtenerVideosPelicula(id);
        const creditos = await API.obtenerCreditosPelicula(id);
        const recomendaciones = await API.obtenerRecomendaciones(id);
        const resenas = await API.obtenerResenasPelicula(id);
        
        const trailer = videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        const claveVideo = trailer ? trailer.key : null;

        renderizarDetallesPelicula(pelicula, cuerpoModal, claveVideo, creditos, recomendaciones, resenas);
        modalPelicula.classList.add('show');
        
        const tarjetasRec = cuerpoModal.querySelectorAll('.rec-card');
        tarjetasRec.forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                mostrarDetallesPelicula(tarjeta.dataset.id);
            });
        });

    } catch (error) {
        console.error(error);
        alert('Error al cargar detalles de la película.');
    }
}
