import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import RenderFeaturePage from "@/components/marketing/render-feature-page";
import { getFeaturePageMetadata } from "@/data/feature-pages";
import type { AppLocale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    return getFeaturePageMetadata(locale, "raycast-extension");
}

export default function RaycastExtensionPage() {
    return <RenderFeaturePage slug="raycast-extension" />;
}
