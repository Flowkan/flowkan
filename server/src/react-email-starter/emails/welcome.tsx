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
  Link,
} from "@react-email/components";
import HeaderEmail from "./components/header";

interface WelcomeProps {
  name?: string;
  url?: string;
  language?: string;
}

export const Welcome = ({
  name = "Usuario",
  url = "http://localhost:5173",
  language = "es",
}: WelcomeProps) => {
  const previewText =
    language === "es"
      ? `¡Bienvenido a Flowkan, ${name}! Empieza a organizar tus proyectos.`
      : `Welcome to Flowkan, ${name}! Start organizing your projects.`;
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
                {language === "es" ? (
                  <>¡Hola, {name}! Te damos la bienvenida.</>
                ) : (
                  <>Hi, {name}! Welcome aboard.</>
                )}
              </Heading>
              <Text className="text-slate-700 leading-relaxed mt-4">
                {language === "es" ? (
                  <>
                    Estamos muy contentos de que te unas a nosotros. Flowkan es
                    tu nuevo centro de mando para organizar tareas, gestionar
                    proyectos y colaborar con tu equipo de una manera visual e
                    intuitiva.
                  </>
                ) : (
                  <>
                    We're thrilled to have you join us. Flowkan is your new
                    command center for organizing tasks, managing projects, and
                    collaborating with your team in a visual and intuitive way.
                  </>
                )}
              </Text>
              <Text className="text-slate-700 leading-relaxed mt-4">
                {language === "es" ? (
                  <>
                    Para empezar, te recomendamos crear tu primer tablero y
                    añadir algunas tareas. ¡Es la mejor forma de ver el poder de
                    Flowkan en acción!
                  </>
                ) : (
                  <>
                    To get started, we recommend creating your first board and
                    adding a few tasks. It's the best way to see Flowkan's power
                    in action!
                  </>
                )}
              </Text>

              <Section className="text-center mt-6">
                <Button
                  href={`${url}/boards`}
                  className="bg-brand text-white font-semibold py-3 px-6 rounded-lg"
                >
                  {language === "es" ? "Ir a mi panel" : "Go to my dashboard"}
                </Button>
              </Section>
            </Section>

            <Section className="px-10 pb-8">
              <Hr className="border-slate-200" />
              <Heading
                as="h3"
                className="text-xl font-bold text-slate-800 mt-6"
              >
                Próximos pasos recomendados:
              </Heading>
              <ul className="list-disc list-inside text-slate-700 mt-4">
                <li>
                  <strong>Crea tu primer tablero:</strong> Organiza un proyecto
                  personal o de equipo.
                </li>
                <li>
                  <strong>Invita a tus colaboradores:</strong> La magia de
                  Flowkan está en el trabajo en equipo.
                </li>
                <li>
                  <strong>Personaliza tus columnas:</strong> Adapta el flujo de
                  trabajo a tus necesidades.
                </li>
              </ul>
            </Section>

            <Section className="text-center p-6 bg-slate-100">
              <Text className="text-sm text-slate-500">
                {language === "es" ? (
                  <>
                    Si tienes alguna pregunta, visita nuestra{" "}
                    <Link
                      className="text-brand underline"
                      href={`${url}/ayuda`}
                    >
                      sección de ayuda
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    If you have any questions, visit our{" "}
                    <Link
                      className="text-brand underline"
                      href={`${url}/ayuda`}
                    >
                      help section
                    </Link>
                    .
                  </>
                )}
              </Text>
              <Text className="text-xs text-slate-400 mt-2">
                © {new Date().getFullYear()} Flowkan.es –{" "}
                {language === "es"
                  ? "Todos los derechos reservados."
                  : "All rights reserved."}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Welcome;
