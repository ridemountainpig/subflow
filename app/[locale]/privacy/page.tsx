import { useTranslations } from "next-intl";
import Footer from "@/components/footer";

export default function Privacy() {
    const t = useTranslations("PrivacyPage");

    return (
        <>
            <div className="bg-subflow-900 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-y-8 px-4 py-8 sm:min-h-[calc(100vh-7.25rem)]">
                <div className="text-subflow-50 mx-auto w-[98%] sm:w-[70%]">
                    <h1 className="mb-8 text-center text-xl font-bold tracking-widest sm:text-2xl md:text-3xl">
                        {t("title")}
                    </h1>

                    <div className="space-y-6 text-sm leading-relaxed tracking-wider sm:text-base">
                        <p className="text-subflow-200">{t("intro")}</p>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section1.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section1.content1")}</p>
                                <p>{t("section1.content2")}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section2.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section2.content1")}</p>
                                <p>{t("section2.content2")}</p>
                                <ul className="ml-4 list-inside list-disc space-y-1">
                                    <li>{t("section2.list1")}</li>
                                    <li>{t("section2.list2")}</li>
                                    <li>{t("section2.list3")}</li>
                                    <li>{t("section2.list4")}</li>
                                </ul>
                                <p>{t("section2.content3")}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section3.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section3.content1")}</p>
                                <p>{t("section3.content2")}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section4.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section4.content1")}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section5.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section5.content1")}</p>
                                <ul className="ml-4 list-inside list-disc space-y-1">
                                    <li>{t("section5.list1")}</li>
                                    <li>{t("section5.list2")}</li>
                                    <li>{t("section5.list3")}</li>
                                    <li>{t("section5.list4")}</li>
                                    <li>{t("section5.list5")}</li>
                                    <li>{t("section5.list6")}</li>
                                    <li>{t("section5.list7")}</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section6.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section6.content1")}</p>
                                <div>
                                    <p className="font-medium">
                                        {t("section6.cookieSettings")}
                                    </p>
                                    <p>{t("section6.cookieDescription")}</p>
                                    <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                                        <li>
                                            <a
                                                href="https://support.google.com/chrome/answer/95647"
                                                className="text-blue-300 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t("section6.chromeLink")}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                                                className="text-blue-300 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t("section6.firefoxLink")}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                                                className="text-blue-300 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t("section6.safariLink")}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                                                className="text-blue-300 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t("section6.edgeLink")}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subflow-100 text-xl font-semibold sm:text-2xl">
                                {t("section7.title")}
                            </h2>
                            <div className="text-subflow-200 space-y-3">
                                <p>{t("section7.content1")}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
