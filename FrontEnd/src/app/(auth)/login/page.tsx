import { Suspense } from "react";
import LoginPageClientWrapper from "./LoginPageClientWrapper";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LoginPageClientWrapper />
    </Suspense>
  );
}
