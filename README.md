# 🎬 CINEFLIX - Proyecto Final React 2º DAW

**Equipo de Desarrollo:**
*   Ismael
*   Jose Luis
*   Mario

## 📋 Objetivos
El objetivo principal de este proyecto es desarrollar una **Aplicación de Página Única (SPA)** moderna y funcional utilizando el ecosistema de **React** y **TypeScript**. La aplicación permite a los usuarios explorar, buscar y filtrar información sobre películas y series de televisión utilizando la API pública de **The Movie Database (TMDB)**.

Este proyecto demuestra el dominio de:
*   Arquitectura de componentes (Atomic Design).
*   Enrutamiento complejo con **React Router v6**.
*   Manejo de estado y efectos asíncronos (Hooks).
*   Integración de APIs externas con **Axios**.
*   Estilizado moderno y responsivo con **Tailwind CSS**.

## ✨ Características Principales
1.  **Exploración de Tendencias:** Página de inicio con las películas y series más populares del momento, actualizadas diariamente.
2.  **Búsqueda en Tiempo Real:** Buscador global que permite encontrar contenidos por título.
3.  **Filtrado Avanzado:** Página dedicada (`/movies`) para filtrar películas por **Género** y **Criterios de Ordenación** (Popularidad, Votos, Novedades).
4.  **Detalles Exquisitos:** Vistas de detalle inmersivas con imágenes de fondo (backdrops), pósters, puntuaciones, sinopsis y reparto.
5.  **Diseño Responsivo:** Interfaz adaptada a móviles, tablets y escritorio con un tema oscuro "Cinemático".

## 🛠️ Tecnologías Utilizadas
*   **Core:** React 18, TypeScript, Vite.
*   **Enrutamiento:** React Router DOM v6.
*   **Peticiones HTTP:** Axios.
*   **Estilos:** Tailwind CSS, PostCSS.
*   **Iconos & UI:** Lucide React (opcional), Heroicons.
*   **API:** The Movie Database (TMDB) API v3.

## 🚀 Instrucciones de Instalación

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/cineflix-proyecto-final.git
    cd cineflix-proyecto-final
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    *   Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`).
    *   Añade tu API Key de TMDB:
        ```
        VITE_TMDB_API_KEY=tu_api_key_aqui
        ```

4.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📖 Guía de Uso

### Navegación
*   **Inicio:** Muestra un carrusel (Hero) con la película top #1 y listas horizontales de tendencias.
*   **Películas:** Accede al catálogo completo. Usa los "Badges" superiores para filtrar por *Acción, Comedia, Drama...* y el selector para ordenar los resultados.
*   **Buscador:** Escribe en la barra de búsqueda de la cabecera o de la portada para encontrar títulos específicos.

### Estructura del Proyecto
El código sigue una arquitectura escalable y modular:

```
src/
├── components/       # Componentes organizados por Atomic Design
│   ├── atoms/        # Botones, Inputs, Badges, Loaders
│   ├── molecules/    # Tarjetas de película, Barras de búsqueda
│   └── organisms/    # Grids de películas, Navbar, Footer
├── layout/           # Layouts principales (MainLayout)
├── pages/            # Vistas de las rutas (Home, Search, Details, Movies)
├── router/           # Configuración de rutas (React Router)
├── services/         # Cliente Axios y funciones de la API
└── types/            # Interfaces TypeScript para tipado estricto
```

## 📡 Documentación de la API
La aplicación consume los siguientes endpoints de TMDB:

*   `GET /trending/all/{time_window}`: Para la portada.
*   `GET /search/multi`: Para la barra de búsqueda.
*   `GET /discover/movie`: Para el filtrado y ordenación.
*   `GET /movie/{id}` y `GET /tv/{id}`: Para las vistas de detalle.
*   `GET /genre/movie/list`: Para obtener la lista de géneros disponibles.

## 📝 Notas de Implementación
*   **Routing Dinámico:** Se ha implementado una ruta genérica `/movie/:id` y `/tv/:id` que reutiliza el componente `DetailsPage` adaptándolo según el tipo de contenido.
*   **Optimización:** Se usa `Debounce` en la búsqueda para minimizar las llamadas a la API mientras el usuario escribe.
*   **Diseño Atómico:** Los componentes base (`Button`, `Badge`) son altamente reutilizables y permiten cambiar el diseño de toda la app desde un solo punto.

## 🌐 Aplicación Desplegada
Puedes ver la versión en producción aquí:
*(Enlace pendiente de despliegue en Vercel/Netlify)*

---
Desarrollado con ❤️ por **Ismael, Jose Luis y Mario** para **Desarrollo Web en Entorno Cliente**.
