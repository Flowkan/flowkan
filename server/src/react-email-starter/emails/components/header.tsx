import * as React from "react";
import { Heading, Img, Section, Tailwind } from "@react-email/components";

const HeaderEmail = () => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#1e2939",
            },
          },
        },
      }}
    >
      <Section className="bg-brand text-center p-4 rounded-lg">
        <Heading as="h1" className="text-white text-3xl font-light text-center">
          <Img
            src="https://flowkan.es/favicon.ico"
            alt="Flowkan-icon"
            width={32}
            height={32}
            className="inline-block align-middle"
          />
          <span className="inline-block align-middle">lowkan</span>
        </Heading>
      </Section>
    </Tailwind>
  );
};

export default HeaderEmail;
