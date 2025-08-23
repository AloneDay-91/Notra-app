import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import {Download2} from "@/components/DownloadPage";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
      <>
          <div className="w-full flex items-center justify-between p-4">
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
    <div className="flex flex-col lg:flex-row container mx-auto my-12">
      {/* Header mobile avec logo et toggle theme */}

      {/* Section gauche - Branding (responsive) */}
      <div className="flex w-full lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-6 rounded-md">
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

          <div className="space-y-3 lg:space-y-4 mt-16">
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
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Interface moderne et intuitive</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Synchronisation en temps réel</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Accès depuis tous vos appareils</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire d'authentification (responsive) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-sm lg:max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>

      <Download2/>

          <footer className='container mx-auto'>
              <div className="text-muted-foreground mb-4 mt-48 flex flex-col justify-between gap-4 py-4 text-sm font-medium md:flex-row md:items-center">
                  <p className="text-center md:text-left">© 2025 Notra. Tous droits réservés.</p>
                  <ul className="flex gap-4 items-center justify-center md:justify-start">
                      <li>
                          <Button variant='link' className='text-muted-foreground' asChild>
                              <Link href='/'>Accueil</Link>
                          </Button>
                      </li>
                      <li>
                          <Button variant='link' className='text-muted-foreground' asChild>
                              <Link href='/'>Connexion</Link>
                          </Button>
                      </li>
                  </ul>
              </div>
          </footer>
    </>
  );
}
