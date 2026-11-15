export type AdBannerType =
  | "native-4:1"
  | "468x60"
  | "300x250"
  | "160x300"
  | "160x600"
  | "320x50"
  | "728x90";

export interface AdFormatConfig {
  type: AdBannerType;
  label: string;
  format: "iframe" | "native";
  key: string;
  width?: number;
  height?: number;
  scriptUrl: string;
  containerId?: string;
  isAvailable: boolean;
  unavailableReason?: string;
  /** Responsive container class to reserve space and prevent layout shifts */
  containerClassName?: string;
}

export const ADSTERRA_CONFIGS: Record<AdBannerType, AdFormatConfig> = {
  "native-4:1": {
    type: "native-4:1",
    label: "Native banner 4:1",
    format: "native",
    key: "4e7f9cf9b069462c8d8926d8cfb6605e",
    scriptUrl: "https://bancadeltempoidea.org/21/4e7f9cf9b069462c8d8926d8cfb6605e",
    containerId: "container-4e7f9cf9b069462c8d8926d8cfb6605e",
    isAvailable: true,
    containerClassName: "w-full min-h-[90px] sm:min-h-[120px]",
  },
  "468x60": {
    type: "468x60",
    label: "Banner 468x60",
    format: "iframe",
    key: "570956abb47838f8c2ac5aca6af959ef",
    width: 468,
    height: 60,
    scriptUrl: "https://bancadeltempoidea.org/22/570956abb47838f8c2ac5aca6af959ef",
    isAvailable: true,
    // Hide on small screens where width < 468px
    containerClassName: "hidden sm:flex justify-center items-center w-[468px] h-[60px] max-w-full",
  },
  "300x250": {
    type: "300x250",
    label: "Banner 300x250",
    format: "iframe",
    key: "eed91600433761384f36f499540649ff",
    width: 300,
    height: 250,
    scriptUrl: "https://bancadeltempoidea.org/22/eed91600433761384f36f499540649ff",
    isAvailable: true,
    containerClassName: "flex justify-center items-center w-[300px] h-[250px]",
  },
  "160x300": {
    type: "160x300",
    label: "Banner 160x300",
    format: "iframe",
    key: "", // Belum valid / perlu dikonfirmasi
    width: 160,
    height: 300,
    scriptUrl: "",
    isAvailable: false,
    unavailableReason:
      "Format 160x300 belum memiliki key Adsterra yang valid (snippet sebelumnya duplikat dengan 300x250).",
    containerClassName: "hidden md:flex justify-center items-center w-[160px] h-[300px]",
  },
  "160x600": {
    type: "160x600",
    label: "Banner 160x600",
    format: "iframe",
    key: "6292755035e166c1f0ad7a844c5d9eea",
    width: 160,
    height: 600,
    scriptUrl: "https://bancadeltempoidea.org/22/6292755035e166c1f0ad7a844c5d9eea",
    isAvailable: true,
    containerClassName: "hidden md:flex justify-center items-center w-[160px] h-[600px]",
  },
  "320x50": {
    type: "320x50",
    label: "Banner 320x50 (Mobile)",
    format: "iframe",
    key: "b4fafb58436579971aecf4bfd65c105c",
    width: 320,
    height: 50,
    scriptUrl: "https://bancadeltempoidea.org/22/b4fafb58436579971aecf4bfd65c105c",
    isAvailable: true,
    containerClassName: "flex justify-center items-center w-[320px] h-[50px] max-w-full",
  },
  "728x90": {
    type: "728x90",
    label: "Leaderboard 728x90",
    format: "iframe",
    key: "cabaf73ee59c135e3a9bcab5edf35b47",
    width: 728,
    height: 90,
    scriptUrl: "https://bancadeltempoidea.org/22/cabaf73ee59c135e3a9bcab5edf35b47",
    isAvailable: true,
    // Sembunyikan di layar kecil / mobile di mana 728px melebihi viewport
    containerClassName: "hidden md:flex justify-center items-center w-[728px] h-[90px] max-w-full",
  },
};
