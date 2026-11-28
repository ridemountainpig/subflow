import { ImageResponse } from "next/og";
import { createElement, type ComponentType, type SVGProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { subscriptionServices } from "@/data/subscriptionServices";

// Email clients do not render SVG, so the reminder email loads each service
// logo from here as a PNG. Drawn at 4x the 20px it is shown at.
const SIZE = 80;

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ uuid: string }> },
) {
    const { uuid } = await params;
    const service = subscriptionServices.find((s) => s.uuid === uuid);
    if (!service || typeof service.icon === "string") {
        return new Response("Not found", { status: 404 });
    }

    const Icon = service.icon as ComponentType<SVGProps<SVGSVGElement>>;
    const svg = renderToStaticMarkup(
        createElement(Icon, { width: SIZE, height: SIZE }),
    );
    const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    return new ImageResponse(
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={src} width={SIZE} height={SIZE} />,
        {
            width: SIZE,
            height: SIZE,
            headers: {
                "Cache-Control":
                    "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400",
            },
        },
    );
}
