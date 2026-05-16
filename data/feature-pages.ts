import { cache } from "react";
import type { Metadata } from "next";
import { getContent, type Language } from "@/lib/email/content";
import {
    BCP47_LOCALES,
    SITE_ORIGIN,
    type AppLocale,
    createLocalizedMetadata,
    getLocalizedUrl,
} from "@/lib/seo";

const RAYCAST_EXTENSION_STORE_URL =
    "https://www.raycast.com/ridemountainpig/subflow";

export const featurePageSlugs = [
    "subscription-tracker",
    "recurring-payments",
    "shared-subscriptions",
    "subscription-reminders",
    "smart-add-subscription",
    "raycast-extension",
] as const;

export type FeaturePageSlug = (typeof featurePageSlugs)[number];
export const featurePageUpdatedAt: Record<FeaturePageSlug, string> = {
    "subscription-tracker": "2026-05-09",
    "recurring-payments": "2026-05-09",
    "shared-subscriptions": "2026-05-09",
    "subscription-reminders": "2026-05-09",
    "smart-add-subscription": "2026-05-09",
    "raycast-extension": "2026-04-28",
};

export type FeatureIconName =
    | "calendar"
    | "mail"
    | "users"
    | "sparkles"
    | "pie-chart"
    | "coins";

export type FeatureSection = {
    icon: FeatureIconName;
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    images?: string[];
    imageAlts?: string[];
    note?: string;
};

export type FaqItem = {
    question: string;
    answer: string;
};

export type LocalizedFeaturePage = {
    slug: FeaturePageSlug;
    navTitle: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    intro: string;
    heroImage: string;
    heroImageAlt: string;
    sections: FeatureSection[];
    stepsTitle: string;
    steps: string[];
    relatedTitle: string;
    related: FeaturePageSlug[];
    ctaLabel: string;
    ctaHref: string;
    faqs: FaqItem[];
};

type LocaleFeatureDictionary = Record<FeaturePageSlug, LocalizedFeaturePage>;

