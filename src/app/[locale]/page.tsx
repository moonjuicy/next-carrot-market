import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("Login");
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl ">{t("title")}</h1>
        <h2 className="text-2xl">{t("description")}</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn text-lg py-2.5">
          {t("start")}
        </Link>
        <div className="flex gap-2">
          <span>{t("haveAccount")}</span>
          <Link href="/login" className="hover:underline">
            {t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
