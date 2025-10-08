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
      <Section className="bg-brand flex justify-center text-center p-0 items-center rounded-lg">
        <Heading
          as="h1"
          className="flex items-center justify-center text-3xl font-normal p-2 m-1"
        >
          <Img
            src="http://localhost:3001/static/favicon.ico"
            alt="Flowkan-icon"
            width={32}
            height={32}
          />
          <span className="text-white pt-2 pb-2 mt-2">lowkan</span>
          {/* lowkan */}
        </Heading>
      </Section>
    </Tailwind>
  );
};

export default HeaderEmail;