function stripHtml(input: string) {
    return input
        .replace(/<img[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanUsageText(locale: AppLocale, input: string) {
    const plain = stripHtml(input);
    return locale === "zh" ? plain.replace(/\s+/g, "") : plain;
}

function formatStep(locale: AppLocale, label: string, text: string) {
    const separator = locale === "zh" || locale === "ja" ? "：" : ": ";
    return `${label}${separator}${cleanUsageText(locale, text)}`;
}

function localWelcomeImage(name: string, locale: AppLocale) {
    return `/welcome-email/${name}-${locale}.png`;
}

function toLanguage(locale: AppLocale): Language {
    return locale;
}

const buildFeaturePages = cache(function buildFeaturePages(
    locale: AppLocale,
): LocaleFeatureDictionary {
    const email = getContent(toLanguage(locale));
    const [smartAdd, emailNotifications, , coSubscriber] =
        email.sections.highlights.items;
    const basicItems = email.sections.basic.items;
    const basicSteps = basicItems.map((item) =>
        formatStep(locale, item.label, item.text),
    );

    const sharedImage = localWelcomeImage("co-subscriber", locale);
    const notificationImage = localWelcomeImage("email-notification", locale);
    const smartAddImage = localWelcomeImage("smart-add", locale);
    const analyticsImages = [
        `/welcome-email/subscription-analyze-one-${locale}.png`,
        `/welcome-email/subscription-analyze-two-${locale}.png`,
    ];
    const subscriptionImage = localWelcomeImage("subscription-page", locale);

    const localized = {
        en: {
            stepsTitle: "How it works in Subflow",
            relatedTitle: "Related guides",
            ctaLabel: "Start with Subflow",
            pages: {
                "subscription-tracker": {
                    navTitle: "Subscription Tracker",
                    metaTitle:
                        "Subscription Tracker | Track Subscriptions with Subflow",
                    metaDescription:
                        "Track subscriptions, upcoming charges, and analytics — monthly average, cash flow, 12-month trend, and renewal forecasts — in one Subflow dashboard.",
                    title: "Track every subscription from one calm dashboard",
                    description:
                        "Subflow gives you a clear view of monthly charges, recurring payments, and subscription spend without using spreadsheets.",
                    intro: "Subflow turns scattered subscription charges into a single calendar and analytics view. Track monthly, quarterly, and annual plans, see your real subscription spend, and stay ahead of every renewal — without spreadsheets or hidden card statements.",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Subflow subscription tracker overview",
                    sections: [
                        {
                            icon: "calendar",
                            title: "See your billing month at a glance",
                            description:
                                "The calendar view keeps upcoming charges visible, so you always know what is due this month and what is coming next.",
                            image: subscriptionImage,
                            imageAlt: "Calendar view for subscription tracking",
                        },
                        {
                            icon: "sparkles",
                            title: "Add subscriptions manually or with Smart Add",
                            description:
                                "Create subscriptions quickly, search for known services, or paste a receipt and let Subflow fill in the details for you.",
                            image: smartAddImage,
                            imageAlt: "Smart Add for subscriptions",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "pie-chart",
                            title: "Read your subscription spend across two analytics views",
                            description:
                                "The analytics dialog has two tabs. Breakdown shows the share of each service and the split across monthly, quarterly, and annual cycles. Analytics surfaces your monthly average vs. cash-flow view, annual spend, daily rate, total subscriptions, the 12-month spend trend, the next 30 days of renewals, the change vs. last month, and an annual-upgrade hint when monthly or quarterly plans have been running for over a year.",
                            images: analyticsImages,
                            imageAlts: [
                                "Subscription analytics breakdown tab",
                                "Subscription analytics trend tab",
                            ],
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "How do I add a subscription to Subflow?",
                            answer: "Tap the add button, search for the service or enter it manually, set the billing amount, currency, and renewal date, then save. The subscription appears in your calendar right away.",
                        },
                        {
                            question:
                                "Can Subflow track subscriptions in different currencies?",
                            answer: "Yes. Each subscription is stored in the currency you enter, and Subflow converts the totals and analytics to your preferred display currency so you can compare spend across services on the same scale.",
                        },
                        {
                            question:
                                "What does the subscription analytics dialog show?",
                            answer: "Two tabs. Breakdown highlights the largest spending services and the split between monthly, quarterly, and annual billing cycles. Analytics shows the 12-month spend trend, your monthly average vs. cash-flow view, annual spend, daily rate, the next 30 days of renewals, the change vs. last month, and an annual-upgrade hint when monthly or quarterly plans have been running for more than a year.",
                        },
                        {
                            question:
                                "Does Subflow store my payment card details?",
                            answer: "No. Subflow only stores subscription metadata you enter — service name, amount, renewal date, and currency. No card numbers or bank credentials are ever collected.",
                        },
                    ],
                },
                "recurring-payments": {
                    navTitle: "Recurring Payments",
                    metaTitle:
                        "Recurring Payments | Keep Renewal Dates Visible",
                    metaDescription:
                        "Track monthly, quarterly, and yearly recurring payments — see renewal dates, the 30-day forecast, and cycle breakdown in a single Subflow view.",
                    title: "Manage recurring payments before they surprise you",
                    description:
                        "Keep monthly, quarterly, and yearly renewals visible with a workflow designed for recurring bills and subscription planning.",
                    intro: "Subflow is built around recurring payments. Instead of letting subscriptions disappear into your card statement, you can keep each billing cycle visible, organized, and easy to review.",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Recurring payments in Subflow calendar",
                    sections: [
                        {
                            icon: "calendar",
                            title: "Make billing cycles visible",
                            description:
                                "Switch between months and review every scheduled charge in a calendar layout that makes recurring payments easy to scan.",
                            image: subscriptionImage,
                            imageAlt: "Recurring payment calendar",
                            note: basicSteps[0],
                        },
                        {
                            icon: "mail",
                            title: "Pair payment tracking with reminders",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt:
                                "Email notifications for subscription payments",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "coins",
                            title: "Mix monthly, quarterly, and yearly without spreadsheets",
                            description:
                                "A yearly domain renewal, a quarterly insurance plan, and a monthly streaming service can sit side by side in Subflow. Each subscription keeps its own cycle and renewal date, so you do not have to convert anything by hand to keep them comparable.",
                        },
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "What billing cycles does Subflow support?",
                            answer: "Subflow supports monthly, quarterly, and yearly billing cycles, and the analytics view converts each one to a monthly equivalent so you can compare them side by side.",
                        },
                        {
                            question:
                                "Will I be notified before a recurring payment is charged?",
                            answer: "Yes. Turn on email notifications in More menu → Email Notifications, and Subflow sends an email reminder the day before any tracked subscription renews so you have time to review or cancel.",
                        },
                        {
                            question:
                                "How does Subflow compare monthly, quarterly, and annual recurring spend?",
                            answer: "The analytics dialog includes a cycle breakdown that converts each subscription to its monthly equivalent so you can see how much of your spend comes from monthly vs. quarterly vs. annual plans, and an annual-upgrade hint flags monthly or quarterly subscriptions that have been active for more than a year.",
                        },
                        {
                            question:
                                "Can I see past recurring payments in Subflow?",
                            answer: "Yes. The calendar lets you navigate between months, so you can review the billing history for any tracked subscription.",
                        },
                    ],
                },
                "shared-subscriptions": {
                    navTitle: "Shared Subscriptions",
                    metaTitle:
                        "Shared Subscriptions | Manage Shared Plans with Subflow",
                    metaDescription:
                        "Invite co-subscribers, keep shared family or team renewals visible, and split shared subscription costs from one Subflow dashboard.",
                    title: "Manage shared subscriptions with less friction",
                    description:
                        "Invite family, friends, or teammates into the same subscription workflow so shared costs stay visible and easier to coordinate.",
                    intro: "Shared services are simple until nobody remembers who pays, who uses it, or when it renews. Subflow gives shared subscriptions a dedicated place inside the same dashboard.",
                    heroImage: sharedImage,
                    heroImageAlt: "Shared subscriptions in Subflow",
                    sections: [
                        {
                            icon: "users",
                            title: "Invite collaborators into a subscription",
                            description: coSubscriber.description,
                            image: sharedImage,
                            imageAlt: "Co-subscriber management screen",
                            note: cleanUsageText(
                                locale,
                                coSubscriber.usage.text,
                            ),
                        },
                        {
                            icon: "calendar",
                            title: "Keep shared renewals visible",
                            description:
                                "Once a subscription is in Subflow, the renewal schedule stays in the same calendar view as everything else, so shared services do not get lost.",
                            image: subscriptionImage,
                            imageAlt: "Shared subscriptions on the calendar",
                        },
                        {
                            icon: "mail",
                            title: "Everyone on the plan can get reminded",
                            description:
                                "Once a subscription is shared, each co-subscriber can opt into the same renewal email reminders on their own account. The next charge stops depending on whichever person happens to remember it.",
                        },
                    ],
                    steps: [
                        `Invite a co-subscriber: ${cleanUsageText(
                            locale,
                            coSubscriber.usage.text,
                        )}`,
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "How do I invite someone to a shared subscription?",
                            answer: "Open the subscription, go to the co-subscribers section, and enter the person's email address. They will receive an invitation to join the subscription in Subflow.",
                        },
                        {
                            question:
                                "Does each co-subscriber need a Subflow account?",
                            answer: "Yes. Each invited person will need a free Subflow account to view and interact with the shared subscription.",
                        },
                        {
                            question:
                                "Can shared subscriptions use a different currency than my personal ones?",
                            answer: "Yes. Each shared subscription keeps its own currency, so a family or team plan billed in a different currency stays accurate without affecting how your other subscriptions are stored or displayed.",
                        },
                        {
                            question:
                                "Can I remove a co-subscriber from a shared subscription?",
                            answer: "Yes. The subscription owner can remove co-subscribers at any time from the subscription's settings.",
                        },
                    ],
                },
                "subscription-reminders": {
                    navTitle: "Subscription Reminders",
                    metaTitle:
                        "Subscription Reminders | Email Alerts Before Payment Day",
                    metaDescription:
                        "Get an email reminder the day before each subscription renews — Subflow keeps renewal alerts visible so charges never slip past you.",
                    title: "Get reminders before the next subscription charge hits",
                    description:
                        "Use email reminders to stay ahead of renewals, protect your budget, and reduce surprise charges across all of your subscriptions.",
                    intro: "When subscriptions renew quietly, the easiest money to waste is the money you forgot to check. Subflow keeps renewals visible and adds reminder emails before payment day.",
                    heroImage: notificationImage,
                    heroImageAlt: "Subscription reminder email settings",
                    sections: [
                        {
                            icon: "mail",
                            title: "Send reminders before payment day",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt: "Email reminder setup for subscriptions",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "sparkles",
                            title: "One switch to keep reminders on or off",
                            description:
                                "A single notification toggle controls reminders for every subscription on your account, so you can turn alerts on while you need them and switch them all off in one tap — without flooding your inbox with charges you do not need to think about.",
                        },
                        {
                            icon: "calendar",
                            title: "Read each reminder in your preferred language",
                            description:
                                "Reminder emails follow the language you set under email notifications, so the renewal alert lands in the language you read most comfortably and you can decide right from the inbox.",
                        },
                    ],
                    steps: [
                        `Reminder setup: ${cleanUsageText(
                            locale,
                            emailNotifications.usage.text,
                        )}`,
                    ],
                    related: [
                        "recurring-payments",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "When does Subflow send a renewal reminder?",
                            answer: "Subflow sends an email reminder one day before each subscription's renewal date, so you have a chance to review or cancel before the charge goes through.",
                        },
                        {
                            question:
                                "How are subscription reminders delivered?",
                            answer: "Reminders are sent by email to the address you configure in the More menu → Email Notifications settings.",
                        },
                        {
                            question:
                                "What language will my reminder emails be in?",
                            answer: "Reminder emails are delivered in the language you choose in the email notification settings, so you can match Subflow notifications to the language you read most comfortably.",
                        },
                        {
                            question:
                                "How do I turn subscription reminders on or off?",
                            answer: "Open the More menu → Email Notifications, then toggle the Notify switch. The toggle controls reminders for every tracked subscription on your account, and you can update the email address or language at any time.",
                        },
                    ],
                },
                "smart-add-subscription": {
                    navTitle: "Smart Add Subscription",
                    metaTitle:
                        "Smart Add Subscription | Add Subscriptions from Receipts",
                    metaDescription:
                        "Paste a receipt, email, or pricing details and let Smart Add fill in the subscription details for review.",
                    title: "Turn receipts and email copies into subscriptions faster",
                    description:
                        "Smart Add analyzes pasted text or uploaded receipts, then fills in subscription details so you can save time on setup.",
                    intro: "Manual entry is the part that makes most subscription trackers feel like homework. Smart Add shortens that path by turning existing receipt or pricing content into a ready-to-review subscription entry.",
                    heroImage: smartAddImage,
                    heroImageAlt: "Smart Add subscription input flow",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "Paste a receipt, email, or subscription details",
                            description: smartAdd.description,
                            image: smartAddImage,
                            imageAlt: "Smart Add screen for receipt parsing",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "calendar",
                            title: "Review the extracted billing information",
                            description:
                                "After analysis, you can confirm service name, price, currency, and start date before saving it into your subscription calendar.",
                            image: subscriptionImage,
                            imageAlt:
                                "Reviewing subscription details in Subflow",
                        },
                        {
                            icon: "pie-chart",
                            title: "Add first, analyze immediately",
                            description:
                                "Once a subscription is saved, it becomes part of the same analytics and recurring-payment workflow as every other service you track.",
                            images: analyticsImages,
                            imageAlts: [
                                "Subscription analytics breakdown tab",
                                "Subscription analytics trend tab",
                            ],
                        },
                    ],
                    steps: [
                        `Smart Add: ${stripHtml(smartAdd.usage.text)}`,
                        basicSteps[1],
                        basicSteps[3],
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "What can I paste into Smart Add?",
                            answer: "You can paste subscription confirmation emails, receipt text, or pricing page content. Smart Add will extract the service name, price, currency, and billing cycle and fill them in for review.",
                        },
                        {
                            question:
                                "Do I need to check the result before saving?",
                            answer: "Yes. After Smart Add extracts the details, you review everything before saving — you can correct any field that was filled in incorrectly.",
                        },
                        {
                            question: "Is my pasted content stored by Subflow?",
                            answer: "No. The text you paste is used only to extract subscription details and is not stored after processing.",
                        },
                    ],
                },
                "raycast-extension": {
                    navTitle: "Raycast Extension",
                    metaTitle:
                        "Raycast Extension | Browse Subflow in Raycast & Menu Bar",
                    metaDescription:
                        "View your subscriptions and check upcoming renewals directly from Raycast and the macOS menu bar.",
                    title: "Browse your subscriptions without opening a browser",
                    description:
                        "The Subflow Raycast extension brings your full subscription list and menu bar access into the tools you already use every day.",
                    intro: "Opening a browser tab just to check a renewal date takes you out of your flow. With the Subflow Raycast extension, your subscriptions are one shortcut away — and always visible from the menu bar.",
                    heroImage: "/raycast/subflow-raycast.png",
                    heroImageAlt: "Subflow subscriptions in Raycast",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "View subscriptions and the menu bar in Raycast",
                            description:
                                "Search and scroll through your full subscription list directly inside Raycast. Enable the menu bar extra to keep upcoming renewals visible at all times — no browser needed.",
                            images: [
                                "/raycast/subflow-raycast-subscriptions.png",
                                "/raycast/subflow-raycast-action.png",
                            ],
                            imageAlts: [
                                "Subflow subscription list in Raycast",
                                "Subflow menu bar showing upcoming renewals",
                            ],
                        },
                        {
                            icon: "calendar",
                            title: "Keep upcoming renewals in the menu bar",
                            description:
                                "Enable the Subflow menu bar extra to keep your next subscription renewal visible at all times — no need to open an app or browser to check what is due.",
                        },
                    ],
                    steps: [
                        `Install: Search for Subflow in the Raycast Extension Store and click <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">Install</a>.`,
                        "Set the API key first: Sign in to Subflow, open the More menu → API Keys, enter a name such as Raycast, click Create, and copy the new API key immediately. Then open the Subflow extension preferences in Raycast and paste it there.",
                        "Browse: Use the Subflow command to view and search through all your tracked subscriptions.",
                        "Menu bar: Enable the Subflow Menu Bar extra in Raycast preferences to see upcoming renewals at a glance.",
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaLabel: "Get the Extension",
                    ctaHref: RAYCAST_EXTENSION_STORE_URL,
                    faqs: [
                        {
                            question:
                                "How do I install the Subflow Raycast extension?",
                            answer: `Open Raycast, search for Subflow in the Extension Store, and click <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">Install</a>. Once installed, create an API key in Subflow first, then paste it into the extension preferences.`,
                        },
                        {
                            question: "Where do I find my Subflow API key?",
                            answer: "Open Subflow, use the More menu → API Keys, enter a key name such as Raycast, click Create, and copy the API key immediately because it is only shown once. Paste it into the Subflow extension preferences inside Raycast.",
                        },
                        {
                            question: "What does the Subflow menu bar show?",
                            answer: "The menu bar extra displays your upcoming subscription renewals so you can quickly see what is due without opening a browser or the full app.",
                        },
                    ],
                },
            },
        },
        zh: {
            stepsTitle: "在 Subflow 中的使用方式",
            relatedTitle: "延伸閱讀",
            ctaLabel: "開始使用 Subflow",
            pages: {
                "subscription-tracker": {
                    navTitle: "訂閱追蹤",
                    metaTitle: "訂閱追蹤 | 用 Subflow 集中管理所有訂閱",
                    metaDescription:
                        "用 Subflow 集中追蹤訂閱、即將扣款與訂閱分析，包含月平均、現金流、12 個月趨勢與續訂預告，全部集中在同一個畫面。",
                    title: "把所有訂閱放進同一個清楚的追蹤畫面",
                    description:
                        "Subflow 讓你不用再靠試算表，也能掌握每月扣款、定期付款與整體訂閱支出。",
                    intro: "Subflow 把分散的訂閱費用整理成一個月曆與分析畫面。月付、季付、年付的方案都能一起追蹤，看見真正的訂閱支出，並在每次續訂前提早掌握，不再依賴試算表或翻查信用卡帳單。",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Subflow 訂閱追蹤總覽",
                    sections: [
                        {
                            icon: "calendar",
                            title: "用月曆快速看懂本月訂閱",
                            description:
                                "月曆檢視會把即將扣款的服務放在眼前，幫助你快速掌握本月要付什麼、下個月又會發生什麼。",
                            image: subscriptionImage,
                            imageAlt: "訂閱追蹤月曆畫面",
                        },
                        {
                            icon: "sparkles",
                            title: "手動新增或用智能新增都很快",
                            description:
                                "你可以搜尋既有服務、手動建立，也可以直接貼上收據或內容，讓 Subflow 自動帶入訂閱資料。",
                            image: smartAddImage,
                            imageAlt: "智能新增訂閱畫面",
                            note: cleanUsageText(locale, smartAdd.usage.text),
                        },
                        {
                            icon: "pie-chart",
                            title: "用兩個分析分頁看懂訂閱支出",
                            description:
                                "訂閱分析有兩個分頁。分類分頁呈現每個服務的占比，以及月付、季付、年付週期的比例。分析分頁則顯示月平均與現金流切換、年度支出、每日費用、訂閱總數、12 個月支出趨勢、未來 30 天的續訂、與上個月的差異，以及月付或季付方案運作超過一年時建議改為年付的提示。",
                            images: analyticsImages,
                            imageAlts: [
                                "訂閱分析的分類分頁",
                                "訂閱分析的趨勢分頁",
                            ],
                        },
                    ],
                    steps: [basicSteps[0], basicSteps[1], basicSteps[2]],
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "我要怎麼把訂閱加進 Subflow？",
                            answer: "點擊新增按鈕，搜尋服務名稱或手動輸入，設定金額、幣別與續訂日期後儲存，訂閱就會立刻出現在月曆裡。",
                        },
                        {
                            question: "Subflow 可以追蹤不同幣別的訂閱嗎？",
                            answer: "可以。每筆訂閱會以你輸入的幣別儲存，Subflow 在計算總額與分析時會自動換算為你設定的顯示幣別，方便在同一個基準下比較各種服務的支出。",
                        },
                        {
                            question: "訂閱分析裡面可以看到哪些資訊？",
                            answer: "有兩個分頁：分類分頁顯示占比最高的服務以及月付、季付、年付週期的比例。分析分頁則包含 12 個月支出趨勢、月平均與現金流切換、年度支出、每日費用、未來 30 天的續訂、與上個月相比的變化，以及月付或季付運作超過一年時建議改為年付的提示。",
                        },
                        {
                            question: "Subflow 會儲存我的付款資訊嗎？",
                            answer: "不會。Subflow 只儲存你輸入的訂閱資訊，包括服務名稱、金額、續訂日期與幣別，不會收集任何信用卡或銀行帳戶資料。",
                        },
                    ],
                },
                "recurring-payments": {
                    navTitle: "定期付款管理",
                    metaTitle: "定期付款管理 | 提前看見每次續訂與扣款",
                    metaDescription:
                        "追蹤月付、季付、年付的定期付款——在 Subflow 同一個畫面看到續訂日期、未來 30 天預告與週期占比分析。",
                    title: "在定期付款發生前就先掌握它們",
                    description:
                        "把月付、季付與年付訂閱整理在同一個流程裡，讓每次續訂與扣款都能被提前看見。",
                    intro: "Subflow 的核心就是讓定期付款變得可見。與其等信用卡帳單出現才回頭追查，不如先把每個付款週期整理在同一個地方。",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Subflow 定期付款月曆",
                    sections: [
                        {
                            icon: "calendar",
                            title: "讓每個付款週期都有位置",
                            description:
                                "透過月曆切換查看不同月份的訂閱扣款，快速知道哪一天會有哪筆費用發生。",
                            image: subscriptionImage,
                            imageAlt: "定期付款月曆畫面",
                            note: basicSteps[0],
                        },
                        {
                            icon: "mail",
                            title: "把付款追蹤和提醒搭在一起",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt: "電子郵件通知設定畫面",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "coins",
                            title: "月付、季付、年付混在一起也不亂",
                            description:
                                "一年一次的網域續費、每季扣款的保險、每個月的串流服務，可以並排放在同一個流程裡。每筆訂閱保留自己的週期與續訂日，不用手動換算就能一起管理。",
                        },
                    ],
                    steps: [basicSteps[0], basicSteps[1]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "Subflow 支援哪些付款週期？",
                            answer: "Subflow 支援月付、季付與年付，分析畫面會把每個週期換算為月平均成本，讓你可以放在同一條基準上比較。",
                        },
                        {
                            question: "扣款前我會收到通知嗎？",
                            answer: "會。在「更多選項」→「電子郵件通知」中開啟通知後，Subflow 會在每筆已追蹤訂閱續訂的前一天寄出電子郵件提醒，讓你有時間檢查或取消。",
                        },
                        {
                            question:
                                "Subflow 怎麼比較月付、季付、年付的支出占比？",
                            answer: "分析對話框中的週期分類會把每筆訂閱換算為月平均成本，讓你看見支出有多少來自月付、季付或年付方案。當月付或季付運作超過一年時，還會跳出建議改為年付的提示。",
                        },
                        {
                            question: "我可以在 Subflow 查看過去的扣款紀錄嗎？",
                            answer: "可以。月曆支援月份切換，讓你隨時回顧任何訂閱的歷史扣款。",
                        },
                    ],
                },
                "shared-subscriptions": {
                    navTitle: "共享訂閱",
                    metaTitle: "共享訂閱 | 和家人朋友一起管理共享服務",
                    metaDescription:
                        "邀請共同訂閱者、看見家庭或團隊的共享續訂，並在 Subflow 一個畫面裡分擔共享訂閱費用。",
                    title: "讓共享訂閱不再靠訊息和記憶硬撐",
                    description:
                        "把家人、朋友或同事一起使用的服務集中管理，讓共享訂閱的續訂與費用更容易協調。",
                    intro: "共享服務最麻煩的，通常不是訂閱本身，而是誰在用、誰該付、什麼時候續訂。Subflow 把這些資訊拉回同一個畫面裡。",
                    heroImage: sharedImage,
                    heroImageAlt: "Subflow 共享訂閱管理",
                    sections: [
                        {
                            icon: "users",
                            title: "直接邀請共同使用者",
                            description: coSubscriber.description,
                            image: sharedImage,
                            imageAlt: "共享訂閱者管理畫面",
                            note: cleanUsageText(
                                locale,
                                coSubscriber.usage.text,
                            ),
                        },
                        {
                            icon: "calendar",
                            title: "共享服務也能進同一個月曆",
                            description:
                                "共享訂閱建立後，續訂日期會和其他個人訂閱一起出現在同一個月曆裡，不會在多個地方分散。",
                            image: subscriptionImage,
                            imageAlt: "月曆中的共享訂閱",
                        },
                        {
                            icon: "mail",
                            title: "每個共享成員都能收到同一筆提醒",
                            description:
                                "共享訂閱建立後，每位共同訂閱者都可以在自己的帳號上開啟這筆訂閱的續訂提醒，下一次扣款不再只依賴某個人記得。",
                        },
                    ],
                    steps: [
                        `邀請共享訂閱者：${cleanUsageText(
                            locale,
                            coSubscriber.usage.text,
                        )}`,
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "我要怎麼邀請別人加入共享訂閱？",
                            answer: "打開訂閱，進入共享訂閱者區塊，輸入對方的電子郵件地址，對方就會收到邀請加入該訂閱。",
                        },
                        {
                            question: "每位共享訂閱者都需要 Subflow 帳號嗎？",
                            answer: "是的。每位受邀的人都需要免費的 Subflow 帳號才能查看和管理共享訂閱。",
                        },
                        {
                            question:
                                "共享訂閱可以使用和個人訂閱不同的幣別嗎？",
                            answer: "可以。每筆共享訂閱都可以保留自己的幣別，讓使用不同幣別計費的家庭或團隊方案維持正確紀錄，不影響其他訂閱的顯示與儲存。",
                        },
                        {
                            question: "我可以之後移除共享訂閱者嗎？",
                            answer: "可以。訂閱擁有者可以隨時在訂閱設定中移除任何共享訂閱者。",
                        },
                    ],
                },
                "subscription-reminders": {
                    navTitle: "訂閱提醒",
                    metaTitle: "訂閱提醒 | 在扣款前收到電子郵件通知",
                    metaDescription:
                        "在每筆訂閱續訂的前一天收到電子郵件提醒——Subflow 讓續訂提醒清楚可見，扣款再也不會悄悄發生。",
                    title: "在下一次扣款之前先收到提醒",
                    description:
                        "透過電子郵件提醒提早知道續訂時間，避免不必要的自動扣款與被遺忘的訂閱。",
                    intro: "很多訂閱不是太貴，而是太安靜。當它們默默續訂時，最容易浪費的錢就是你忘記檢查的那一筆。",
                    heroImage: notificationImage,
                    heroImageAlt: "Subflow 訂閱提醒設定",
                    sections: [
                        {
                            icon: "mail",
                            title: "在付款日前寄出提醒",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt: "訂閱提醒通知設定",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "sparkles",
                            title: "用一個開關決定要不要收到提醒",
                            description:
                                "帳號上有一個統一的通知開關，會一次控制所有訂閱的提醒。需要時保持打開、暫時不想被打擾時一鍵關閉，也不會讓信箱被不需要關注的扣款塞滿。",
                        },
                        {
                            icon: "calendar",
                            title: "用你習慣的語言收到提醒",
                            description:
                                "提醒信會依照「電子郵件通知」設定的語言寄出，讓提醒以你最熟悉的語言出現，看到信就能直接判斷要怎麼處理。",
                        },
                    ],
                    steps: [
                        `提醒設定：${cleanUsageText(
                            locale,
                            emailNotifications.usage.text,
                        )}`,
                    ],
                    related: [
                        "recurring-payments",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "Subflow 什麼時候會發送提醒？",
                            answer: "Subflow 會在每筆訂閱續訂的前一天寄出電子郵件提醒，讓你在扣款發生前還有時間檢查或取消。",
                        },
                        {
                            question: "提醒是怎麼發送的？",
                            answer: "提醒會以電子郵件的形式，寄送到你在「更多選項」→「電子郵件通知」中設定的信箱。",
                        },
                        {
                            question: "提醒信件會用什麼語言寄送？",
                            answer: "提醒信件會依你在電子郵件通知設定中選擇的語言寄出，可以讓 Subflow 的通知用你最熟悉的語言呈現。",
                        },
                        {
                            question: "要怎麼開啟或關閉訂閱提醒？",
                            answer: "打開「更多選項」→「電子郵件通知」，切換「通知」開關即可。這個開關會控制帳號中所有訂閱的提醒，你也可以隨時更新通知信箱與語言。",
                        },
                    ],
                },
                "smart-add-subscription": {
                    navTitle: "智能新增訂閱",
                    metaTitle: "智能新增訂閱 | 從收據或信件快速帶入資料",
                    metaDescription:
                        "貼上收據、郵件或訂閱資訊，讓 Smart Add 自動帶入訂閱資料，減少手動輸入。",
                    title: "把收據和郵件內容更快變成訂閱資料",
                    description:
                        "Smart Add 會分析你貼上的文字或上傳的收據，幫你自動填入訂閱資訊，減少手動輸入。",
                    intro: "多數訂閱管理工具最花時間的地方，就是第一步的手動建立。Smart Add 的目標就是把這件事縮短成幾個動作。",
                    heroImage: smartAddImage,
                    heroImageAlt: "Subflow 智能新增訂閱",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "貼上收據、信件或價格資訊",
                            description: smartAdd.description,
                            image: smartAddImage,
                            imageAlt: "智能新增輸入畫面",
                            note: cleanUsageText(locale, smartAdd.usage.text),
                        },
                        {
                            icon: "calendar",
                            title: "確認解析出的扣款資料",
                            description:
                                "分析完成後，你可以檢查服務名稱、價格、幣別與開始日期，再決定是否儲存到月曆裡。",
                            image: subscriptionImage,
                            imageAlt: "確認訂閱資料畫面",
                        },
                        {
                            icon: "pie-chart",
                            title: "新增後立即進入追蹤與分析",
                            description:
                                "一旦儲存成功，這筆訂閱就會立刻成為你的定期付款管理與支出分析的一部分。",
                            images: analyticsImages,
                            imageAlts: [
                                "訂閱分析的分類分頁",
                                "訂閱分析的趨勢分頁",
                            ],
                        },
                    ],
                    steps: [
                        `智能新增：${cleanUsageText(locale, smartAdd.usage.text)}`,
                        basicSteps[1],
                        basicSteps[3],
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "我可以貼什麼內容給 Smart Add？",
                            answer: "你可以貼上訂閱確認信、收據內容或價格頁面的文字。Smart Add 會自動提取服務名稱、價格、幣別與付款週期供你確認。",
                        },
                        {
                            question: "儲存前需要確認提取的資料嗎？",
                            answer: "需要。Smart Add 提取資料後，你可以在儲存前檢查並修正任何不正確的欄位。",
                        },
                        {
                            question: "我貼上的內容會被 Subflow 儲存嗎？",
                            answer: "不會。你貼上的文字只用於提取訂閱資料，處理完成後不會被保留。",
                        },
                    ],
                },
                "raycast-extension": {
                    navTitle: "Raycast 擴充功能",
                    metaTitle:
                        "Raycast 擴充功能 | 在 Raycast 和 Menu Bar 查看訂閱",
                    metaDescription:
                        "直接在 Raycast 和 macOS Menu Bar 查看訂閱清單、下一筆續訂日期與即將到期的項目。",
                    title: "不開啟瀏覽器，也能掌握所有訂閱",
                    description:
                        "直接在 Raycast 查看完整訂閱清單、下一筆續訂日期與即將到期的項目，不用再切回瀏覽器。",
                    intro: "想確認哪個服務快續訂，不需要再打開 Subflow 網頁。Subflow Raycast 擴充功能把你的訂閱清單帶進 Raycast，也能把下一筆續訂固定顯示在 Menu Bar。",
                    heroImage: "/raycast/subflow-raycast.png",
                    heroImageAlt: "在 Raycast 中查看 Subflow 訂閱",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "在 Raycast 內快速查看完整訂閱清單",
                            description:
                                "直接搜尋所有已追蹤的訂閱，快速查看服務名稱、費用金額、計費週期與下一筆續訂日期。要確認某個服務是不是快扣款，不需要再切回瀏覽器。",
                            images: [
                                "/raycast/subflow-raycast-subscriptions.png",
                                "/raycast/subflow-raycast-action.png",
                            ],
                            imageAlts: [
                                "Raycast 中的 Subflow 訂閱清單",
                                "Subflow Menu Bar 顯示即將到期的訂閱",
                            ],
                        },
                        {
                            icon: "calendar",
                            title: "把下一筆續訂固定在 Menu Bar",
                            description:
                                "啟用 Subflow 的 Menu Bar 指令後，你可以直接從 macOS 上方看到下一筆即將到期的訂閱。平常不必打開 Subflow，也能隨手確認最近要扣款的是哪一筆。",
                        },
                    ],
                    steps: [
                        `安裝：在 Raycast Extension Store 搜尋 Subflow 並點擊 <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">安裝</a>。`,
                        "建立 API 金鑰：登入 Subflow，打開右上角更多選單 → API Keys，輸入名稱（例如 Raycast）後點擊建立。這組 API Key 用來讓 Raycast 讀取你的訂閱資料。",
                        "貼上 API 金鑰：在 Raycast 中開啟 Subflow 擴充功能設定，貼上剛建立的 API Key。API Key 只會顯示一次，建立後請立刻複製。",
                        "開始使用：在 Raycast 搜尋 Subflow 查看完整訂閱清單。如果要固定顯示在 Menu Bar，搜尋 Subflow 的 Menu Bar 指令並按下 Enter。",
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaLabel: "取得擴充功能",
                    ctaHref: RAYCAST_EXTENSION_STORE_URL,
                    faqs: [
                        {
                            question: "如何安裝 Subflow Raycast 擴充功能？",
                            answer: `打開 Raycast，在 Extension Store 搜尋 Subflow 並點擊 <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">安裝</a>。安裝完成後，在 Subflow 建立 API Key，接著貼到 Raycast 的擴充功能設定中，就可以開始查看訂閱資料。`,
                        },
                        {
                            question: "API Key 沒有先複製到怎麼辦？",
                            answer: "API Key 建立後只會顯示一次。如果你當下沒有複製到，可以回到 Subflow 的 API Keys 重新建立一組新的金鑰，再貼到 Raycast 的擴充功能設定中。",
                        },
                        {
                            question: "沒有 Subflow 帳號也可以使用嗎？",
                            answer: "不行。Raycast 擴充功能需要透過你的 Subflow API Key 讀取訂閱資料，所以你需要先登入 Subflow，並至少建立一組 API Key。",
                        },
                        {
                            question: "Subflow Menu Bar 會顯示什麼內容？",
                            answer: "Menu Bar 會顯示下一筆即將到期的訂閱，讓你快速知道最近要續訂的是哪個服務，不需要再打開瀏覽器或完整的 App。",
                        },
                    ],
                },
            },
        },
        ja: {
            stepsTitle: "Subflow での使い方",
            relatedTitle: "関連ガイド",
            ctaLabel: "Subflow を使ってみる",
            pages: {
                "subscription-tracker": {
                    navTitle: "サブスク追跡",
                    metaTitle: "サブスク追跡 | Subflow でまとめて管理",
                    metaDescription:
                        "サブスク・次回請求・分析（月平均、キャッシュフロー、12か月の推移、更新予定）を1つのダッシュボードでまとめて確認できます。",
                    title: "すべてのサブスクを落ち着いて見渡せる一画面へ",
                    description:
                        "Subflow なら、スプレッドシートに頼らずに毎月の請求、定期支払い、サブスク支出をまとめて把握できます。",
                    intro: "Subflow は散らばったサブスク料金をひとつのカレンダーと分析画面に整理します。月額・四半期・年額のプランをまとめて追跡し、本当のサブスク支出を可視化、毎回の更新前に状況を把握できます。スプレッドシートやカード明細をたどる必要はありません。",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Subflow のサブスク追跡画面",
                    sections: [
                        {
                            icon: "calendar",
                            title: "今月の請求をひと目で確認",
                            description:
                                "カレンダー表示で今月の請求と次に来る更新をまとめて確認できるため、支払い予定を見落としにくくなります。",
                            image: subscriptionImage,
                            imageAlt: "サブスクカレンダー画面",
                        },
                        {
                            icon: "sparkles",
                            title: "手動追加でもスマート追加でも進めやすい",
                            description:
                                "既存サービスを検索して追加することも、領収書や内容を貼り付けて自動入力することもできます。",
                            image: smartAddImage,
                            imageAlt: "スマート追加画面",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "pie-chart",
                            title: "2つの分析タブでサブスク支出を読み解く",
                            description:
                                "サブスク分析には2つのタブがあります。内訳タブはサービスごとの占有率と、月額・四半期・年額の各サイクルの比率を表示します。分析タブでは月平均とキャッシュフローの切替、年間支出、1日あたりのコスト、サブスク件数、12か月の支出推移、今後30日間の更新、前月との差、月額や四半期プランが1年以上続いている場合の年額切替の提案まで確認できます。",
                            images: analyticsImages,
                            imageAlts: [
                                "サブスク分析の内訳タブ",
                                "サブスク分析の推移タブ",
                            ],
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "Subflow にサブスクを追加する方法は？",
                            answer: "追加ボタンをタップしてサービスを検索するか手入力し、金額・通貨・更新日を設定して保存します。すぐにカレンダーに反映されます。",
                        },
                        {
                            question: "複数の通貨のサブスクを追跡できますか？",
                            answer: "はい。各サブスクは入力した通貨で保存され、Subflow は合計額や分析を、あなたが設定した表示通貨に換算します。これにより、異なる通貨のサービスでも同じ基準で比較できます。",
                        },
                        {
                            question:
                                "サブスク分析ダイアログで何が見られますか？",
                            answer: "2つのタブがあります。内訳タブは支出の大きいサービスと、月額・四半期・年額サイクルの内訳を強調表示します。分析タブでは12か月の支出推移、月平均とキャッシュフローの切替、年間支出、1日あたりのコスト、今後30日間の更新、前月との差、月額や四半期プランが1年以上続いている場合の年額切替の提案を確認できます。",
                        },
                        {
                            question: "Subflow はカード情報を保存しますか？",
                            answer: "いいえ。Subflow が保存するのはサービス名・金額・更新日・通貨などの入力情報のみです。カード番号や銀行情報は一切収集しません。",
                        },
                    ],
                },
                "recurring-payments": {
                    navTitle: "定期支払い管理",
                    metaTitle: "定期支払い管理 | 更新日と請求日を見える化",
                    metaDescription:
                        "月額・四半期・年額の定期支払いを追跡。更新日、今後30日間の予測、サイクル別の内訳まで Subflow の1画面で確認できます。",
                    title: "定期支払いが起こる前に把握しておく",
                    description:
                        "月額、四半期、年額の更新を同じ流れで管理し、毎回の請求を後追いではなく先回りで確認できます。",
                    intro: "Subflow は定期支払いを見える状態にするためのツールです。カード明細を見てから思い出すのではなく、請求サイクルそのものを整理できます。",
                    heroImage: subscriptionImage,
                    heroImageAlt: "定期支払いカレンダー",
                    sections: [
                        {
                            icon: "calendar",
                            title: "請求サイクルをカレンダーで見える化",
                            description:
                                "月を切り替えながら、いつ・どのサブスクの請求が発生するかを同じ画面で確認できます。",
                            image: subscriptionImage,
                            imageAlt: "定期支払いカレンダー画面",
                            note: basicSteps[0],
                        },
                        {
                            icon: "mail",
                            title: "通知とセットで管理する",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt: "メール通知設定",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "coins",
                            title: "月額・四半期・年額が混ざっても扱える",
                            description:
                                "年に一度のドメイン更新、四半期ごとの保険、毎月のストリーミングサービスを同じ流れに並べて管理できます。各サブスクが自分のサイクルと更新日を保持するため、手作業で換算しなくても並べて把握できます。",
                        },
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "Subflow はどの請求サイクルに対応していますか？",
                            answer: "月額・四半期・年額に対応しています。分析画面では各サイクルを月額換算するため、同じ基準で比較できます。",
                        },
                        {
                            question: "定期支払いの前に通知を受け取れますか？",
                            answer: "はい。「その他」メニュー→「メール通知」から通知をオンにすると、追跡中の各サブスクの更新日の前日にリマインドが届き、確認や解約の時間を確保できます。",
                        },
                        {
                            question:
                                "月額・四半期・年額の支出比率はどう比較できますか？",
                            answer: "分析ダイアログのサイクル別内訳では、各サブスクを月額換算して、月額・四半期・年額プランそれぞれが支出に占める割合を比較できます。月額や四半期プランが1年以上続いている場合は、年額プランへの切替を提案するヒントも表示されます。",
                        },
                        {
                            question: "過去の支払い履歴を確認できますか？",
                            answer: "はい。カレンダーで月を切り替えると、追跡中のサブスクの過去の請求履歴を確認できます。",
                        },
                    ],
                },
                "shared-subscriptions": {
                    navTitle: "共有サブスク",
                    metaTitle: "共有サブスク | 家族や友人とまとめて管理",
                    metaDescription:
                        "共同利用者を招待し、家族・チームの共有サブスクの更新を見える化、Subflow の1つのダッシュボードで費用を分担できます。",
                    title: "共有サブスクをメッセージ頼みで管理しない",
                    description:
                        "家族や友人と使うサービスも同じダッシュボードに集約し、更新や費用の把握をシンプルにします。",
                    intro: "共有サブスクの難しさは、契約そのものよりも、誰が使っていて、いつ更新されるのかが分散しやすいことです。Subflow はその情報を一か所に戻します。",
                    heroImage: sharedImage,
                    heroImageAlt: "共有サブスク管理",
                    sections: [
                        {
                            icon: "users",
                            title: "共同利用者を招待する",
                            description: coSubscriber.description,
                            image: sharedImage,
                            imageAlt: "共同サブスク管理画面",
                            note: cleanUsageText(
                                locale,
                                coSubscriber.usage.text,
                            ),
                        },
                        {
                            icon: "calendar",
                            title: "共有サービスも同じ更新カレンダーへ",
                            description:
                                "共有サブスクも通常のサブスクと同じカレンダーで追跡できるため、更新日が別管理になりません。",
                            image: subscriptionImage,
                            imageAlt: "共有サブスクのカレンダー表示",
                        },
                        {
                            icon: "mail",
                            title: "共有メンバー全員が同じ更新通知を受け取れる",
                            description:
                                "共有サブスクを作成すると、共同利用者はそれぞれ自分のアカウントで同じ更新メール通知をオンにできます。次の請求が、誰か一人の記憶頼みになりません。",
                        },
                    ],
                    steps: [
                        `共同利用者を招待：${cleanUsageText(
                            locale,
                            coSubscriber.usage.text,
                        )}`,
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "共有サブスクに人を招待する方法は？",
                            answer: "サブスクを開いて共同利用者のセクションに移動し、相手のメールアドレスを入力します。招待が届き、相手は Subflow から共有サブスクに参加できます。",
                        },
                        {
                            question:
                                "共同利用者も Subflow のアカウントが必要ですか？",
                            answer: "はい。招待された人は無料の Subflow アカウントが必要です。",
                        },
                        {
                            question:
                                "共有サブスクには個人サブスクと別の通貨を設定できますか？",
                            answer: "はい。共有サブスクごとに通貨を保持できるため、別の通貨で課金される家族プランやチームプランも、ほかのサブスクの記録に影響せずに正確に管理できます。",
                        },
                        {
                            question: "後から共同利用者を削除できますか？",
                            answer: "はい。サブスクのオーナーはいつでも設定から共同利用者を削除できます。",
                        },
                    ],
                },
                "subscription-reminders": {
                    navTitle: "サブスク通知",
                    metaTitle: "サブスク通知 | 支払い前にメールでリマインド",
                    metaDescription:
                        "更新の前日にメールで通知を受け取れます。Subflow なら更新リマインドが見やすく、請求を見落としません。",
                    title: "次の請求が来る前にリマインドを受け取る",
                    description:
                        "更新前のメール通知で、不要な自動更新や見落としていた請求に気づきやすくなります。",
                    intro: "サブスクが高いからではなく、静かに更新されるから無駄になることがあります。Subflow はその前に確認のきっかけを作ります。",
                    heroImage: notificationImage,
                    heroImageAlt: "サブスク通知設定",
                    sections: [
                        {
                            icon: "mail",
                            title: "支払い前に通知を受け取る",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt: "メール通知設定画面",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "sparkles",
                            title: "ひとつのスイッチで通知をまとめて管理",
                            description:
                                "アカウントの通知スイッチひとつで、すべてのサブスクのリマインドを一括で制御できます。必要なときはオンのままにし、しばらく通知が不要なときはワンタップでオフにできるので、確認しなくてもよい請求でメールがあふれません。",
                        },
                        {
                            icon: "calendar",
                            title: "慣れた言語でリマインドを受け取る",
                            description:
                                "リマインドメールはメール通知設定で選んだ言語で送信されるため、もっとも読みやすい言語のまま受信箱に届き、内容をすぐに判断できます。",
                        },
                    ],
                    steps: [
                        `通知設定：${cleanUsageText(
                            locale,
                            emailNotifications.usage.text,
                        )}`,
                    ],
                    related: [
                        "recurring-payments",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "リマインドはいつ届きますか？",
                            answer: "Subflow は各サブスクの更新日の前日にメールでリマインドを送ります。請求が発生する前に内容を確認したり解約したりする時間を確保できます。",
                        },
                        {
                            question: "リマインドはどのように届きますか？",
                            answer: "「その他」メニュー→「メール通知」で設定したメールアドレスに送信されます。",
                        },
                        {
                            question:
                                "リマインドメールはどの言語で届きますか？",
                            answer: "メール通知設定で選んだ言語でリマインドメールが届くため、Subflow の通知を最も読みやすい言語に合わせられます。",
                        },
                        {
                            question:
                                "サブスクのリマインドはどうやってオン・オフしますか？",
                            answer: "「その他」メニュー→「メール通知」を開き、通知スイッチを切り替えます。このスイッチはアカウント上で追跡しているすべてのサブスクのリマインドをまとめて制御し、メールアドレスや言語もいつでも変更できます。",
                        },
                    ],
                },
                "smart-add-subscription": {
                    navTitle: "スマート追加",
                    metaTitle: "スマート追加 | 領収書やメールからすばやく登録",
                    metaDescription:
                        "領収書やメールの内容を貼り付けるだけで、Smart Add がサブスク情報を入力しやすくします。",
                    title: "領収書やメールの内容からサブスク登録を速くする",
                    description:
                        "Smart Add は貼り付けたテキストやアップロードした領収書を解析し、サブスク情報の入力を短縮します。",
                    intro: "サブスク管理が続かない理由の一つは、最初の入力が面倒だからです。Smart Add はその最初のハードルを下げます。",
                    heroImage: smartAddImage,
                    heroImageAlt: "スマート追加の入力画面",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "領収書、メール、料金情報を貼り付ける",
                            description: smartAdd.description,
                            image: smartAddImage,
                            imageAlt: "スマート追加の解析画面",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "calendar",
                            title: "抽出された請求情報を確認する",
                            description:
                                "解析後はサービス名、価格、通貨、開始日を確認してから保存できるため、入力ミスも抑えやすくなります。",
                            image: subscriptionImage,
                            imageAlt: "抽出後の確認画面",
                        },
                        {
                            icon: "pie-chart",
                            title: "登録後すぐに追跡と分析へ",
                            description:
                                "保存したサブスクはそのまま定期支払い管理と分析フローに入り、他のサービスと同じように扱えます。",
                            images: analyticsImages,
                            imageAlts: [
                                "サブスク分析の内訳タブ",
                                "サブスク分析の推移タブ",
                            ],
                        },
                    ],
                    steps: [
                        `スマート追加：${stripHtml(smartAdd.usage.text)}`,
                        basicSteps[1],
                        basicSteps[3],
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "Smart Add には何を貼り付けられますか？",
                            answer: "サブスクの確認メール、領収書のテキスト、料金ページの内容などを貼り付けられます。Smart Add がサービス名・価格・通貨・請求サイクルを自動入力します。",
                        },
                        {
                            question: "保存前に内容を確認できますか？",
                            answer: "はい。Smart Add が情報を抽出した後、保存前に内容を確認・修正できます。",
                        },
                        {
                            question: "貼り付けたテキストは保存されますか？",
                            answer: "いいえ。貼り付けたテキストはサブスク情報の抽出にのみ使用され、処理後は保存されません。",
                        },
                    ],
                },
                "raycast-extension": {
                    navTitle: "Raycast 拡張機能",
                    metaTitle:
                        "Raycast 拡張機能 | Raycast とメニューバーでサブスクを確認",
                    metaDescription:
                        "Raycast と macOS メニューバーから直接サブスク一覧と更新日を確認できます。",
                    title: "ブラウザを開かずにサブスクを管理する",
                    description:
                        "Subflow Raycast 拡張機能で、ブラウザを開かずにサブスク一覧をメニューバーや Raycast から確認できます。",
                    intro: "更新日を確認するためだけにブラウザを開くのは、作業の流れを止める原因になります。Subflow Raycast 拡張機能なら、サブスクへのアクセスはショートカット一つ、メニューバーからもいつでも確認できます。",
                    heroImage: "/raycast/subflow-raycast.png",
                    heroImageAlt: "Raycast 上の Subflow サブスク一覧",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "Raycast でサブスクとメニューバーを確認",
                            description:
                                "Raycast の画面から直接サブスクリストを検索・確認できます。メニューバー Extra を有効にすると次の更新日が常時表示されます。ブラウザなしで素早く確認できます。",
                            images: [
                                "/raycast/subflow-raycast-subscriptions.png",
                                "/raycast/subflow-raycast-action.png",
                            ],
                            imageAlts: [
                                "Raycast 内の Subflow サブスクリスト",
                                "Subflow メニューバーでサブスク更新日を表示",
                            ],
                        },
                        {
                            icon: "calendar",
                            title: "メニューバーで次回の更新を常時確認",
                            description:
                                "Subflow メニューバー Extra を有効にすると、次の更新日が常に画面上部に表示されます。アプリやブラウザを開かなくても更新状況を把握できます。",
                        },
                    ],
                    steps: [
                        `インストール：Raycast Extension Store で Subflow を検索して <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">インストール</a> をクリックします。`,
                        "先に API キーを設定：Subflow にログインし、右上の More メニュー → API Keys を開き、Raycast などの名前を入力して Create をクリックします。発行された API Key はすぐコピーし、Raycast の Subflow 拡張機能設定に貼り付けてください。",
                        "一覧確認：Subflow コマンドを使って、追跡中のすべてのサブスクを確認・検索します。",
                        "メニューバー：Raycast の設定で Subflow Menu Bar Extra を有効にすると、次の更新日がいつでも確認できます。",
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaLabel: "拡張機能を入手する",
                    ctaHref: RAYCAST_EXTENSION_STORE_URL,
                    faqs: [
                        {
                            question:
                                "Subflow Raycast 拡張機能のインストール方法は？",
                            answer: `Raycast を開いて Extension Store で Subflow を検索し、<a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">インストール</a> をクリックします。インストール後は、先に Subflow で API キーを発行して拡張機能設定に貼り付けてください。`,
                        },
                        {
                            question:
                                "Subflow の API キーはどこで取得できますか？",
                            answer: "Subflow アプリを開き、右上の More メニュー → API Keys に移動します。名前を入力して Create をクリックし、発行された API Key をすぐコピーして Raycast の Subflow 拡張機能設定に貼り付けてください。",
                        },
                        {
                            question:
                                "Subflow メニューバーには何が表示されますか？",
                            answer: "メニューバーには次回の更新が近いサブスクの情報が表示されます。ブラウザやアプリを開かなくても、更新予定を素早く確認できます。",
                        },
                    ],
                },
            },
        },
        es: {
            stepsTitle: "Cómo usarlo en Subflow",
            relatedTitle: "Guías relacionadas",
            ctaLabel: "Empieza con Subflow",
            pages: {
                "subscription-tracker": {
                    navTitle: "Rastreador de suscripciones",
                    metaTitle:
                        "Rastreador de Suscripciones | Gestiona todo en Subflow",
                    metaDescription:
                        "Sigue suscripciones, próximos cargos y analíticas — promedio mensual, flujo de caja, tendencia de 12 meses y próximas renovaciones — en un panel de Subflow.",
                    title: "Sigue todas tus suscripciones desde un panel claro",
                    description:
                        "Subflow te ayuda a ver cargos mensuales, pagos recurrentes y gasto total sin depender de hojas de cálculo.",
                    intro: "Subflow convierte los cargos de suscripción dispersos en un calendario y un panel de analíticas único. Sigue planes mensuales, trimestrales y anuales, observa tu gasto real en suscripciones y anticípate a cada renovación, sin hojas de cálculo ni revisar el extracto de la tarjeta.",
                    heroImage: subscriptionImage,
                    heroImageAlt:
                        "Vista general del rastreador de suscripciones",
                    sections: [
                        {
                            icon: "calendar",
                            title: "Ve tu mes de facturación de un vistazo",
                            description:
                                "La vista de calendario mantiene visibles los próximos cargos para que sepas qué se paga este mes y qué viene después.",
                            image: subscriptionImage,
                            imageAlt: "Calendario de suscripciones",
                        },
                        {
                            icon: "sparkles",
                            title: "Añade servicios manualmente o con Smart Add",
                            description:
                                "Puedes buscar servicios conocidos, crear uno nuevo o pegar un recibo para que Subflow complete los datos.",
                            image: smartAddImage,
                            imageAlt: "Smart Add para suscripciones",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "pie-chart",
                            title: "Lee tu gasto en suscripciones desde dos vistas de análisis",
                            description:
                                "El diálogo de analíticas tiene dos pestañas. Desglose muestra la participación de cada servicio y el reparto entre ciclos mensuales, trimestrales y anuales. Analítica muestra el promedio mensual frente a la vista de flujo de caja, el gasto anual, el coste diario, el total de suscripciones, la tendencia de 12 meses, las renovaciones de los próximos 30 días, la variación frente al mes anterior y una sugerencia de cambio a plan anual cuando los planes mensuales o trimestrales llevan más de un año activos.",
                            images: analyticsImages,
                            imageAlts: [
                                "Pestaña de desglose en analítica de suscripciones",
                                "Pestaña de tendencia en analítica de suscripciones",
                            ],
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "¿Cómo añado una suscripción a Subflow?",
                            answer: "Pulsa el botón de añadir, busca el servicio o ingrésalo manualmente, configura el importe, la moneda y la fecha de renovación, y guarda. La suscripción aparece en tu calendario de inmediato.",
                        },
                        {
                            question:
                                "¿Puede Subflow rastrear suscripciones en distintas monedas?",
                            answer: "Sí. Cada suscripción se guarda en la moneda que introduces, y Subflow convierte los totales y la analítica a la moneda de visualización que prefieras, de modo que puedes comparar el gasto de servicios en distintas monedas en la misma escala.",
                        },
                        {
                            question:
                                "¿Qué muestra el diálogo de análisis de suscripciones?",
                            answer: "Dos pestañas. Desglose destaca los servicios con mayor gasto y el reparto entre ciclos mensual, trimestral y anual. Analítica muestra la tendencia de gasto de 12 meses, el promedio mensual frente al flujo de caja, el gasto anual, el coste diario, las renovaciones de los próximos 30 días, la variación frente al mes anterior y una sugerencia de cambio a plan anual cuando los planes mensuales o trimestrales llevan más de un año activos.",
                        },
                        {
                            question:
                                "¿Subflow guarda mis datos de tarjeta de crédito?",
                            answer: "No. Subflow solo almacena la información que introduces: nombre del servicio, importe, fecha de renovación y moneda. No se recopilan números de tarjeta ni credenciales bancarias.",
                        },
                    ],
                },
                "recurring-payments": {
                    navTitle: "Pagos recurrentes",
                    metaTitle:
                        "Pagos Recurrentes | Mantén visibles renovaciones y cargos",
                    metaDescription:
                        "Sigue pagos recurrentes mensuales, trimestrales y anuales: fechas de renovación, previsión a 30 días y desglose por ciclo en una sola vista de Subflow.",
                    title: "Gestiona pagos recurrentes antes de que te sorprendan",
                    description:
                        "Mantén visibles renovaciones mensuales, trimestrales y anuales con un flujo diseñado para suscripciones y cargos periódicos.",
                    intro: "Subflow está diseñado alrededor de los pagos recurrentes. En lugar de descubrir una suscripción cuando ya llegó el cargo, puedes seguir todo su ciclo de facturación desde antes.",
                    heroImage: subscriptionImage,
                    heroImageAlt: "Calendario de pagos recurrentes",
                    sections: [
                        {
                            icon: "calendar",
                            title: "Haz visibles los ciclos de cobro",
                            description:
                                "Cambia entre meses y revisa cada cargo programado en una vista de calendario fácil de escanear.",
                            image: subscriptionImage,
                            imageAlt: "Calendario de pagos recurrentes",
                            note: basicSteps[0],
                        },
                        {
                            icon: "mail",
                            title: "Combina seguimiento con recordatorios",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt:
                                "Configuración de notificaciones por correo",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "coins",
                            title: "Mezcla mensual, trimestral y anual sin hojas de cálculo",
                            description:
                                "Una renovación anual de dominio, un seguro trimestral y un servicio de streaming mensual pueden convivir en el mismo flujo. Cada suscripción conserva su propio ciclo y fecha de renovación, así que no tienes que convertir nada a mano para verlas juntas.",
                        },
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "¿Qué ciclos de facturación soporta Subflow?",
                            answer: "Subflow soporta ciclos mensuales, trimestrales y anuales. La vista de análisis convierte cada ciclo a su coste mensual equivalente para que puedas compararlos en la misma escala.",
                        },
                        {
                            question:
                                "¿Recibiré un aviso antes de un pago recurrente?",
                            answer: "Sí. Activa las notificaciones en el menú Más → Notificaciones por correo y Subflow enviará un recordatorio el día antes de cada renovación para que tengas tiempo de revisar o cancelar.",
                        },
                        {
                            question:
                                "¿Cómo compara Subflow el gasto mensual, trimestral y anual?",
                            answer: "El diálogo de análisis incluye un desglose por ciclo que convierte cada suscripción a su coste mensual equivalente, así puedes ver qué parte de tu gasto viene de planes mensuales, trimestrales o anuales. Además, una sugerencia de plan anual marca las suscripciones mensuales o trimestrales que llevan más de un año activas.",
                        },
                        {
                            question:
                                "¿Puedo ver pagos recurrentes pasados en Subflow?",
                            answer: "Sí. El calendario te permite navegar entre meses para revisar el historial de facturación de cualquier suscripción registrada.",
                        },
                    ],
                },
                "shared-subscriptions": {
                    navTitle: "Suscripciones compartidas",
                    metaTitle:
                        "Suscripciones Compartidas | Gestiona planes en grupo",
                    metaDescription:
                        "Invita co-suscriptores, mantén visibles renovaciones familiares o de equipo y reparte los costes de las suscripciones compartidas desde un panel de Subflow.",
                    title: "Gestiona suscripciones compartidas con menos fricción",
                    description:
                        "Reúne servicios compartidos con familia, amigos o equipo en el mismo flujo para que renovaciones y gastos sean más fáciles de coordinar.",
                    intro: "Los servicios compartidos se vuelven caóticos cuando nadie recuerda quién lo usa, quién paga o cuándo se renueva. Subflow les da un lugar claro dentro del mismo panel.",
                    heroImage: sharedImage,
                    heroImageAlt: "Gestión de suscripciones compartidas",
                    sections: [
                        {
                            icon: "users",
                            title: "Invita a otras personas a una suscripción",
                            description: coSubscriber.description,
                            image: sharedImage,
                            imageAlt: "Pantalla de co-suscriptores",
                            note: cleanUsageText(
                                locale,
                                coSubscriber.usage.text,
                            ),
                        },
                        {
                            icon: "calendar",
                            title: "Mantén visibles las renovaciones compartidas",
                            description:
                                "Una vez añadida, la suscripción compartida aparece en el mismo calendario que el resto, sin perderse entre otras herramientas.",
                            image: subscriptionImage,
                            imageAlt:
                                "Suscripciones compartidas en el calendario",
                        },
                        {
                            icon: "mail",
                            title: "Cada persona del plan puede recibir el aviso",
                            description:
                                "Una vez compartida la suscripción, cada co-suscriptor puede activar el mismo recordatorio de renovación por email desde su cuenta. El próximo cobro deja de depender de quién se acuerde.",
                        },
                    ],
                    steps: [
                        `Invita a un co-suscriptor: ${cleanUsageText(
                            locale,
                            coSubscriber.usage.text,
                        )}`,
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "¿Cómo invito a alguien a una suscripción compartida?",
                            answer: "Abre la suscripción, ve a la sección de co-suscriptores e introduce el email de la persona. Recibirá una invitación para unirse a la suscripción en Subflow.",
                        },
                        {
                            question:
                                "¿Cada co-suscriptor necesita una cuenta de Subflow?",
                            answer: "Sí. Cada persona invitada necesita una cuenta gratuita de Subflow para ver y gestionar la suscripción compartida.",
                        },
                        {
                            question:
                                "¿Pueden las suscripciones compartidas usar una moneda distinta a las personales?",
                            answer: "Sí. Cada suscripción compartida mantiene su propia moneda, por lo que un plan familiar o de equipo facturado en otra moneda se mantiene exacto sin afectar a cómo se almacenan o muestran tus demás suscripciones.",
                        },
                        {
                            question:
                                "¿Puedo eliminar a un co-suscriptor más adelante?",
                            answer: "Sí. El propietario puede eliminar co-suscriptores en cualquier momento desde la configuración de la suscripción.",
                        },
                    ],
                },
                "subscription-reminders": {
                    navTitle: "Recordatorios",
                    metaTitle:
                        "Recordatorios de Suscripción | Avisos por Email Antes del Pago",
                    metaDescription:
                        "Recibe un recordatorio por email el día antes de cada renovación: Subflow mantiene visibles los avisos para que ningún cargo se te escape.",
                    title: "Recibe recordatorios antes de que llegue el próximo cobro",
                    description:
                        "Usa recordatorios por email para anticiparte a renovaciones, reducir cargos sorpresa y revisar qué suscripciones merece la pena mantener.",
                    intro: "Muchas suscripciones no son caras, solo son silenciosas. Cuando se renuevan sin avisar, el gasto más fácil de olvidar es el que nunca revisaste a tiempo.",
                    heroImage: notificationImage,
                    heroImageAlt: "Ajustes de recordatorios de suscripción",
                    sections: [
                        {
                            icon: "mail",
                            title: "Recibe avisos antes del día de pago",
                            description: emailNotifications.description,
                            image: notificationImage,
                            imageAlt:
                                "Notificaciones por correo de suscripciones",
                            note: cleanUsageText(
                                locale,
                                emailNotifications.usage.text,
                            ),
                        },
                        {
                            icon: "sparkles",
                            title: "Un único interruptor para activar o silenciar los recordatorios",
                            description:
                                "Un solo interruptor de notificaciones controla los recordatorios de todas las suscripciones de tu cuenta: lo dejas activado cuando quieres seguir las renovaciones y lo apagas de una vez cuando no, sin saturar la bandeja con cargos que ya tienes asumidos.",
                        },
                        {
                            icon: "calendar",
                            title: "Lee cada recordatorio en tu idioma",
                            description:
                                "Los emails de recordatorio respetan el idioma elegido en las notificaciones por email, así que el aviso de renovación llega en el idioma que lees con más comodidad y puedes decidir directamente desde la bandeja de entrada.",
                        },
                    ],
                    steps: [
                        `Configura recordatorios: ${cleanUsageText(
                            locale,
                            emailNotifications.usage.text,
                        )}`,
                    ],
                    related: [
                        "recurring-payments",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question:
                                "¿Cuándo envía Subflow un recordatorio de renovación?",
                            answer: "Subflow envía un recordatorio por email el día antes de cada renovación, así tienes tiempo para revisar o cancelar antes de que se efectúe el cargo.",
                        },
                        {
                            question:
                                "¿Cómo se envían los recordatorios de suscripción?",
                            answer: "Los recordatorios se envían por correo electrónico a la dirección que configures en el menú Más → Notificaciones por correo.",
                        },
                        {
                            question:
                                "¿En qué idioma llegarán los emails de recordatorio?",
                            answer: "Los recordatorios se envían en el idioma que elijas en la configuración de notificaciones por correo, así puedes recibir las alertas de Subflow en el idioma con el que te sientas más cómodo.",
                        },
                        {
                            question:
                                "¿Cómo activo o desactivo los recordatorios?",
                            answer: "Abre el menú Más → Notificaciones por correo y cambia el interruptor de notificación. Ese interruptor controla los recordatorios de todas las suscripciones de tu cuenta, y puedes actualizar la dirección o el idioma cuando quieras.",
                        },
                    ],
                },
                "smart-add-subscription": {
                    navTitle: "Añadir inteligente",
                    metaTitle:
                        "Añadir Inteligente | Crea suscripciones desde recibos",
                    metaDescription:
                        "Pega un recibo, email o precio y deja que Smart Add complete los datos de la suscripción por ti.",
                    title: "Convierte recibos y correos en suscripciones más rápido",
                    description:
                        "Smart Add analiza texto pegado o recibos subidos para rellenar automáticamente los datos de una suscripción.",
                    intro: "La parte que más frena a muchos usuarios es la carga manual inicial. Smart Add acorta ese proceso usando la información que ya tienes en un recibo o email.",
                    heroImage: smartAddImage,
                    heroImageAlt: "Flujo de añadir suscripción con IA",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "Pega un recibo, email o detalles de precios",
                            description: smartAdd.description,
                            image: smartAddImage,
                            imageAlt: "Pantalla de Smart Add",
                            note: stripHtml(smartAdd.usage.text),
                        },
                        {
                            icon: "calendar",
                            title: "Revisa los datos extraídos antes de guardar",
                            description:
                                "Después del análisis puedes confirmar servicio, precio, moneda y fecha de inicio antes de añadirlo al calendario.",
                            image: subscriptionImage,
                            imageAlt: "Revisión de datos de suscripción",
                        },
                        {
                            icon: "pie-chart",
                            title: "Añade y analiza en el mismo flujo",
                            description:
                                "Una vez guardada, la suscripción entra en el mismo sistema de análisis y pagos recurrentes que el resto de tus servicios.",
                            images: analyticsImages,
                            imageAlts: [
                                "Pestaña de desglose en analítica de suscripciones",
                                "Pestaña de tendencia en analítica de suscripciones",
                            ],
                        },
                    ],
                    steps: [
                        `Smart Add: ${stripHtml(smartAdd.usage.text)}`,
                        basicSteps[1],
                        basicSteps[3],
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                    faqs: [
                        {
                            question: "¿Qué puedo pegar en Smart Add?",
                            answer: "Puedes pegar correos de confirmación de suscripciones, texto de recibos o contenido de páginas de precios. Smart Add extraerá el nombre del servicio, precio, moneda y ciclo de facturación.",
                        },
                        {
                            question:
                                "¿Necesito revisar el resultado antes de guardar?",
                            answer: "Sí. Después de que Smart Add extrae los datos, puedes revisar y corregir cualquier campo antes de guardar la suscripción.",
                        },
                        {
                            question: "¿Subflow guarda el texto que pego?",
                            answer: "No. El texto pegado solo se usa para extraer los datos de la suscripción y no se almacena tras el procesamiento.",
                        },
                    ],
                },
                "raycast-extension": {
                    navTitle: "Extensión de Raycast",
                    metaTitle:
                        "Extensión de Raycast | Gestiona suscripciones en Raycast y la barra de menú",
                    metaDescription:
                        "Consulta tu lista de suscripciones y próximas renovaciones directamente desde Raycast y la barra de menú de macOS.",
                    title: "Gestiona tus suscripciones sin salir de Raycast",
                    description:
                        "La extensión Subflow para Raycast lleva tu lista completa de suscripciones y el acceso desde la barra de menú a las herramientas que ya usas cada día.",
                    intro: "Abrir una pestaña del navegador solo para comprobar una fecha de renovación interrumpe tu flujo de trabajo. Con la extensión Subflow para Raycast, tus suscripciones están a un atajo de distancia y siempre visibles desde la barra de menú.",
                    heroImage: "/raycast/subflow-raycast.png",
                    heroImageAlt: "Suscripciones de Subflow en Raycast",
                    sections: [
                        {
                            icon: "sparkles",
                            title: "Consulta y busca suscripciones en Raycast",
                            description:
                                "Busca y revisa tu lista completa de suscripciones directamente en Raycast. Consulta nombres de servicios, importes y próximas fechas de renovación sin cambiar al navegador.",
                            images: [
                                "/raycast/subflow-raycast-subscriptions.png",
                                "/raycast/subflow-raycast-action.png",
                            ],
                            imageAlts: [
                                "Lista de suscripciones de Subflow en Raycast",
                                "Barra de menú de Subflow con próximas renovaciones",
                            ],
                        },
                        {
                            icon: "calendar",
                            title: "Mantén las próximas renovaciones en la barra de menú",
                            description:
                                "Activa el extra de barra de menú de Subflow para tener siempre visible tu próxima renovación de suscripción — sin necesidad de abrir una app ni el navegador.",
                        },
                    ],
                    steps: [
                        `Instala: Busca Subflow en Raycast Extension Store y haz clic en <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">Instalar</a>.`,
                        "Configura primero la API key: Inicia sesión en Subflow, abre el menú More → API Keys, escribe un nombre como Raycast, haz clic en Create y copia la API Key de inmediato. Luego pégala en las preferencias de la extensión Subflow en Raycast.",
                        "Navega: Usa el comando Subflow para ver y buscar todas tus suscripciones registradas.",
                        "Barra de menú: Activa el extra de barra de menú de Subflow en las preferencias de Raycast para ver las próximas renovaciones de un vistazo.",
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaLabel: "Obtener la extensión",
                    ctaHref: RAYCAST_EXTENSION_STORE_URL,
                    faqs: [
                        {
                            question:
                                "¿Cómo instalo la extensión Subflow para Raycast?",
                            answer: `Abre Raycast, busca Subflow en Extension Store y haz clic en <a href="${RAYCAST_EXTENSION_STORE_URL}" target="_blank" rel="noopener noreferrer">Instalar</a>. Una vez instalada, crea primero una API Key en Subflow y pégala en las preferencias de la extensión.`,
                        },
                        {
                            question: "¿Dónde encuentro mi API Key de Subflow?",
                            answer: "Abre Subflow, ve al menú More → API Keys, escribe un nombre como Raycast y haz clic en Create. Copia la API Key de inmediato porque solo se muestra una vez, y pégala en las preferencias de la extensión Subflow en Raycast.",
                        },
                        {
                            question:
                                "¿Qué muestra la barra de menú de Subflow?",
                            answer: "El extra de barra de menú muestra tus próximas renovaciones de suscripción para que puedas ver rápidamente qué vence pronto sin abrir un navegador ni la aplicación completa.",
                        },
                    ],
                },
            },
        },
    } satisfies Record<
        AppLocale,
        {
            stepsTitle: string;
            relatedTitle: string;
            ctaLabel: string;
            pages: Omit<
                Record<
                    FeaturePageSlug,
                    Omit<
                        LocalizedFeaturePage,
                        "slug" | "stepsTitle" | "relatedTitle" | "ctaLabel"
                    > & { ctaLabel?: string }
                >,
                never
            >;
        }
    >;

    const bundle = localized[locale];

    return Object.fromEntries(
        featurePageSlugs.map((slug) => [
            slug,
            {
                slug,
                stepsTitle: bundle.stepsTitle,
                relatedTitle: bundle.relatedTitle,
                ctaLabel: bundle.ctaLabel,
                ...bundle.pages[slug],
            },
        ]),
    ) as LocaleFeatureDictionary;
});

