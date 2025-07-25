import { Page } from "../components/layout/page";
import React from "react";

export const HomePage: React.FC = () => {
  return (
    <Page>
      <main className="flex-grow bg-background-page text-text-heading">
        <section className="relative bg-gradient-to-br from-accent to-primary-dark text-text-on-accent py-20 px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Simplifica tus tareas, maximiza tu productividad.
              </h1>
              <p className="text-xl md:text-2xl font-light mb-6">
                Tarjetas de Tareas, Listas, Tableros<br />
                Arrastrar y soltar
              </p>
              <button className="px-8 py-4 bg-primary text-text-on-accent text-lg font-semibold rounded-lg hover:bg-primary-dark transition duration-300 transform hover:scale-105 shadow-lg">
                Saber Más
              </button>
            </div>

            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src="https://imgs.search.brave.com/7WNY_QRUFxwivusSxIeNog9dVL2TneO5PYrt_2Vr_Cc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuYXNhbmEuYml6/L3RyYW5zZm9ybS9h/YzI1Nzg5NS1jZGY1/LTRmZTItOGEzNC0y/YmVmNmFhNDE2OGUv/aW5saW5lLWFnaWxl/LXNwcmludC1wbGFu/bmluZy0xLTJ4P2lv/PXRyYW5zZm9ybTpm/aWxsLHdpZHRoOjI1/NjAmZm9ybWF0PXdl/YnA"
                alt="Kanban Board Interface"
                className="w-full max-w-lg rounded-lg shadow-2xl transform rotate-3 scale-105"
              />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
            <div className="absolute w-64 h-64 bg-accent-light rounded-full -top-16 -left-16 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute w-64 h-64 bg-primary-light rounded-full -bottom-20 right-0 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute w-64 h-64 bg-primary-lightest rounded-full top-1/3 left-1/4 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </section>

        <section className="py-20 px-6 md:px-12 bg-background-light-grey">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-text-heading">Características Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background-card p-8 rounded-lg shadow-lg flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-accent-lightest rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.586-1.586A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L5.707 6.293A1 1 0 015 6.586V7a2 2 0 00-2 2zm0 2h12v8H4V7z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-heading">Kanban Board</h3>
                <p className="text-text-body text-center">Visualiza y gestiona tus tareas con facilidad.</p>
              </div>
              <div className="bg-background-card p-8 rounded-lg shadow-lg flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-primary-lightest rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.66 14.93A8.995 8.005 0 0112 18c-.015 0-.029-.001-.044-.001-.383 0-.761-.019-1.139-.06a.75.75 0 01-.767-.681.75.75 0 01.68-.767c.307-.03 1.054-.052 1.25-.052.128 0 .256.007.384.02a8.987 8.987 0 006.182-3.816.75.75 0 011.23.966zM12 12a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1zM6 10a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-heading">Colaboración</h3>
                <p className="text-text-body text-center">Trabaja en equipo en tiempo real sin esfuerzo.</p>
              </div>
              <div className="bg-background-card p-8 rounded-lg shadow-lg flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-success-lightest rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-heading">Seguimiento de Progreso</h3>
                <p className="text-text-body text-center">Mantente al tanto del avance de tus proyectos.</p>
              </div>
              <div className="bg-background-card p-8 rounded-lg shadow-lg flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-primary-lightest rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-heading">Calendario Integrado</h3>
                <p className="text-text-body text-center">Organiza tus plazos y eventos importantes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 md:px-12 bg-background-page">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-text-heading">Lo que dicen nuestros usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background-light-grey p-6 rounded-lg shadow-md flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Avatar Testimonio"
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-accent-light"
                />
                <p className="italic text-text-body mb-4">
                  "Esta aplicación ha transformado la forma en que gestionamos nuestros proyectos. ¡Absolutamente indispensable!"
                </p>
                <p className="font-semibold text-text-heading">- Ana García, CEO en Empresa X</p>
              </div>
              <div className="bg-background-light-grey p-6 rounded-lg shadow-md flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/44.jpg"
                  alt="Avatar Testimonio"
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-primary-light"
                />
                <p className="italic text-text-body mb-4">
                  "La interfaz es increíblemente intuitiva y las funciones de colaboración son de otro nivel."
                </p>
                <p className="font-semibold text-text-heading">- Juan Pérez, Product Manager</p>
              </div>
              <div className="bg-background-light-grey p-6 rounded-lg shadow-md flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/79.jpg"
                  alt="Avatar Testimonio"
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-primary-light"
                />
                <p className="italic text-text-body mb-4">
                  "Nunca pensé que la gestión de tareas pudiera ser tan sencilla y visualmente agradable."
                </p>
                <p className="font-semibold text-text-heading">- Sofía Castro, Diseñadora UX</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 md:px-12 bg-background-light-grey">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-text-heading">Cómo puedes usar nuestra plataforma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-accent">Gestión de Proyectos</h3>
                <p className="text-text-body mb-4">
                  Desde pequeños equipos hasta grandes empresas, nuestra herramienta se adapta a tus necesidades de gestión de proyectos complejos.
                </p>
                <a href="#" className="text-accent hover:underline font-semibold">Más información &rarr;</a>
              </div>
              <div className="bg-background-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Planificación de Eventos</h3>
                <p className="text-text-body mb-4">
                  Organiza cada detalle de tus eventos, desde la logística hasta las invitaciones, de manera visual.
                </p>
                <a href="#" className="text-primary hover:underline font-semibold">Más información &rarr;</a>
              </div>
              <div className="bg-background-card p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Seguimiento Personal</h3>
                <p className="text-text-body mb-4">
                  Gestiona tus tareas personales, objetivos y hábitos diarios con un sistema Kanban fácil de usar.
                </p>
                <a href="#" className="text-primary hover:underline font-semibold">Más información &rarr;</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Page>
  );
};