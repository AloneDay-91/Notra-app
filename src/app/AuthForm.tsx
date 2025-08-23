'use client'

import { useState } from 'react'
import { signInAction, signUp } from './actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/20">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-800">
      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default function AuthForm() {
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignInLoading, setIsSignInLoading] = useState(false)
  const [isSignUpLoading, setIsSignUpLoading] = useState(false)

  const handleSignIn = async (formData: FormData) => {
    setSignInError(null)
    setIsSignInLoading(true)

    try {
      const result = await signInAction(formData)
      if (result?.error) {
        setSignInError(result.error)
      }
    } finally {
      setIsSignInLoading(false)
    }
  }

  const handleSignUp = async (formData: FormData) => {
    setSignUpError(null)
    setSignUpSuccess(null)
    setIsSignUpLoading(true)

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setSignUpError(result.error)
      } else {
        setSignUpSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
      }
    } finally {
      setIsSignUpLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="signin" className="text-sm font-medium">
            Se connecter
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-sm font-medium">
            S&apos;inscrire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Se connecter</h2>
            <p className="text-muted-foreground">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <form action={handleSignIn} className="space-y-4">
                {signInError && <FormError message={signInError} />}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-12"
                      required
                      disabled={isSignInLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      required
                      disabled={isSignInLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isSignInLoading}
                    >
                      {showPassword ? <EyeOff className=" w-4" /> : <Eye className="w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-sm font-medium"
                  disabled={isSignInLoading}
                >
                  {isSignInLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Créer un compte</h2>
            <p className="text-muted-foreground">
              Créez votre compte pour commencer à prendre des notes
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <form action={handleSignUp} className="space-y-4">
                {signUpError && <FormError message={signUpError} />}
                {signUpSuccess && <FormSuccess message={signUpSuccess} />}

                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 text-muted-foreground" />
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-12"
                      required
                      disabled={isSignUpLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 text-muted-foreground" />
                    <Input
                      id="password-signup"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      required
                      disabled={isSignUpLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isSignUpLoading}
                    >
                      {showPassword ? <EyeOff className=" w-4" /> : <Eye className=" w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-sm font-medium"
                  disabled={isSignUpLoading}
                >
                  {isSignUpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    "Créer le compte"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
