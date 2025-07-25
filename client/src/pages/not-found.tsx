import { Link } from "react-router-dom";
import { Page } from "../components/layout/page";

export const NotFound = () => {
  return (
    <Page>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 bg-background-page">
        <div className="max-w-md w-full space-y-8 text-center p-10 bg-background-card rounded-xl shadow-2xl">
          <h1 className="text-8xl font-extrabold text-primary tracking-tight">
            404
          </h1>
          <p className="mt-4 text-3xl font-bold text-text-heading">
            Página no encontrada
          </p>
          <p className="mt-2 text-lg text-text-body">
            Lo sentimos, no pudimos encontrar la página que buscas.
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-md text-text-on-accent bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background-card transition-all duration-300 transform hover:scale-[1.005]"
            >
              Volver a inicio
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};