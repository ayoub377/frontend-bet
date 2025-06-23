// src/components/providers/FirebaseAnalyticsProvider.tsx

"use client"; // <--- C'est la ligne la plus importante !

import { useEffect } from 'react';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {app} from "@/lib/firebaseConfig";

export default function FirebaseAnalyticsProvider() {

  useEffect(() => {
    // Cette fonction ne s'exécutera que côté client, une seule fois.
    isSupported().then(supported => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }, []);

  // Ce composant n'a pas besoin de rendre du HTML.
  return null;
}
