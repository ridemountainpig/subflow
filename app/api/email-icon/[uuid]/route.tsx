import { ImageResponse } from "next/og";
import type { ComponentType, SVGProps } from "react";
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

    return new ImageResponse(
        // currentColor logos (such as Suno) would default to black, which is
        // invisible on the dark tile.
        <div
            style={{
                display: "flex",
                width: SIZE,
                height: SIZE,
                color: "#faf0e6",
            }}
        >
            <Icon width={SIZE} height={SIZE} />
        </div>,
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
