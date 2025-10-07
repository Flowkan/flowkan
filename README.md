# Flowkan - Tu gestor de proyectos visual y colaborativo

Flowkan es una aplicación de gestión de proyectos estilo Kanban que te ayuda a organizar, visualizar y colaborar en tus tareas de forma intuitiva. Inspirada en herramientas como Trello, Flowkan ofrece una experiencia fluida y en tiempo real para equipos de todos los tamaños.

## 🚀 Características Principales

- **Gestión de Tableros y Tareas:** Crea y organiza tableros de forma sencilla. Filtra los tableros por nombre o por miembros para encontrar lo que necesitas rápidamente.
- **Colaboración en Tiempo Real:** Utiliza WebSockets para una sincronización instantánea. Ve a los miembros de tu equipo trabajar en el tablero y comunícate con ellos a través de un chat en vivo.
- **Funcionalidad Drag-and-Drop:** Organiza las tareas moviéndolas entre columnas o reordenándolas dentro de ellas con una interfaz de arrastrar y soltar.
- **Gestión Detallada de Tareas:** Cada tarea puede tener una descripción, un checklist, fechas de vencimiento, etiquetas y miembros asignados.
- **Soporte Multilenguaje:** Con i18next, la aplicación soporta múltiples idiomas.
- **Diseño Responsivo y Moderno:** Interfaz de usuario construida con Tailwind CSS, optimizada para diferentes dispositivos.

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React:** Biblioteca de JavaScript para la interfaz de usuario.
- **TypeScript:** Añade tipado estático para un desarrollo más robusto.
- **Tailwind CSS:** Framework de CSS para un estilo rápido y coherente.
- **Redux:** Para la gestión del estado de la aplicación.
- **@hello-pangea/dnd:** Implementación de la funcionalidad de arrastrar y soltar.
- **i18next:** Para la internacionalización.

### Backend

- **Node.js & Express:** Entorno de ejecución y framework para el servidor.
- **WebSockets:** Para la comunicación bidireccional en tiempo real.
- **[PostgreSQL]:** Para la persistencia de datos.

### Infraestructura y Despliegue

- **Docker:** Para empaquetar la aplicación en contenedores, asegurando la consistencia en todos los entornos.
- **GitHub Actions:** Para automatizar el proceso de integración y despliegue continuo (CI/CD). Cada release lanzada se despliega automáticamente en producción.

## ⚙️ Cómo Ejecutar el Proyecto

### Requisitos

- Node.js (v18 o superior)
- npm o yarn
- Docker y Docker Compose (recomendado para desarrollo y producción)

### Pasos de Configuración

1.  **Clona el repositorio:**

    ```bash
    git clone [https://github.com/Flowkan/flowkan.git](https://github.com/Flowkan/flowkan.git)
    cd flowkan/client
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env.development` en el directorio raíz con tus credenciales y configuraciones (vease .env.example). Mismo paso para carpeta flowkan/server

3.  **Ejecuta con Docker Compose:**
    La forma más sencilla de levantar el proyecto (backend y base de datos) es con Docker Compose.

    ```bash
    docker-compose up --build -d
    ```

    Esto instalará las dependencias, construirá las imágenes y levantará los servicios.

4.  **Iniciar la base de datos con Prisma**
    - **En la carpeta Backend ejecutar:**
      ```bash
      npm run db:reset
      ```

## 🌐 Enlaces del Proyecto

- **Página en Producción:** [https://www.flowkan.es](https://www.flowkan.es)

## ✍️ Autores

- **Oscar Cañas** - [GitHub](https://github.com/virgulilla)
- **Hector Lozano** - [GitHub](https://github.com/HLozano87)
- **Paula Barrionuevo** - [GitHub](https://github.com/PaulaBCdev)

---
