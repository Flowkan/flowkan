import * as React from 'react';
import { Heading, Section, Tailwind } from "@react-email/components";

const HeaderEmail = () => {
    return (   
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
            <Section className="bg-brand text-center p-10 rounded-lg">              
                <Heading as="h1" className="text-white text-3xl font-bold mt-4">
                    Flowkan
                </Heading>              
            </Section>
        </Tailwind>     
    );
};

export default HeaderEmail;
