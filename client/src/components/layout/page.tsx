import type { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string;
}
export const Page = ({children, className = "" }: PageProps) => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-4">
      <h1
        className={`title pb-5 text-center text-2xl font-medium ${className}`}
      >
      </h1>
      {children}
    </main>
  );
};
