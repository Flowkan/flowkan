import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import HeaderEmail from "./components/header";
import FooterEmail from "./components/footer";

interface PasswordResetProps {
  url: string;
  token: string;
}

const PasswordReset = ({ url, token }: PasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
      config={{
          theme: {
            extend: {
              colors: {
                brand: '#df539f', 
              },
            },
          },
        }}
      >
        <Body>
          <Container className="bg-white p-4 rounded-lg">
            <HeaderEmail />
            <Section className="flex-grow flex items-center justify-center">
              <Section className="mx-auto px-4">
                <Section className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden my-12">
                  <Section className="p-8">
                    <Section className="text-center">
                      <Heading as="h3" className="text-3xl font-bold text-gray-900">
                        Restablecer contraseña
                      </Heading>
                      <Text className="mt-4 text-gray-600 ">
                        Hemos recibido una solicitud para restablecer la
                        contraseña de tu cuenta. Haz clic en el botón de abajo
                        para continuar.
                      </Text>
                    </Section>
                    <Section className="mt-8 flex justify-center">
                      <Link
                        href={`${url}/change-password?token=${token}`}
                        className="w-full px-6 py-3 bg-brand text-center text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                      >
                        Restablecer contraseña
                      </Link>
                    </Section>
                    <Section className="mt-8 text-center">
                      <Text className="text-sm text-gray-500 ">
                        Si no solicitaste un restablecimiento de contraseña,
                        puedes ignorar este correo electrónico.
                      </Text>
                    </Section>
                  </Section>
                </Section>
              </Section>
            </Section>
            <FooterEmail />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordReset;


