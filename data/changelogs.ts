export interface ChangelogItem {
    date: string;
    icon: string;
    size?: number;
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
