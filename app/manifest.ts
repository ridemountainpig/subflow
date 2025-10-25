import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Subflow",
        short_name: "Subflow",
        description:
            "Easily flow through your subscriptions with Subflow. Track spending, organize recurring payments, and take control of your subscription management.",
        start_url: "/",
        display: "standalone",
        background_color: "#27272a",
        theme_color: "#27272a",
        icons: [
            {
                src: "/manifest-images/subflow-icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/manifest-images/subflow-icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
