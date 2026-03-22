"use client";

import { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type" | "children"> & {
  label: string;
  pendingLabel?: string;
};

export function FormSubmitButton({
  label,
  pendingLabel,
  className,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
      {...props}
    >
      {pending ? pendingLabel || label : label}
    </button>
  );
}
