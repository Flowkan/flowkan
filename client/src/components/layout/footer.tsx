import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark-footer text-border-light py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-text-on-accent mb-4">FlowKan</h4>
          <p className="text-sm leading-relaxed">
            FlowKan te ayuda a organizar tu trabajo y a tu equipo de forma visual y eficiente.
            Simplifica la gestión de proyectos y alcanza tus objetivos.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent-hover transition-colors">Política de privacidad</a></li>
            <li><a href="#" className="hover:text-accent-hover transition-colors">Términos y condiciones de servicio</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-text-on-accent mb-4">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@flowkan.com" className="hover:text-accent-hover transition-colors">info@flowkan.com</a></li>
            <li>Teléfono: +34 123 45 67 89</li>
            <li>Dirección: Calle Ficticia 123, 28001 Madrid, España</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-text-placeholder hover:text-text-on-accent transition-colors">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="text-text-placeholder hover:text-text-on-accent transition-colors">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="#" className="text-text-placeholder hover:text-text-on-accent transition-colors">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="#" className="text-text-placeholder hover:text-text-on-accent transition-colors">
              <i className="far fa-envelope text-lg"></i>
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold text-text-on-accent mb-4">Nuestros Clientes</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
            <img src="https://eodhistoricaldata.com/img/logos/US/MSFT.png?_gl=1*194tavy*_gcl_au*MTMxOTM5MTkwMC4xNzUzNDMzMDg4*FPAU*MTMxOTM5MTkwMC4xNzUzNDMzMDg4" alt="Logo Cliente Microsoft" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://imgs.search.brave.com/7Ev6F4Y44DFV2Ic7s--NpSt1UfOz8gnUJBACe6ubdIU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8wLzA2L0Ft/YXpvbl8yMDI0LnN2/Zy8yNTBweC1BbWF6/b25fMjAyNC5zdmcu/cG5n" alt="Logo Cliente Amazon" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg" alt="Logo Cliente KeepCoding" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://imgs.search.brave.com/r2CbaG60D2VNes-mVPEVBC_iJl_Uh1Hc7iFRXRS-tEM/rs:fit:200:200:1:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS96YlFTSFRjOURH/bE5rVjhzcXlWUUNp/RTdINzAwZkppM2R3/ZmNLeXBiTGNCejgx/TjE1UmlMN1JhY0dt/Rk03MHVWaGFPNg" alt="Logo Cliente Google Play" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg" alt="Logo Cliente Tech Solutions" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg" alt="Logo Cliente Global Corp" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg" alt="Logo Cliente Innovate" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://keepcoding.io/wp-content/uploads/2024/11/Logo-kc.svg" alt="Logo Cliente Synergy" className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </div>

      <div className="border-t border-border-dark mt-8 pt-6 text-center text-sm text-text-placeholder">
        &copy; Flowkan {new Date().getFullYear()} Todos los derechos reservados.
      </div>
    </footer>
  );
};