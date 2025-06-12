
"use client";

import { useEffect } from 'react';

// Déclare adsbygoogle au niveau global pour que TypeScript ne se plaigne pas
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

// Définit les propriétés que le composant peut accepter
interface AdBannerProps {
  slotId: string; // L'ID de votre bloc d'annonce (data-ad-slot)
  className?: string; // Pour ajouter des classes CSS si besoin
}

const AdBanner: React.FC<AdBannerProps> = ({ slotId, className = '' }) => {
  // Récupère l'ID client depuis les variables d'environnement
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  // Ce hook s'exécute une fois que le composant est affiché à l'écran
  useEffect(() => {
    try {
      // Cette ligne demande à Google de charger une publicité dans ce bloc
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Erreur AdSense:", err);
    }
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois

  // Si l'ID client n'est pas défini, on n'affiche rien pour éviter les erreurs
  if (!adClient) {
    return null;
  }

  // C'est le code HTML de l'annonce que Google utilise
  return (
    <div className={`w-full text-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;