import * as React from 'react';
import {
  Container,
  Link,
  Section,
} from "@react-email/components";

const FooterEmail = () => {
  return (
    <Container className="bg-gray-100 rounded-lg py-2 px-3">
      <Section className="pt-2 text-gray-500 text-sm flex justify-center">
        &copy; Flowkan {new Date().getFullYear()} Todos los derechos reservados
      </Section>           
      <Section>
        <ul className="text-sm list-none p-0 text-gray-500">
          <li>
            Email: <Link
              href="mailto:info@flowkan.com"              
            >
              info@flowkan.com
            </Link>            
          </li>
          <li>Teléfono: +34 123 45 67 89</li>
          <li>Dirección Calle Ficticia 123, 28001 Madrid, España</li>
        </ul>   
      </Section>
    </Container>
  );
};

export default FooterEmail;
