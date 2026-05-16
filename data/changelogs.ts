export interface ChangelogItem {
    date: string;
    icon: string;
    size?: number;
    /**
     * Optional internal href/path linking this entry to a feature page
     * (e.g. "/raycast-extension"). Used to strengthen sitewide internal
     * linking for SEO.
     */
    link?: {
        href: string;
        label: {
            en: string;
            zh: string;
            ja: string;
            es: string;
        };
    };
    title: {
        en: string;
        zh: string;
        ja: string;
        es: string;
    };
    content: {
        en: string;
        zh: string;
        ja: string;
        es: string;
    };
}

export const changelogs: ChangelogItem[] = [
    {
        date: "2026-05-09",
        icon: "PieChart",
        title: {
            en: "Subscription Analytics Redesign",
            zh: "訂閱分析全新改版",
            ja: "サブスク分析リニューアル",
            es: "Rediseño de análisis de suscripciones",
        },
        content: {
            en: "The subscription analytics dialog now has two tabs. Breakdown shows each service's share of spend and the split across monthly, quarterly, and annual billing cycles. Analytics adds the 12-month spend trend, monthly average vs. cash-flow toggle, annual spend, daily rate, the next 30 days of renewals, change vs. last month, and an annual-upgrade hint when monthly or quarterly plans have been running for over a year.",
            zh: "訂閱分析新增兩個分頁。「分類」分頁呈現每個服務的支出占比，以及月付、季付、年付的週期比例。「分析」分頁新增 12 個月支出趨勢、月平均與現金流切換、年度支出、每日費用、未來 30 天的續訂、與上個月的差異，以及月付或季付方案運作超過一年時建議改為年付的提示。",
            ja: "サブスク分析ダイアログに2つのタブを追加しました。「内訳」タブは各サービスの支出シェアと、月額・四半期・年額サイクルの内訳を表示します。「分析」タブには12か月の支出推移、月平均とキャッシュフローの切替、年間支出、1日あたりのコスト、今後30日間の更新、前月との差、そして月額・四半期プランが1年以上続いている場合の年額切替の提案を追加しました。",
            es: "El diálogo de análisis de suscripciones ahora tiene dos pestañas. Desglose muestra la participación de cada servicio en el gasto y el reparto entre ciclos mensual, trimestral y anual. Analítica añade la tendencia de gasto de 12 meses, el cambio entre promedio mensual y flujo de caja, el gasto anual, el coste diario, las renovaciones de los próximos 30 días, la variación frente al mes anterior y una sugerencia de cambio a plan anual cuando los planes mensuales o trimestrales llevan más de un año activos.",
        },
    },
    {
        date: "2026-04-28",
        icon: "Sparkles",
        title: {
            en: "Raycast Extension",
            zh: "Raycast 擴充功能",
            ja: "Raycast 拡張機能",
            es: "Extensión de Raycast",
        },
        content: {
            en: "Use the new Subflow Raycast extension to browse your subscription list, check the next renewal date, and keep upcoming charges visible from the macOS menu bar without switching back to the browser.",
            zh: "現在可以透過全新的 Subflow Raycast 擴充功能，直接在 Raycast 查看訂閱清單、下一筆續訂日期，並把即將到期的項目固定顯示在 macOS Menu Bar，不必再切回瀏覽器。",
            ja: "新しい Subflow Raycast 拡張機能を使うと、Raycast からサブスク一覧や次回更新日を確認でき、macOS メニューバーにも次に近い更新を表示できます。ブラウザへ戻る必要はありません。",
            es: "La nueva extensión de Subflow para Raycast te permite consultar tu lista de suscripciones, revisar la próxima fecha de renovación y mantener visibles los próximos cargos desde la barra de menú de macOS sin volver al navegador.",
        },
        link: {
            href: "/raycast-extension",
            label: {
                en: "See Raycast extension",
                zh: "查看 Raycast 擴充功能",
                ja: "Raycast 拡張機能を見る",
                es: "Ver la extensión de Raycast",
            },
        },
    },
    {
        date: "2026-02-10",
        icon: "Mail",
        title: {
            en: "Welcome Email",
            zh: "歡迎信件",
            ja: "ウェルカムメール",
            es: "Correo de bienvenida",
        },
        content: {
            en: "New users now receive a welcome email to help them get started with Subflow.",
            zh: "新用戶現在會收到歡迎信，幫助您快速開始使用 Subflow。",
            ja: "新規ユーザーは Subflow の使い方をご案内するウェルカムメールを受け取ります。",
            es: "Los nuevos usuarios ahora reciben un correo de bienvenida para ayudarles a comenzar con Subflow.",
        },
    },
    {
        date: "2026-01-31",
        icon: "Sparkles",
        title: {
            en: "Smart Add",
            zh: "智慧新增",
            ja: "スマート追加",
            es: "Agregar de forma inteligente",
        },
        content: {
            en: "Paste any subscription details or upload a receipt and Subflow will automatically fill in everything for you.",
            zh: "貼上訂閱資訊或上傳收據，Subflow 會自動解析並填入所有訂閱內容。",
            ja: "サブスクリプションの情報を貼り付けるか収納をアップロードするだけで、Subflow が自動的に内容を解析して入力します。",
            es: "Pegue los detalles de su suscripción o suba una recibo y Subflow completará automáticamente toda la información.",
        },
        link: {
            href: "/smart-add-subscription",
            label: {
                en: "See Smart Add guide",
                zh: "查看智慧新增說明",
                ja: "スマート追加ガイドを見る",
                es: "Ver la guía de Smart Add",
            },
        },
    },
    {
        date: "2026-01-06",
        icon: "Users",
        title: {
            en: "Co-subscriptions",
            zh: "共同訂閱",
            ja: "共同購読",
            es: "Suscripciones compartidas",
        },
        content: {
            en: "Share subscriptions with friends, family, or teammates and manage shared expenses together.",
            zh: "與朋友、家人或團隊夥伴共享訂閱項目，輕鬆一起管理共同花費。",
            ja: "友人・家族・チームメンバーとサブスクリプションを共有し、共同の支出をまとめて管理できます。",
            es: "Comparta suscripciones con amigos, familiares o compañeros de equipo y administren juntos los gastos compartidos.",
        },
        link: {
            href: "/shared-subscriptions",
            label: {
                en: "See shared subscriptions",
                zh: "查看共享訂閱說明",
                ja: "共有サブスクの解説を見る",
                es: "Ver suscripciones compartidas",
            },
        },
    },
    {
        date: "2025-09-30",
        icon: "MailCheck",
        title: {
            en: "Email Notifications",
            zh: "電子郵件通知",
            ja: "メール通知",
            es: "Notificaciones por correo electrónico",
        },
        content: {
            en: "Get notified by email before your subscriptions are due so you're never caught off guard.",
            zh: "在訂閱到期前收到電子郵件提醒，再也不會錯過任何付款日。",
            ja: "サブスクリプションの支払期日前にメールで通知を受け取り、請求の見逃しをなくしましょう。",
            es: "Reciba notificaciones por correo electrónico antes de que venzan sus suscripciones para no tener sorpresas.",
        },
        link: {
            href: "/subscription-reminders",
            label: {
                en: "See subscription reminders",
                zh: "查看訂閱提醒說明",
                ja: "サブスクリマインダーを見る",
                es: "Ver recordatorios de suscripción",
            },
        },
    },
    {
        date: "2025-08-05",
        icon: "/subflow-dark.svg",
        size: 25,
        title: {
            en: "Subflow Public Release",
            zh: "Subflow 正式發布",
            ja: "Subflow 正式公開",
            es: "Lanzamiento público de Subflow",
        },
        content: {
            en: "We are thrilled to announce the official launch of Subflow — the simplest way to manage all your subscriptions.",
            zh: "我們非常興奮地宣布 Subflow 正式上線，這是目前最輕鬆管理所有訂閱的方式。",
            ja: "Subflow の正式公開を発表できることを大変嬉しく思います。すべてのサブスクリプションを最も簡単に管理できるサービスです。",
            es: "Nos complace anunciar el lanzamiento oficial de Subflow, la forma más sencilla de gestionar todas tus suscripciones.",
        },
    },
];
