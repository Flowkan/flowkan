import * as React from 'react';
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
} from '@react-email/components';
import HeaderEmail from './components/header';


interface WelcomeProps {
  name?: string;
  url?:string
}

export const Welcome = ({
  name = 'Usuario',
  url="http://localhost:5173"
}: WelcomeProps) => {
  const previewText = `¡Bienvenido a Flowkan, ${name}! Empieza a organizar tus proyectos.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
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
        <Body className="bg-slate-50 font-sans">
          <Container className="bg-white max-w-xl my-12 rounded-lg shadow-lg overflow-hidden">                        
            <HeaderEmail />            
            <Section className="px-10 py-8">
              <Heading as="h2" className="text-2xl font-bold text-slate-800">
                ¡Hola, {name}! Te damos la bienvenida.
              </Heading>
              <Text className="text-slate-700 leading-relaxed mt-4">
                Estamos muy contentos de que te unas a nosotros. Flowkan es tu nuevo centro de mando para organizar tareas, gestionar proyectos y colaborar con tu equipo de una manera visual e intuitiva.
              </Text>
              <Text className="text-slate-700 leading-relaxed mt-4">
                Para empezar, te recomendamos crear tu primer tablero y añadir algunas tareas. ¡Es la mejor forma de ver el poder de Flowkan en acción!
              </Text>
                            
              <Section className="text-center mt-6">
                <Button
                  href={`${url}/boards`}
                  className="bg-brand text-white font-semibold py-3 px-6 rounded-lg"
                >
                  Ir a mi panel
                </Button>
              </Section>
            </Section>

            <Section className="px-10 pb-8">
              <Hr className="border-slate-200" />
              <Heading as="h3" className="text-xl font-bold text-slate-800 mt-6">
                Próximos pasos recomendados:
              </Heading>
              <ul className="list-disc list-inside text-slate-700 mt-4">
                <li><strong>Crea tu primer tablero:</strong> Organiza un proyecto personal o de equipo.</li>
                <li><strong>Invita a tus colaboradores:</strong> La magia de Flowkan está en el trabajo en equipo.</li>
                <li><strong>Personaliza tus columnas:</strong> Adapta el flujo de trabajo a tus necesidades.</li>
              </ul>
            </Section>
            
            <Section className="text-center p-6 bg-slate-100">
              <Text className="text-sm text-slate-500">
                Si tienes alguna pregunta, visita nuestra <a href={`${url}/ayuda`} className="text-brand underline">sección de ayuda</a>.
              </Text>
              <Text className="text-xs text-slate-400 mt-2">
                © {new Date().getFullYear()} Flowkan.es - Todos los derechos reservados.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Welcome;
