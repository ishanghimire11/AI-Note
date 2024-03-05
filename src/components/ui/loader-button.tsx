import React from "react";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";

type LoaderButtonProps = {
  isLoading: boolean;
  children: React.ReactNode;
} & ButtonProps;

function LoaderButton({ children, isLoading, ...props }: LoaderButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
      {children}
    </Button>
  );
}

export default LoaderButton;
