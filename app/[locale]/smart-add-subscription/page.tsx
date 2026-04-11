import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import RenderFeaturePage from "@/components/marketing/render-feature-page";
import { getFeaturePageMetadata } from "@/data/feature-pages";
import type { AppLocale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    return getFeaturePageMetadata(locale, "smart-add-subscription");
}

export default function SmartAddSubscriptionPage() {
    return <RenderFeaturePage slug="smart-add-subscription" />;
}
