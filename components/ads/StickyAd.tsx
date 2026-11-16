"use client";

import { useState } from "react";
import AdBanner from "./AdBanner";

interface StickyAdProps {
    position?: "top" | "bottom";        // posisi iklan di layar
    buttonPosition?: "top" | "bottom";  // posisi tombol close di kotak iklan
}

const positionClass = {
    top: "top-0",
    bottom: "bottom-0",
};

const buttonClass = {
    top: "-top-3",
    bottom: "-bottom-3",
};

export default function StickyAd({
    position = "bottom",
    buttonPosition = "top",
}: StickyAdProps) {
    const [closed, setClosed] = useState(false);

    if (closed) return null;

    return (
        <div
            className={`fixed ${positionClass[position]} z-50 bg-black/20 px-2 py-2 inset-x-0 mx-auto w-fit`}
        >
            <button
                onClick={() => setClosed(true)}
                aria-label="Tutup iklan"
                className={`absolute ${buttonClass[buttonPosition]} inset-x-0 mx-auto w-fit p-1 rounded-md bg-red-600 text-white text-sm leading-6 shadow`}
            >
                Tutup Iklan
            </button>

            <div className="mx-auto grid gap-x-1 max-w-5xl grid-cols-2">
                <AdBanner type="320x50" />
                <AdBanner type="320x50" />
                <AdBanner type="320x50" />
                <AdBanner type="320x50" />
            </div>
        </div>
    );
}