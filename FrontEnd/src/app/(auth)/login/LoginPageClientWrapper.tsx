"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPageContent from "./LoginPageContent";

export default function LoginPageClientWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = searchParams.get("callbackUrl");
    setCallbackUrl(url);
  }, [searchParams]);

  return <LoginPageContent callbackUrl={callbackUrl} router={router} />;
}