export function getFeaturePage(locale: AppLocale, slug: FeaturePageSlug) {
    return buildFeaturePages(locale)[slug];
}

export function getFeaturePages(locale: AppLocale) {
    const pages = buildFeaturePages(locale);
    return featurePageSlugs.map((slug) => pages[slug]);
}

const FEATURE_PAGE_KEYWORDS: Record<
    FeaturePageSlug,
    Record<AppLocale, string[]>
> = {
    "subscription-tracker": {
        en: [
            "subscription tracker",
            "subscription management",
            "track subscriptions",
            "monthly subscription tracker",
            "subscription expense tracker",
            "subscription dashboard",
        ],
        zh: [
            "訂閱追蹤",
            "訂閱管理",
            "訂閱追蹤工具",
            "訂閱費用追蹤",
            "訂閱清單管理",
            "訂閱儀表板",
        ],
        ja: [
            "サブスク追跡",
            "サブスク管理",
            "サブスク管理アプリ",
            "サブスク家計簿",
            "月額管理",
            "サブスクダッシュボード",
        ],
        es: [
            "rastreador de suscripciones",
            "gestor de suscripciones",
            "control de suscripciones",
            "panel de suscripciones",
            "gestionar suscripciones mensuales",
        ],
    },
    "recurring-payments": {
        en: [
            "recurring payments tracker",
            "recurring payment manager",
            "auto renewal tracker",
            "billing reminder",
            "recurring billing app",
        ],
        zh: [
            "定期付款管理",
            "自動扣款追蹤",
            "續訂提醒",
            "定期帳單管理",
            "自動續訂管理",
        ],
        ja: [
            "定期支払い管理",
            "自動更新追跡",
            "継続課金管理",
            "請求リマインダー",
            "定期支払いアプリ",
        ],
        es: [
            "pagos recurrentes",
            "gestor de pagos recurrentes",
            "renovación automática",
            "recordatorio de facturación",
            "control de cobros recurrentes",
        ],
    },
    "shared-subscriptions": {
        en: [
            "shared subscriptions",
            "split subscription cost",
            "family subscription manager",
            "shared streaming account tracker",
            "split bills with friends",
        ],
        zh: [
            "共享訂閱",
            "分攤訂閱費用",
            "家庭訂閱管理",
            "共享帳號管理",
            "朋友分攤帳單",
        ],
        ja: [
            "共有サブスク",
            "サブスク割り勘",
            "家族サブスク管理",
            "シェアアカウント管理",
            "サブスク費用分担",
        ],
        es: [
            "suscripciones compartidas",
            "dividir suscripciones",
            "suscripciones en familia",
            "compartir cuentas de streaming",
            "dividir gastos con amigos",
        ],
    },
    "subscription-reminders": {
        en: [
            "subscription reminders",
            "bill reminder app",
            "renewal reminder",
            "subscription email alerts",
            "avoid forgotten subscriptions",
        ],
        zh: [
            "訂閱提醒",
            "帳單提醒",
            "續訂通知",
            "訂閱到期提醒",
            "電子郵件訂閱提醒",
        ],
        ja: [
            "サブスクリマインダー",
            "請求通知",
            "更新通知",
            "サブスク期限通知",
            "メール通知",
        ],
        es: [
            "recordatorios de suscripciones",
            "recordatorios de facturación",
            "alertas de renovación",
            "avisos de suscripción",
            "notificaciones por correo",
        ],
    },
    "smart-add-subscription": {
        en: [
            "smart add subscription",
            "AI subscription tracker",
            "automatic subscription detection",
            "subscription import",
            "screenshot to subscription",
        ],
        zh: [
            "智慧新增訂閱",
            "AI 訂閱辨識",
            "自動新增訂閱",
            "訂閱截圖識別",
            "快速新增訂閱",
        ],
        ja: [
            "スマート追加",
            "AIサブスク認識",
            "自動サブスク登録",
            "スクリーンショット認識",
            "サブスク自動入力",
        ],
        es: [
            "añadir suscripciones inteligente",
            "detección automática de suscripciones",
            "rastreador de suscripciones IA",
            "importar suscripciones",
            "captura a suscripción",
        ],
    },
    "raycast-extension": {
        en: [
            "Subflow Raycast extension",
            "Raycast subscription tracker",
            "Raycast productivity",
            "manage subscriptions in Raycast",
        ],
        zh: [
            "Subflow Raycast 擴充功能",
            "Raycast 訂閱管理",
            "Raycast 生產力工具",
            "在 Raycast 管理訂閱",
        ],
        ja: [
            "Subflow Raycast 拡張機能",
            "Raycast サブスク管理",
            "Raycast 生産性",
            "Raycast でサブスクを管理",
        ],
        es: [
            "extensión Raycast de Subflow",
            "Raycast gestor de suscripciones",
            "productividad en Raycast",
            "gestionar suscripciones en Raycast",
        ],
    },
};

