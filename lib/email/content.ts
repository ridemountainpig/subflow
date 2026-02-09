export type Language = "en" | "zh" | "ja";

export type EmailContent = {
    subject: string;
    preview: string;
    heroImage: string;
    intro: string;
    sections: {
        highlights: {
            title: string;
            items: {
                title: string;
                icon: string;
                image: string;
                description: string;
                usage: {
                    label: string;
                    text: string;
                };
            }[];
        };
        basic: {
            title: string;
            image: string;
            items: {
                label: string;
                text: string;
            }[];
        };
    };
    cta: {
        text: string;
        url: string;
    };
    footer: {
        regards: string;
        team: string;
        copyright: string;
    };
};

export function getContent(language: Language): EmailContent {
    const year = new Date().getFullYear();

    switch (language) {
        case "en":
            return {
                subject: "Welcome to Subflow!",
                preview: "Your subscription manager is ready.",
                heroImage: "https://subflow.ing/og-images/subflow-en-og.png",
                intro: "Welcome to Subflow! Your simple subscription manager is ready.<br/><br/>You can now track your expenses, organize recurring payments, and take control of your subscription life entirely for free.",
                sections: {
                    highlights: {
                        title: "Key Features & Usage:",
                        items: [
                            {
                                title: "Smart Add",
                                icon: "sparkles",
                                image: "https://subflow.ing/welcome-email/smart-add-en.png",
                                description:
                                    "Smartly analyze subscription content you upload or paste, and automatically fill in subscription details.",
                                usage: {
                                    label: "Usage:",
                                    text: `Click "Add Subscription" ${getIcon(
                                        "circle-plus",
                                    )} → Select "Smart Add" → Paste subscription info, email receipt, or description.`,
                                },
                            },
                            {
                                title: "Email Notifications",
                                icon: "mail",
                                image: "https://subflow.ing/welcome-email/email-notification-en.png",
                                description:
                                    "Remind you before subscription payments and notify you of upcoming items to pay.",
                                usage: {
                                    label: "Usage:",
                                    text: `Click "More Settings" ${getIcon(
                                        "more",
                                    )} → "Email Notifications" → Enter email and language → Save.`,
                                },
                            },
                            {
                                title: "Subscription Analytics",
                                icon: "pie-chart",
                                image: "https://subflow.ing/welcome-email/subscription-analyze-en.png",
                                description:
                                    "Visualize subscription spending ratios with charts to quickly grasp expenditure structure.",
                                usage: {
                                    label: "Usage:",
                                    text: "Click the chart button to view subscription analytics.",
                                },
                            },
                            {
                                title: "Co-Subscriber",
                                icon: "users",
                                image: "https://subflow.ing/welcome-email/co-subscriber-en.png",
                                description:
                                    "Share subscriptions with family and friends to manage subscription expenses together.",
                                usage: {
                                    label: "Usage:",
                                    text: 'Select a subscription → Go to "Co-Subscribers" → Enter email to invite.',
                                },
                            },
                        ],
                    },
                    basic: {
                        title: "Basic Usage Guide:",
                        image: "https://subflow.ing/welcome-email/subscription-page-en.png",
                        items: [
                            {
                                label: "Month Switching",
                                text: `Click the left/right arrows ${getIcon(
                                    "arrows-h",
                                )} to switch months.`,
                            },
                            {
                                label: "Add Subscription",
                                text: `Click ${getIcon(
                                    "plus",
                                )} to add a subscription. You can search or add new services.`,
                            },
                            {
                                label: "Manage Subscriptions",
                                text: "Hover over a calendar date with subscriptions to view details, edit, or delete.",
                            },
                            {
                                label: "View Analytics",
                                text: `Click ${getIcon(
                                    "pie-chart-sm",
                                )} to view subscription analytics.`,
                            },
                            {
                                label: "More Settings",
                                text: `Click ${getIcon(
                                    "more",
                                )} to view settings like email notifications.`,
                            },
                        ],
                    },
                },
                cta: {
                    text: "Go to Subscription Management",
                    url: "https://subflow.ing/subscription",
                },
                footer: {
                    regards: "Thanks for joining,",
                    team: "The Subflow Team",
                    copyright: `© ${year} Subflow. All Rights Reserved.`,
                },
            };
        case "zh":
            return {
                subject: "歡迎來到 Subflow！",
                preview: "您的訂閱管理小幫手已準備就緒。",
                heroImage: "https://subflow.ing/og-images/subflow-zh-og.png",
                intro: "歡迎使用 Subflow！您的訂閱管理小幫手已準備就緒。<br/><br/>您現在可以完全免費地追蹤開支、整理定期付款，全面掌控訂閱生活。",
                sections: {
                    highlights: {
                        title: "重點功能與使用方式：",
                        items: [
                            {
                                title: "智能新增訂閱",
                                icon: "sparkles",
                                image: "https://subflow.ing/welcome-email/smart-add-zh.png",
                                description:
                                    "智能分析您上傳或貼上的訂閱內容，並自動填入訂閱詳細資訊。",
                                usage: {
                                    label: "使用方式：",
                                    text: `點擊「新增訂閱」${getIcon(
                                        "circle-plus",
                                    )} → 選擇「智能新增」→ 貼上訂閱資訊、電子郵件收據或描述。`,
                                },
                            },
                            {
                                title: "電子郵件通知",
                                icon: "mail",
                                image: "https://subflow.ing/welcome-email/email-notification-zh.png",
                                description:
                                    "在訂閱付款前提醒您，並通知您即將要支付的項目。",
                                usage: {
                                    label: "使用方式：",
                                    text: `點擊「更多設定」${getIcon(
                                        "more",
                                    )} →「電子郵件通知」→ 輸入通知信箱 與語言 → 儲存設定。`,
                                },
                            },
                            {
                                title: "訂閱分析",
                                icon: "pie-chart",
                                image: "https://subflow.ing/welcome-email/subscription-analyze-zh.png",
                                description:
                                    "用圖表呈現訂閱花費比例，快速掌握支出結構。",
                                usage: {
                                    label: "使用方式：",
                                    text: "點擊圖表按鈕即可查看訂閱分析。",
                                },
                            },
                            {
                                title: "共享訂閱管理",
                                icon: "users",
                                image: "https://subflow.ing/welcome-email/co-subscriber-zh.png",
                                description:
                                    "與家人、朋友共享訂閱，一起管理訂閱支出。",
                                usage: {
                                    label: "使用方式：",
                                    text: "在訂閱清單點選訂閱 → 進入「共享訂閱者」→ 輸入對方電子郵件邀請。",
                                },
                            },
                        ],
                    },
                    basic: {
                        title: "基本使用說明：",
                        image: "https://subflow.ing/welcome-email/subscription-page-zh.png",
                        items: [
                            {
                                label: "月份切換",
                                text: `點擊左右箭頭 ${getIcon(
                                    "arrows-h",
                                )} 可以切換月份。`,
                            },
                            {
                                label: "新增訂閱",
                                text: `點擊 ${getIcon(
                                    "plus",
                                )} 可以新增訂閱，選擇訂閱服務時可搜尋或新增服務。`,
                            },
                            {
                                label: "管理訂閱",
                                text: "將滑鼠移到有訂閱的日曆上，即可查看訂閱項目，並編輯或刪除訂閱。",
                            },
                            {
                                label: "訂閱分析",
                                text: `點擊 ${getIcon(
                                    "pie-chart-sm",
                                )} 圖表按鈕可以查看訂閱分析。`,
                            },
                            {
                                label: "更多設定",
                                text: `點擊 ${getIcon(
                                    "more",
                                )} 可查看設定項目，例如電子郵件通知。`,
                            },
                        ],
                    },
                },
                cta: {
                    text: "前往訂閱管理",
                    url: "https://subflow.ing/subscription",
                },
                footer: {
                    regards: "感謝您的加入，",
                    team: "Subflow 團隊敬上",
                    copyright: `© ${year} Subflow. All Rights Reserved.`,
                },
            };
        case "ja":
            return {
                subject: "Subflow へようこそ！",
                preview: "サブスクリプション管理の準備が整いました。",
                heroImage: "https://subflow.ing/og-images/subflow-ja-og.png",
                intro: "Subflow へようこそ！サブスク管理ツールが準備できました。<br/><br/>支出を追跡し、定期支払いを整理し、サブスクリプションライフを完全に無料で管理できるようになりました。",
                sections: {
                    highlights: {
                        title: "主な機能と使い方：",
                        items: [
                            {
                                title: "スマート追加",
                                icon: "sparkles",
                                image: "https://subflow.ing/welcome-email/smart-add-ja.png",
                                description:
                                    "アップロードまたは貼り付けたサブスクリプション内容をスマートに分析し、詳細を自動入力します。",
                                usage: {
                                    label: "使い方：",
                                    text: `「サブスク追加」をクリック ${getIcon(
                                        "circle-plus",
                                    )} → 「スマート追加」を選択 → サブスク情報、領収書メール、または詳細を貼り付け。`,
                                },
                            },
                            {
                                title: "メール通知",
                                icon: "mail",
                                image: "https://subflow.ing/welcome-email/email-notification-ja.png",
                                description:
                                    "サブスクリプションの支払日前にリマインドし、支払い予定の項目をお知らせします。",
                                usage: {
                                    label: "使い方：",
                                    text: `「その他の設定」をクリック ${getIcon(
                                        "more",
                                    )} → 「メール通知」→ 通知先メールアドレスと言語を入力 → 保存。`,
                                },
                            },
                            {
                                title: "サブスク分析",
                                icon: "pie-chart",
                                image: "https://subflow.ing/welcome-email/subscription-analyze-ja.png",
                                description:
                                    "チャートでサブスクリプションの支出比率を可視化し、支出構造を素早く把握できます。",
                                usage: {
                                    label: "使い方：",
                                    text: "チャートボタンをクリックして分析を表示します。",
                                },
                            },
                            {
                                title: "共同サブスクリプション",
                                icon: "users",
                                image: "https://subflow.ing/welcome-email/co-subscriber-ja.png",
                                description:
                                    "家族や友人とサブスクリプションを共有し、支出を一緒に管理します。",
                                usage: {
                                    label: "使い方：",
                                    text: "サブスクリストで項目をクリック → 「共同サブスクライバー」へ → メールアドレスを入力して招待。",
                                },
                            },
                        ],
                    },
                    basic: {
                        title: "基本的な使い方：",
                        image: "https://subflow.ing/welcome-email/subscription-page-ja.png",
                        items: [
                            {
                                label: "月切り替え",
                                text: `左右の矢印 ${getIcon(
                                    "arrows-h",
                                )} をクリックして月を切り替えます。`,
                            },
                            {
                                label: "サブスク追加",
                                text: `クリック ${getIcon(
                                    "plus",
                                )} してサブスクリプションを追加します。サービスの検索や新規追加も可能です。`,
                            },
                            {
                                label: "サブスク管理",
                                text: "カレンダー上のサブスクリプションがある日付にカーソルを合わせると、詳細の確認、編集、削除ができます。",
                            },
                            {
                                label: "分析",
                                text: `チャートボタン ${getIcon(
                                    "pie-chart-sm",
                                )} をクリックして分析を表示します。`,
                            },
                            {
                                label: "その他の設定",
                                text: `クリック ${getIcon(
                                    "more",
                                )} して、メール通知などの設定を表示します。`,
                            },
                        ],
                    },
                },
                cta: {
                    text: "サブスクリプション管理へ",
                    url: "https://subflow.ing/subscription",
                },
                footer: {
                    regards: "ご利用ありがとうございます。",
                    team: "Subflow チーム",
                    copyright: `© ${year} Subflow. All Rights Reserved.`,
                },
            };
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}

export function getIconUrl(name: string): string {
    const iconMap: Record<string, string> = {
        sparkles: "sparkles",
        mail: "mail",
        "pie-chart": "pie-chart",
        users: "users",
        plus: "circle-plus",
        more: "circle-ellipsis",
        "pie-chart-sm": "pie-chart",
        "arrows-h": "arrow-left-right",
    };

    const lucideName = iconMap[name] || name;
    return `https://wsrv.nl/?url=https%3A%2F%2Funpkg.com%2Flucide-static%40latest%2Ficons%2F${lucideName}.svg&w=64&output=png`;
}

export function getIcon(name: string, size = 18): string {
    const pngUrl = getIconUrl(name);
    return `<img src="${pngUrl}" width="${size}" height="${size}" alt="${name}" style="display:inline-block;vertical-align:-4px;width:${size}px;height:${size}px;" />`;
}
