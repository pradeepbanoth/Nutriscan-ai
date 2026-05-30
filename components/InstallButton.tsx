"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("PAUSTICA installed");
    }

    setInstallPrompt(null);
  };

  if (!installPrompt) return null;

  return (
    <button
      onClick={installApp}
      className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Install PAUSTICA
    </button>
  );
}