import * as React from "react";
import { Container, Link, Section } from "@react-email/components";

const FooterEmail = ({ language = "es" }: { language?: string }) => {
  const rightsText =
    language === "es" ? "Todos los derechos reservados" : "All rights reserved";
  const emailText = "Email";
  const phoneText = language === "es" ? "Teléfono" : "Phone";
  const addressText = language === "es" ? "Dirección" : "Address";
  return (
    <Container className="bg-gray-100 rounded-lg py-2 px-3">
      <Section className="pt-2 text-gray-500 text-sm flex justify-center">
        &copy; Flowkan {new Date().getFullYear()} {rightsText}
      </Section>
      <Section>
        <ul className="text-sm list-none p-0 text-gray-500">
          <li>
            {emailText}:{" "}
            <Link href="mailto:info@flowkan.es">info@flowkan.es</Link>
          </li>
          <li>{phoneText}: +34 123 45 67 89</li>
          <li>{addressText}: Calle Ficticia 123, 28001 Madrid, España</li>
        </ul>
      </Section>
    </Container>
  );
};

export default FooterEmail;
