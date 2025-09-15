import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface FieldProps {
    name: string;
    value: string;
    checked?:boolean;
    as?: "input" | "textarea";
    type?: HTMLInputTypeAttribute;
    className?: string;
    disabled?: boolean;
    rows?: number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,name: string,) => void;
}

function Field({
    name,
    value,
    as = "input",
    type = "text",
    rows = 0,
    disabled = false,
    checked=false,
    className='',
    onChange,
}: FieldProps) {
    function handleChange(
        e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
    ) {
        onChange(e, name);
    }

    switch (as) {
        case "textarea":
            return (
                <>
                    <textarea
                        id={name}
                        rows={rows}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={className}
                    ></textarea>
                </>
            );
        default:
            return (
                <>
                    <input
                        id={name}
                        disabled={disabled}
                        type={type}
                        name={name}
                        value={value}
                        checked={checked}
                        className={className}
                        onChange={handleChange}
                    />
                </>
            );
    }
}

export default Field;