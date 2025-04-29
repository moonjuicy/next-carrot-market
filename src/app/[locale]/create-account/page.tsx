import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useTranslations } from "next-intl";

export default function LogIn() {
  const t = useTranslations("createAccount");
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("hello")}</h1>
        <h2 className="text-xl">{t("fillInTheFormBelowToJoin")}</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="email" placeholder={t("email")} required errors={[]} />
        <FormInput
          type="password"
          placeholder={t("password")}
          required
          errors={[]}
        />
        <FormButton loading={false} text={t("login")} />
      </form>
      <SocialLogin />
    </div>
  );
}