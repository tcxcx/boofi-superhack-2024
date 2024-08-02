// src/app/[locale]/page.tsx

import { HomeContent } from "@/components/Home";
import { Translations } from "@/lib/types/translations";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  const translations: Translations["Home"] = {
    welcome: t("welcome"),
    to: t("to"),
    slogan: {
      part1: t("slogan.part1"),
      part2: t("slogan.part2"),
      part3: t("slogan.part3"),
      part4: t("slogan.part4"),
    },
    logoAlt: t("logoAlt"),
    neoMatrixAlt: t("neoMatrixAlt"),
    pillGifAlt: t("pillGifAlt"),
    boofiMatrixAlt: t("boofiMatrixAlt"),
    matrixMemeAlt: t("matrixMemeAlt"),
  };

  return <HomeContent translations={translations} />;
}
