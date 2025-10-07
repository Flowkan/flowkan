import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import HeaderEmail from "./components/header";
import FooterEmail from "./components/footer";

interface ConfirmationProps {
  name: string;
  url: string;
  token: string;
  language?: string;
}

export const Confirmation = ({
  name,
  url,
  token,
  language = "es",
}: ConfirmationProps) => {
  const title =
    language === "es"
      ? "Confirma tu dirección de correo electrónico"
      : "Confirm your email address";
  const greeting =
    language === "es"
      ? `¡Hola, ${name}! Te damos la bienvenida.`
      : `Hello, ${name}! Welcome aboard.`;
  const introText =
    language === "es"
      ? "Estamos muy contentos de que te unas a nosotros. Flowkan es tu nuevo centro de mando para organizar tareas, gestionar proyectos y colaborar con tu equipo de una manera visual e intuitiva."
      : "We are thrilled to have you with us. Flowkan is your new command center to organize tasks, manage projects, and collaborate with your team in a visual and intuitive way.";
  const bodyText =
    language === "es"
      ? "Para empezar, te recomendamos crear tu primer tablero y añadir algunas tareas. ¡Es la mejor forma de ver el poder de Flowkan en acción!"
      : "To get started, we recommend creating your first board and adding some tasks. It’s the best way to see the power of Flowkan in action!";
  const actionText =
    language === "es"
      ? "Confirma tu dirección de email"
      : "Confirm your email address";
  const nextStepsTitle =
    language === "es"
      ? "Próximos pasos recomendados:"
      : "Recommended Next Steps:";

  return (
    <Html>
      <Head />
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
        <Body className="p-2 bg-gray-200">
          <Heading as="h2">{title}</Heading>
          <Container className="bg-white p-4 rounded-lg">
            <HeaderEmail />

            <Section className="px-10">
              <Heading as="h2" className="text-2xl font-bold text-slate-800">
                {greeting}
              </Heading>
              <Text className="text-slate-700 leading-relaxed mt-4">
                {introText}
              </Text>
              <Text className="text-slate-700 leading-relaxed">{bodyText}</Text>
            </Section>
            <Section className="px-10">
              <Heading as="h3" className="text-lg text-slate-800">
                {actionText}
              </Heading>
              <Text className="text-slate-700 leading-relaxed">
                {language === "es" ? (
                  <>
                    Haz click{" "}
                    <Link
                      className="text-brand"
                      href={`${url}/confirm?token=${token}`}
                    >
                      aqui
                    </Link>{" "}
                    para confirmar tu cuenta.
                  </>
                ) : (
                  <>
                    Click{" "}
                    <Link
                      className="text-brand"
                      href={`${url}/confirm?token=${token}`}
                    >
                      here
                    </Link>{" "}
                    to confirm your account.
                  </>
                )}
              </Text>
            </Section>
            <Section className="px-10 pb-8">
              <Hr className="border-slate-200" />
              <Heading
                as="h3"
                className="text-xl font-bold text-slate-800 mt-6"
              >
                {nextStepsTitle}
              </Heading>
              <ul className="list-disc list-inside text-slate-700 mt-4">
                <li>
                  {language === "es" ? (
                    <>
                      <strong>Crea tu primer tablero:</strong> Organiza un
                      proyecto personal o de equipo.
                    </>
                  ) : (
                    <>
                      <strong>Create your first board:</strong> Organize a
                      personal or team project.
                    </>
                  )}
                </li>
                <li>
                  {language === "es" ? (
                    <>
                      <strong>Invita a tus colaboradores:</strong> La magia de
                      Flowkan está en el trabajo en equipo.
                    </>
                  ) : (
                    <>
                      <strong>Invite your collaborators:</strong> The magic of
                      Flowkan lies in teamwork.
                    </>
                  )}
                </li>
                <li>
                  {language === "es" ? (
                    <>
                      <strong>Personaliza tus columnas:</strong> Adapta el flujo
                      de trabajo a tus necesidades.
                    </>
                  ) : (
                    <>
                      <strong>Customize your columns:</strong> Adapt the
                      workflow to your needs.
                    </>
                  )}
                </li>
              </ul>
            </Section>

            <FooterEmail language={language} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Confirmation;