export function getFeaturePageMetadata(
    locale: AppLocale,
    slug: FeaturePageSlug,
): Metadata {
    const feature = getFeaturePage(locale, slug);

    return createLocalizedMetadata({
        locale,
        pathname: `/${slug}`,
        title: feature.metaTitle,
        description: feature.metaDescription,
        keywords: FEATURE_PAGE_KEYWORDS[slug][locale],
        ogImageUrl: `${SITE_ORIGIN}${feature.heroImage}`,
        ogImageAlt: feature.heroImageAlt,
    });
}

export function getFeaturePageStructuredData(
    locale: AppLocale,
    slug: FeaturePageSlug,
) {
    const feature = getFeaturePage(locale, slug);
    const pageUrl = getLocalizedUrl(locale, `/${slug}`);
    const lastModifiedIso = `${featurePageUpdatedAt[slug]}T00:00:00.000Z`;
    const heroImageUrl = feature.heroImage.startsWith("http")
        ? feature.heroImage
        : `${SITE_ORIGIN}${feature.heroImage}`;

    const graph: object[] = [
        {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            name: feature.title,
            description: feature.description,
            url: pageUrl,
            inLanguage: BCP47_LOCALES[locale],
            dateModified: lastModifiedIso,
            primaryImageOfPage: heroImageUrl,
            isPartOf: {
                "@type": "WebSite",
                name: "Subflow",
                url: SITE_ORIGIN,
            },
            about: {
                "@type": "Organization",
                name: "Subflow",
                url: SITE_ORIGIN,
            },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Subflow",
                    item: getLocalizedUrl(locale),
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: feature.navTitle,
                    item: pageUrl,
                },
            ],
        },
        {
            "@type": "FAQPage",
            mainEntity: feature.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: stripHtml(faq.answer),
                },
            })),
        },
    ];

    if (feature.steps.length > 0) {
        graph.push({
            "@type": "HowTo",
            name: feature.title,
            description: feature.description,
            inLanguage: BCP47_LOCALES[locale],
            image: heroImageUrl,
            totalTime: "PT2M",
            step: feature.steps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name:
                    stripHtml(step).split(/[:：]/)[0]?.trim() ||
                    `Step ${index + 1}`,
                text: stripHtml(step),
                url: `${pageUrl}#step-${index + 1}`,
            })),
        });
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    };
}
