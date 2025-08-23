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
    <div className="min-h-screen flex">
      {/* Section gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="flex justify-center">
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
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Bienvenue sur Notra
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Organisez vos cours, prenez des notes et réussissez vos études avec
              notre plateforme intuitive.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
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
              <span>Export en Markdown</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Mode toggle en position absolue */}
        <div className="absolute top-6 right-6">
          <ModeToggle />
        </div>

        {/* Logo mobile */}
        <div className="lg:hidden absolute top-6 left-6">
          <Image
            className="dark:hidden"
            src="/Logo white.png"
            width={40}
            height={40}
            alt="Logo Notra"
          />
          <Image
            className="hidden dark:block"
            src="/Logo dark.png"
            width={40}
            height={40}
            alt="Logo Notra"
          />
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Header mobile */}
          <div className="lg:hidden text-center space-y-2 pt-16">
            <h1 className="text-2xl font-bold">Bienvenue</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour accéder à vos notes
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
