import { Download, Monitor, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Download2Props {
    heading?: string;
    description?: string;
    platforms?: {
        desktop?: {
            title: string;
            subtitle: string;
            description: string;
            buttonText: string;
            url: string;
        };
        navigateur?: {
            title: string;
            subtitle: string;
            description: string;
            buttonText: string;
            url: string;
        };
    };
}

const Download2 = ({
       heading = "Disponible partout",
       description = "Choisissez votre plateforme et commencez à utiliser notre application dès maintenant. Disponible sur ordinateurs et navigateurs.",
       platforms = {
           desktop: {
               title: "Desktop",
               subtitle: "PC/Mac",
               description: "Solution la plus complète et optimiser.",
               buttonText: "Bientôt",
               url: "#",
           },
           navigateur: {
               title: "Navigateur",
               subtitle: "Navigateur",
               description: "Simple et rapide d'utilisation",
               buttonText: "Commencer dès maintenant",
               url: "#",
           }
       },
   }: Download2Props) => {
    return (
        <section className="py-32">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        {heading}
                    </h2>
                    <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg">
                        {description}
                    </p>
                </div>

                {/* Download Options - Minimal Grid */}
                <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 bg-gradient-to-b from-primary/10 via-primary/5 to-background rounded-md p-12">
                    {/* Desktop */}
                    <div className="text-center">
                        <div className="bg-background mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-sm">
                            <Monitor className="h-10 w-10" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                            {platforms.desktop?.subtitle}
                        </h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                            {platforms.desktop?.description}
                        </p>
                        <Button size="lg" variant="secondary" asChild>
                            <a href={platforms.desktop?.url}>
                                <Download className="h-4 w-4" />
                                {platforms.desktop?.buttonText}
                            </a>
                        </Button>
                    </div>

                    {/* Navigateur */}
                    <div className="text-center">
                        <div className="bg-background mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-sm">
                            <Globe className="h-10 w-10" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                            {platforms.navigateur?.subtitle}
                        </h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                            {platforms.navigateur?.description}
                        </p>
                        <Button size="lg" asChild>
                            <a href={platforms.navigateur?.url}>
                                <Download className="h-4 w-4" />
                                {platforms.navigateur?.buttonText}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Download2 };