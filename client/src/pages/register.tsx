import { Page } from "../components/layout/page";
import { NavLink } from 'react-router-dom';

export const RegisterPage = () => {

  const handleChange = () => {};

  const handleSubmit = () => {};

  return (
    <Page>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 bg-background-page">
        <div className="max-w-md w-full space-y-8 p-10 bg-background-card rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
          <div>
            <h1 className="mt-6 text-center text-4xl font-extrabold text-text-heading">
              Crea tu Cuenta
            </h1>
            <p className="mt-2 text-center text-sm text-text-body">
              ¿Ya tienes una cuenta?{' '}
              <NavLink to="/login" className="font-medium text-text-link hover:text-accent-hover">
                Inicia sesión aquí
              </NavLink>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="full-name" className="sr-only">Nombre Completo</label>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-4 py-3 border border-border-light placeholder-text-placeholder text-text-heading focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Nombre completo"
                  onChange={handleChange}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="email-address" className="sr-only">Dirección de Email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-4 py-3 border border-border-light placeholder-text-placeholder text-text-heading focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico"
                  onChange={handleChange}
                />
              </div>

              <div className="mt-3">
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-4 py-3 border border-border-light placeholder-text-placeholder text-text-heading focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  onChange={handleChange}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="confirm-password" className="sr-only">Confirmar Contraseña</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-4 py-3 border border-border-light placeholder-text-placeholder text-text-heading focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Confirmar contraseña"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-text-on-accent bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-card transition-all duration-300 transform hover:scale-[1.005]"
              >
                Registrarse
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-card text-text-placeholder">
                O continúa con
              </span>
            </div>
          </div>

          <div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-border-light rounded-md shadow-sm bg-background-card text-sm font-medium text-text-body hover:bg-background-light-grey transition-colors duration-200"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="h-5 w-5 mr-2" />
                  Google
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-border-light rounded-md shadow-sm bg-background-card text-sm font-medium text-text-body hover:bg-background-light-grey transition-colors duration-200"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Logo" className="h-5 w-5 mr-2" />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};