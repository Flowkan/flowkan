import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import HeaderEmail from "./components/header";

interface GoodByeProps {
  name?: string;
  url?: string;
}

export const GoodBye = ({
  name = "Usuario",
  url = "http://localhost:5173",
}: GoodByeProps) => {
  const previewText = `¡Hasta pronto, ${name}! Esperamos verte pronto de vuelta.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#df539f",
              },
            },
          },
        }}
      >
        <Body className="bg-slate-50 font-sans">
          <Container className="bg-white max-w-xl my-12 rounded-lg shadow-lg overflow-hidden">
            <HeaderEmail />
            <Section className="px-10 py-8">
              <Heading as="h2" className="text-2xl font-bold text-slate-800">
                {name} tu cuenta en Flowkan ha sido eliminada.
              </Heading>
              <Text className="text-slate-700 leading-relaxed mt-4">
                Sabemos que despedirse no siempre es fácil. En Flowkan, cada
                tablero fue una idea en movimiento, cada tarea un paso hacia
                algo grande. Pero las buenas ideas siempre vuelven.
              </Text>

              <Text className="text-slate-700 leading-relaxed mt-4">
                Cuando estés listo para crear algo nuevo, Flowkan seguirá aquí
                para ayudarte a planificar, colaborar y dar vida a tus proyectos
                con la ayuda de la IA.
              </Text>

              <Text className="text-slate-700 leading-relaxed mt-4 flex flw-row">
                ¡Tu espacio en Flowkan te espera cuando quieras volver!
              </Text>
              <Text>Hasta pronto, {name}.</Text>

              <Section className="text-center mt-6">
                <Text>
                  Deseas volver a{" "}
                  <a href={`${url}/register`} className="text-brand underline">
                    registrarse
                  </a>
                  ?
                </Text>
              </Section>
            </Section>
            <Section className="text-center p-6 bg-slate-100">
              <Text className="text-sm text-slate-500">
                Si tienes alguna pregunta, visita nuestra{" "}
                <a href={`${url}/ayuda`} className="text-brand underline">
                  sección de ayuda
                </a>
                .
              </Text>
              <Text className="text-xs text-slate-400 mt-2">
                © {new Date().getFullYear()} Flowkan.es - Todos los derechos
                reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default GoodBye;
