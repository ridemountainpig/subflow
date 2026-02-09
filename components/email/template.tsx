import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import { pixelBasedPreset } from "@react-email/tailwind";
import { getContent, getIconUrl, type Language } from "@/lib/email/content";

interface EmailTemplateProps {
    language: Language;
}

export const EmailTemplate = ({ language = "en" }: EmailTemplateProps) => {
    const content = getContent(language);

    return (
        <Html lang={language}>
            <Preview>{content.preview}</Preview>
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                    theme: {
                        extend: {
                            colors: {
                                subflow: {
                                    50: "#faf0e6",
                                    100: "#e5dcd3",
                                    200: "#d0c8c0",
                                    300: "#bbb4ae",
                                    400: "#a6a09b",
                                    500: "#918c88",
                                    600: "#7b7775",
                                    700: "#666362",
                                    800: "#514f50",
                                    900: "#27272a",
                                },
                            },
                        },
                    },
                }}
            >
                <Head />
                <Body className="text-subflow-900 bg-subflow-900 font-serif">
                    <Container className="mx-auto my-[20px] w-[95%] overflow-hidden rounded-[10px] bg-white md:w-[600px]">
                        <Section className="p-6 md:p-[40px]">
                            {/* Header */}
                            <Section className="mb-6 text-center">
                                <Img
                                    alt="Subflow Logo"
                                    src="https://subflow.ing/subflow-light.png"
                                    width="52"
                                    height="52"
                                    className="inline-block rounded-[10px]"
                                />
                            </Section>
                            <Hr className="mx-0 my-6 w-full border border-gray-200" />

                            {/* Hero */}
                            <Img
                                alt="Subflow"
                                src={content.heroImage}
                                width="520"
                                className="mb-6 w-full rounded-xl"
                            />
                            <Text
                                className="text-base leading-normal font-bold text-gray-800"
                                dangerouslySetInnerHTML={{
                                    __html: content.intro,
                                }}
                            />

                            {/* Highlights */}
                            <Heading className="mt-10 mb-7 text-xl font-bold text-gray-800">
                                {content.sections.highlights.title}
                            </Heading>
                            <Section>
                                {content.sections.highlights.items.map(
                                    (item, index) => (
                                        <div key={index} className="mb-6">
                                            <Row className="mb-1.5">
                                                <Column className="w-[30px] align-middle">
                                                    <Img
                                                        src={getIconUrl(
                                                            item.icon,
                                                        )}
                                                        width="22"
                                                        height="22"
                                                        alt={item.title}
                                                    />
                                                </Column>
                                                <Column className="align-middle text-lg leading-normal font-bold">
                                                    {item.title}
                                                </Column>
                                            </Row>
                                            <div className="mb-1.5">
                                                <Img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="my-3 block h-auto w-full max-w-full rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div className="mb-1.5 text-base leading-normal font-bold tracking-wider text-gray-800">
                                                {item.description}
                                            </div>
                                            <div className="mt-3 rounded-md bg-[rgba(250,240,230,0.5)] p-3.5 text-sm font-bold tracking-wider text-zinc-800">
                                                <span>{item.usage.label}</span>{" "}
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.usage.text,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                            </Section>

                            {/* Basic Usage */}
                            <Heading className="mb-7 text-xl font-bold text-gray-800">
                                {content.sections.basic.title}
                            </Heading>
                            <Img
                                src={content.sections.basic.image}
                                alt="Subscription Page"
                                className="my-4 block h-auto w-full max-w-full rounded-lg bg-gray-100"
                            />
                            <ul className="m-0 pl-5 text-base leading-normal text-gray-800">
                                {content.sections.basic.items.map(
                                    (item, index) => {
                                        const separator =
                                            language === "zh" ||
                                            language === "ja"
                                                ? "： "
                                                : ": ";
                                        return (
                                            <li key={index} className="mb-4">
                                                <span className="font-bold">
                                                    {item.label}
                                                </span>
                                                {separator}
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.text,
                                                    }}
                                                />
                                            </li>
                                        );
                                    },
                                )}
                            </ul>

                            {/* CTA */}
                            <Section className="mt-10 mb-5 text-center">
                                <Link
                                    href={content.cta.url}
                                    className="bg-subflow-900 text-subflow-50 inline-block rounded-md px-6 py-3 text-base font-bold no-underline"
                                >
                                    {content.cta.text}
                                </Link>
                            </Section>

                            {/* Footer */}
                            <Hr className="mx-0 my-[30px] w-full border border-gray-200" />
                            <Text className="mt-4 text-[13px] leading-[1.2] text-gray-500">
                                {content.footer.regards} {content.footer.team}
                            </Text>
                        </Section>
                    </Container>

                    {/* Copyright */}
                    <Section className="text-subflow-50 p-5 text-center text-xs tracking-wider">
                        <Text>{content.footer.copyright}</Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailTemplate;
