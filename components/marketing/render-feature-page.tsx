import { useLocale } from "next-intl";
import Footer from "@/components/footer";
import FeaturePage from "@/components/marketing/feature-page";
import {
    getFeaturePage,
    getFeaturePages,
    getFeaturePageStructuredData,
    type FeaturePageSlug,
} from "@/data/feature-pages";
import type { AppLocale } from "@/lib/seo";

const backLabelByLocale: Record<AppLocale, string> = {
    en: "Back",
    zh: "返回",
    ja: "戻る",
    es: "Volver",
};

export default function RenderFeaturePage({ slug }: { slug: FeaturePageSlug }) {
    const locale = useLocale() as AppLocale;
    const feature = getFeaturePage(locale, slug);
    const structuredData = getFeaturePageStructuredData(locale, slug);
    const allPages = getFeaturePages(locale);
    const relatedPages = feature.related.map(
        (s) => allPages.find((p) => p.slug === s)!,
    );

    return (
        <>
            <FeaturePage
                feature={feature}
                backLabel={backLabelByLocale[locale]}
                structuredData={structuredData}
                relatedPages={relatedPages}
            />
            <Footer />
        </>
    );
}
