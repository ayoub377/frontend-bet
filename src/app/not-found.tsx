// src/app/not-found.tsx
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button'; // En supposant que vous voulez réutiliser votre bouton customisé

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 text-center px-4">
      <div className="max-w-md w-full">

        {/* Le composant Image gère le lazy-loading automatiquement */}
        <Image
          src="/page_not_found.png" // Chemin vers votre image dans le dossier /public
          alt="Illustration de page non trouvée"
          width={400} // IMPORTANT : Mettez la largeur réelle de votre image
          height={300} // IMPORTANT : Mettez la hauteur réelle de votre image
          className="mx-auto mb-8"
          loading="lazy" // C'est le comportement par défaut, mais on peut être explicite
        />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Oops!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          This Page is not found
        </p>

        <Link href="/">
          <Button className="cursor-pointer">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}