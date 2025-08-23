import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Header mobile avec logo et toggle theme */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Image
            className="dark:hidden"
            src="/Logo white.png"
            width={80}
            height={30}
            alt="Logo Notra"
          />
          <Image
            className="hidden dark:block"
            src="/Logo dark.png"
            width={80}
            height={30}
            alt="Logo Notra"
          />
        </div>
        <ModeToggle />
      </div>

      {/* Section gauche - Branding (responsive) */}
      <div className="flex w-full lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-6 lg:p-12">
        <div className="max-w-md text-center space-y-4 lg:space-y-6">
          {/* Logo visible seulement sur desktop */}
          <div className="hidden lg:flex justify-center">
            <Image
              className="dark:hidden"
              src="/Logo white.png"
              width={120}
              height={120}
              alt="Logo Notra"
            />
            <Image
              className="hidden dark:block"
              src="/Logo dark.png"
              width={120}
              height={120}
              alt="Logo Notra"
            />
          </div>

          <div className="space-y-3 lg:space-y-4">
            <h1 className="text-2xl lg:text-4xl font-bold text-foreground">
              Bienvenue sur Notra
            </h1>
            <p className="text-sm lg:text-lg text-muted-foreground leading-relaxed">
              Organisez vos cours, prenez des notes et réussissez vos études avec
              notre plateforme intuitive.
            </p>
          </div>

          {/* Features - masquées sur mobile pour économiser l'espace */}
          <div className="hidden lg:grid grid-cols-1 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Interface moderne et intuitive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Synchronisation en temps réel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Accès depuis tous vos appareils</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire d'authentification (responsive) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="lg:hidden mb-6 flex justify-end">
            <ModeToggle />
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
