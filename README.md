# 🎬 NEXUS - Dashboard de Películas

Bienvenido a **NEXUS**, una aplicación web moderna y elegante para explorar el mundo del cine. Descubre películas populares, busca tus favoritas, gestiona tu lista de pendientes y guarda las que más te gusten.

## ✨ Características

- **Exploración**: Navega por películas Populares, Mejor Valoradas, Próximamente y En Cartelera.
- **Búsqueda Inteligente**: Encuentra cualquier película con un buscador integrado y fluido.
- **Detalles Completos**: Accede a información detallada, reparto, trailers y reseñas.
- **Personalización**:
  - ❤️ **Favoritos**: Guarda tus películas amadas.
  - 🕒 **Pendientes**: Crea tu lista de "Ver más tarde".
  - 🌙/☀️ **Tema Oscuro/Claro**: Adaptable a tu preferencia.
- **Diseño Premium**: Interfaz moderna con efectos Glassmorphism y animaciones suaves.
- **PWA**: Instalable como aplicación en tu dispositivo.

## 🛠️ Tecnologías Usadas

Este proyecto ha sido construido utilizando tecnologías web estándar, sin frameworks pesados, para garantizar el máximo rendimiento y aprendizaje.

- **HTML5**: Estructura semántica.
- **CSS3**:
  - Variables CSS para temas.
  - Flexbox y Grid para maquetación.
  - Animaciones y transiciones.
  - Diseño Responsivo (Mobile First).
- **JavaScript (ES6+)**:
  - Módulos (import/export).
  - Async/Await para peticiones API.
  - Manipulación del DOM.
  - LocalStorage para persistencia de datos.
- **API**: [TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api) para datos de películas.

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu computadora:

1.  **Clonar el repositorio** (o descargar los archivos):

    ```bash
    git clone <tu-repositorio-url>
    cd proyecto-dashboard-de-peliculas
    ```

2.  **Configuración**:

    - El proyecto utiliza una clave de API de TMDB.
    - Asegúrate de que el archivo `js/config.js` contenga una clave válida.
    - _Nota: En un entorno de producción real, las claves no deberían exponerse en el frontend._

3.  **Ejecutar**:

    - Debido a que el proyecto usa Módulos de ES6 (`import`/`export`), necesitas servirlo a través de un servidor local (no puedes simplemente abrir el `index.html` con doble clic).
    - **Opción A (VS Code)**: Instala la extensión "Live Server", abre `index.html` y haz clic en "Go Live".
    - **Opción B (Python)**:
      ```bash
      # Python 3
      python -m http.server 8000
      ```
    - **Opción C (Node.js)**:
      ```bash
      npx serve .
      ```

4.  **Abrir en el navegador**:
    - Ve a `http://localhost:5500` (o el puerto que te indique tu servidor).

## 📂 Estructura del Proyecto

```
/
├── index.html          # Estructura principal
├── css/
│   └── style.css       # Estilos y temas
├── js/
│   ├── main.js         # Lógica principal y eventos
│   ├── api.js          # Comunicación con TMDB
│   ├── ui.js           # Renderizado de interfaz
│   ├── storage.js      # Gestión de LocalStorage
│   └── config.js       # Configuración (API Key)
├── sw.js               # Service Worker (PWA)
└── manifest.json       # Manifiesto de la App
```

---

Desarrollado con ❤️ para los amantes del cine.
