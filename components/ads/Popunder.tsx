"use client";

import { useEffect, useRef } from "react";
import { POPUNDER_CONFIG } from "@/lib/ads/config";

export default function Popunder() {
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canTriggerPopunder = (): boolean => {
      try {
        // Cek limit sesi tab (maksimal sesuai POPUNDER_CONFIG.maxPerSession)
        const sessionCountStr = sessionStorage.getItem(POPUNDER_CONFIG.storageKeySessionCount);
        const sessionCount = sessionCountStr ? parseInt(sessionCountStr, 10) : 0;
        if (sessionCount >= POPUNDER_CONFIG.maxPerSession) {
          return false;
        }

        // Cek interval cooldown (default 30 menit)
        const lastTriggerStr = localStorage.getItem(POPUNDER_CONFIG.storageKeyLastTrigger);
        if (lastTriggerStr) {
          const lastTrigger = parseInt(lastTriggerStr, 10);
          const now = Date.now();
          if (now - lastTrigger < POPUNDER_CONFIG.cooldownMs) {
            return false;
          }
        }

        return true;
      } catch {
        return false;
      }
    };

    const handleUserInteraction = () => {
      if (triggeredRef.current) return;

      if (!canTriggerPopunder()) {
        return;
      }

      triggeredRef.current = true;

      try {
        // Update session count
        const currentCount = parseInt(
          sessionStorage.getItem(POPUNDER_CONFIG.storageKeySessionCount) || "0",
          10
        );
        sessionStorage.setItem(
          POPUNDER_CONFIG.storageKeySessionCount,
          (currentCount + 1).toString()
        );

        // Update timestamp terakhir
        localStorage.setItem(
          POPUNDER_CONFIG.storageKeyLastTrigger,
          Date.now().toString()
        );

        // Inject script popunder saat klik pertama user
        const script = document.createElement("script");
        script.setAttribute("data-cfasync", "false");
        script.src = POPUNDER_CONFIG.scriptUrl;
        document.body.appendChild(script);
      } catch (e) {
        console.warn("[Popunder] Gagal menyimpan trigger state:", e);
      }

      window.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  return null;
}
