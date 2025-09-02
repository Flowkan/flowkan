import { type FormEvent, type ReactNode } from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: ReactNode;
  method?: "GET" | "POST";
  initialValue?: { [key: string]: string | boolean };
}

export const Form = ({
  onSubmit,
  className,
  children,
  method,
  initialValue = {},
  ...rest
}: FormProps) => {
  
  return (
    <form method={method} onSubmit={onSubmit} className={className} {...rest}>
      {children}
    </form>
  );
};
