import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useTranslations } from "next-intl";

export default function SMSLogin() {
  const t = useTranslations("sms");
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("title")}</h1>
        <h2 className="text-xl">{t("subtitle")}</h2>
      </div>
      <form className="flex flex-col gap-4">
        <FormInput
          name="phoneNumber"
          type="number"
          placeholder={t("phoneNumber")}
          required
          errors={[]}
        />
        <FormInput
          name="verificationCode"
          type="number"
          placeholder={t("verificationCode")}
          required
          errors={[]}
        />
        <FormButton text={t("verify")} />
      </form>
    </div>
  );
}