import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import HeaderEmail from "./components/header";
import FooterEmail from "./components/footer";

interface ConfirmationProps {
  name: string;
  url: string;
  token: string;
}

export const Confirmation = ({ name, url, token }: ConfirmationProps) => (
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
      <Body className="p-2 bg-gray-200">
        <Preview>Confirma su direccionde email</Preview>
        <Container className="bg-white p-4 rounded-lg">
          <HeaderEmail />
          <Heading className="text-3xl">Confirma su direccionde email</Heading>
          <Heading as="h3">Bienvenido {name}</Heading>
          <Text className="text-lg">
            Muchas gracias por su registro en flowkan, esperamos que le sea de
            utilidad todas nuestras funciones
          </Text>
          <Text>
            Haz click <Link className='text-brand' href={`${url}/confirm?token=${token}`}>aqui</Link>{" "}
            para confirmar tu cuenta.
          </Text>
          <FooterEmail />
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default Confirmation;

