import type { Metadata } from "next";
import { getContent, type Language } from "@/lib/email/content";
import {
    SITE_ORIGIN,
    type AppLocale,
    createLocalizedMetadata,
    getLocalizedUrl,
} from "@/lib/seo";

export const featurePageSlugs = [
    "subscription-tracker",
    "recurring-payments",
    "shared-subscriptions",
    "subscription-reminders",
    "smart-add-subscription",
] as const;

export type FeaturePageSlug = (typeof featurePageSlugs)[number];
export const featurePageUpdatedAt: Record<FeaturePageSlug, string> = {
    "subscription-tracker": "2026-04-11",
    "recurring-payments": "2026-04-11",
    "shared-subscriptions": "2026-04-11",
    "subscription-reminders": "2026-04-11",
    "smart-add-subscription": "2026-04-11",
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
    note?: string;
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

function buildFeaturePages(locale: AppLocale): LocaleFeatureDictionary {
    const email = getContent(toLanguage(locale));
    const [smartAdd, emailNotifications, analytics, coSubscriber] =
        email.sections.highlights.items;
    const basicItems = email.sections.basic.items;
    const basicSteps = basicItems.map((item) =>
        formatStep(locale, item.label, item.text),
    );

    const sharedImage = localWelcomeImage("co-subscriber", locale);
    const notificationImage = localWelcomeImage("email-notification", locale);
    const smartAddImage = localWelcomeImage("smart-add", locale);
    const analyticsImage = localWelcomeImage("subscription-analyze", locale);
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
                        "Track subscriptions, upcoming charges, and spending in one clear dashboard with Subflow.",
                    title: "Track every subscription from one calm dashboard",
                    description:
                        "Subflow gives you a clear view of monthly charges, recurring payments, and subscription spend without using spreadsheets.",
                    intro: stripHtml(email.intro),
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
                            title: "Understand where the money goes",
                            description: analytics.description,
                            image: analyticsImage,
                            imageAlt: "Subscription analytics charts",
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                },
                "recurring-payments": {
                    navTitle: "Recurring Payments",
                    metaTitle:
                        "Recurring Payments | Keep Renewal Dates Visible",
                    metaDescription:
                        "Keep recurring payments and renewal dates visible in a calendar view before the next charge arrives.",
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
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                },
                "shared-subscriptions": {
                    navTitle: "Shared Subscriptions",
                    metaTitle:
                        "Shared Subscriptions | Manage Shared Plans with Subflow",
                    metaDescription:
                        "Invite co-subscribers, keep shared renewals visible, and manage shared subscriptions in one place.",
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
                },
                "subscription-reminders": {
                    navTitle: "Subscription Reminders",
                    metaTitle:
                        "Subscription Reminders | Email Alerts Before Payment Day",
                    metaDescription:
                        "Set up email reminders before subscription payment days so renewals do not slip past you.",
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
                            image: analyticsImage,
                            imageAlt: "Analytics after adding subscriptions",
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
                        "用 Subflow 集中追蹤訂閱、即將扣款與整體支出，畫面清楚又好管理。",
                    title: "把所有訂閱放進同一個清楚的追蹤畫面",
                    description:
                        "Subflow 讓你不用再靠試算表，也能掌握每月扣款、定期付款與整體訂閱支出。",
                    intro: stripHtml(email.intro),
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
                            title: "看懂錢都花到哪裡去了",
                            description: analytics.description,
                            image: analyticsImage,
                            imageAlt: "訂閱分析圖表",
                        },
                    ],
                    steps: [basicSteps[0], basicSteps[1], basicSteps[2]],
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                },
                "recurring-payments": {
                    navTitle: "定期付款管理",
                    metaTitle: "定期付款管理 | 提前看見每次續訂與扣款",
                    metaDescription:
                        "用月曆檢視定期付款與續訂日期，在扣款前就先掌握每個付款週期。",
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
                    ],
                    steps: [basicSteps[0], basicSteps[1]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                },
                "shared-subscriptions": {
                    navTitle: "共享訂閱",
                    metaTitle: "共享訂閱 | 和家人朋友一起管理共享服務",
                    metaDescription:
                        "邀請共同使用者、掌握共享服務續訂，讓共享訂閱集中在同一個地方管理。",
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
                },
                "subscription-reminders": {
                    navTitle: "訂閱提醒",
                    metaTitle: "訂閱提醒 | 在扣款前收到電子郵件通知",
                    metaDescription:
                        "設定電子郵件提醒，在訂閱扣款前先收到通知，不再錯過續訂檢查時機。",
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
                            image: analyticsImage,
                            imageAlt: "新增後的訂閱分析",
                        },
                    ],
                    steps: [
                        `智能新增：${cleanUsageText(locale, smartAdd.usage.text)}`,
                    ],
                    related: [
                        "subscription-tracker",
                        "recurring-payments",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
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
                        "サブスク、次回請求、支出の流れを1つの見やすい画面でまとめて確認できます。",
                    title: "すべてのサブスクを落ち着いて見渡せる一画面へ",
                    description:
                        "Subflow なら、スプレッドシートに頼らずに毎月の請求、定期支払い、サブスク支出をまとめて把握できます。",
                    intro: stripHtml(email.intro),
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
                            title: "支出の流れをすぐに理解",
                            description: analytics.description,
                            image: analyticsImage,
                            imageAlt: "サブスク分析チャート",
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                },
                "recurring-payments": {
                    navTitle: "定期支払い管理",
                    metaTitle: "定期支払い管理 | 更新日と請求日を見える化",
                    metaDescription:
                        "定期支払いと更新日をカレンダーで確認し、次の請求前に把握しやすくします。",
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
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                },
                "shared-subscriptions": {
                    navTitle: "共有サブスク",
                    metaTitle: "共有サブスク | 家族や友人とまとめて管理",
                    metaDescription:
                        "共同利用者を招待し、共有サブスクの更新日を1か所で見やすく管理できます。",
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
                },
                "subscription-reminders": {
                    navTitle: "サブスク通知",
                    metaTitle: "サブスク通知 | 支払い前にメールでリマインド",
                    metaDescription:
                        "支払い前にメール通知を受け取り、サブスク更新を見直すタイミングを逃しにくくします。",
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
                            image: analyticsImage,
                            imageAlt: "登録後の分析画面",
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
                        "Sigue tus suscripciones, próximos cargos y gasto total desde un panel claro en Subflow.",
                    title: "Sigue todas tus suscripciones desde un panel claro",
                    description:
                        "Subflow te ayuda a ver cargos mensuales, pagos recurrentes y gasto total sin depender de hojas de cálculo.",
                    intro: stripHtml(email.intro),
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
                            title: "Entiende a dónde se va el dinero",
                            description: analytics.description,
                            image: analyticsImage,
                            imageAlt: "Análisis de suscripciones",
                        },
                    ],
                    steps: basicSteps,
                    related: [
                        "recurring-payments",
                        "smart-add-subscription",
                        "subscription-reminders",
                    ],
                    ctaHref: "/login",
                },
                "recurring-payments": {
                    navTitle: "Pagos recurrentes",
                    metaTitle:
                        "Pagos Recurrentes | Mantén visibles renovaciones y cargos",
                    metaDescription:
                        "Consulta pagos recurrentes y fechas de renovación en un calendario antes de que llegue el próximo cobro.",
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
                    ],
                    steps: [basicSteps[0]],
                    related: [
                        "subscription-reminders",
                        "subscription-tracker",
                        "shared-subscriptions",
                    ],
                    ctaHref: "/login",
                },
                "shared-subscriptions": {
                    navTitle: "Suscripciones compartidas",
                    metaTitle:
                        "Suscripciones Compartidas | Gestiona planes en grupo",
                    metaDescription:
                        "Invita co-suscriptores y mantén visibles las renovaciones de tus suscripciones compartidas en un solo lugar.",
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
                },
                "subscription-reminders": {
                    navTitle: "Recordatorios",
                    metaTitle:
                        "Recordatorios de Suscripción | Avisos por Email Antes del Pago",
                    metaDescription:
                        "Configura recordatorios por email antes del día de pago para no pasar por alto una renovación.",
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
                            image: analyticsImage,
                            imageAlt: "Análisis tras añadir una suscripción",
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
                    >
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
}

export function getFeaturePage(locale: AppLocale, slug: FeaturePageSlug) {
    return buildFeaturePages(locale)[slug];
}

export function getFeaturePages(locale: AppLocale) {
    return featurePageSlugs.map((slug) => getFeaturePage(locale, slug));
}

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

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                name: feature.title,
                description: feature.description,
                url: pageUrl,
                inLanguage: locale,
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
        ],
    };
}
