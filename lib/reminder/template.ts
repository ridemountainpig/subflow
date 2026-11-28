/**
 * Payment reminder email in en/zh/ja/es.
 *
 * Email clients only render a narrow subset of HTML, so this uses nested
 * tables and inline styles only (no flexbox, no <style> blocks).
 */

export type ReminderLanguage = "en" | "zh" | "ja" | "es";

export interface ReminderItem {
    name: string;
    amount: number;
    currency: string;
    paymentCycle: string;
    startDate: { month: number; date: number };
}

export interface ReminderDate {
    month: number; // 1-12
    date: number;
}

const SITE = "https://subflow.ing";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

interface Copy {
    subject: (first: string, count: number) => string;
    preheader: (count: number, total: string) => string;
    badge: string;
    heading: (count: number, date: ReminderDate) => string;
    totalLabel: string;
    ownTitle: string;
    coTitle: string;
    shareTag: string;
    cycle: Record<string, string>;
    cycleDetail: (item: ReminderItem) => string;
    button: string;
    notifyPrefix: string;
    notifyLink: string;
    footer: string;
}

const copy: Record<ReminderLanguage, Copy> = {
    en: {
        subject: (first, n) =>
            n === 1
                ? `Reminder: ${first} renews tomorrow`
                : `Reminder: ${first} and ${n - 1} more renew tomorrow`,
        preheader: (n, total) =>
            `${n} subscription${n === 1 ? "" : "s"} will be charged tomorrow, ${total} in total.`,
        badge: "Payment reminder",
        heading: (n, d) =>
            `${n} subscription${n === 1 ? "" : "s"} renew${n === 1 ? "s" : ""} tomorrow (${d.month}/${d.date})`,
        totalLabel: "Total due tomorrow",
        ownTitle: "Your subscriptions",
        coTitle: "Shared with you",
        shareTag: "Your share",
        cycle: { monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `every ${s.startDate.month}/${s.startDate.date}`
                : `on day ${s.startDate.date}`,
        button: "View my subscriptions",
        notifyPrefix: "Don't want these reminders?",
        notifyLink: "Change email notifications",
        footer: "This email was sent automatically by Subflow. Please don't reply to it.",
    },
    zh: {
        subject: (first, n) =>
            n === 1
                ? `扣款提醒：${first} 明天扣款`
                : `扣款提醒：${first} 等 ${n} 筆訂閱明天扣款`,
        preheader: (n, total) => `明天有 ${n} 筆訂閱會扣款，合計 ${total}。`,
        badge: "付款提醒",
        heading: (n, d) => `明天（${d.month}/${d.date}）有 ${n} 筆訂閱要扣款`,
        totalLabel: "明天合計",
        ownTitle: "你的訂閱",
        coTitle: "共享訂閱",
        shareTag: "你的分攤",
        cycle: { monthly: "每月", quarterly: "每季", yearly: "每年" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 號`
                : `${s.startDate.date} 號`,
        button: "查看我的訂閱",
        notifyPrefix: "不想再收到提醒？",
        notifyLink: "調整 Email 通知",
        footer: "此信件由 Subflow 自動發送，請勿直接回覆。",
    },
    ja: {
        subject: (first, n) =>
            n === 1
                ? `お支払いリマインダー：${first} は明日更新されます`
                : `お支払いリマインダー：${first} ほか ${n - 1} 件が明日更新されます`,
        preheader: (n, total) =>
            `明日 ${n} 件のサブスクリプションが請求されます（合計 ${total}）。`,
        badge: "お支払いリマインダー",
        heading: (n, d) =>
            `明日（${d.month}/${d.date}）${n} 件のサブスクリプションが請求されます`,
        totalLabel: "明日の合計",
        ownTitle: "あなたのサブスクリプション",
        coTitle: "共有サブスクリプション",
        shareTag: "あなたの負担分",
        cycle: { monthly: "毎月", quarterly: "四半期", yearly: "毎年" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 日`
                : `${s.startDate.date} 日`,
        button: "サブスクリプションを見る",
        notifyPrefix: "リマインダーが不要ですか？",
        notifyLink: "メール通知を変更",
        footer: "このメールは Subflow により自動送信されています。返信はできません。",
    },
    es: {
        subject: (first, n) =>
            n === 1
                ? `Recordatorio: ${first} se renueva mañana`
                : `Recordatorio: ${first} y ${n - 1} más se renuevan mañana`,
        preheader: (n, total) =>
            `Mañana se cobrarán ${n} suscripcion${n === 1 ? "" : "es"}, ${total} en total.`,
        badge: "Recordatorio de pago",
        heading: (n, d) =>
            `Mañana (${d.date}/${d.month}) se cobra${n === 1 ? "" : "n"} ${n} suscripcion${n === 1 ? "" : "es"}`,
        totalLabel: "Total de mañana",
        ownTitle: "Tus suscripciones",
        coTitle: "Compartidas contigo",
        shareTag: "Tu parte",
        cycle: { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `cada ${s.startDate.date}/${s.startDate.month}`
                : `el día ${s.startDate.date}`,
        button: "Ver mis suscripciones",
        notifyPrefix: "¿No quieres estos recordatorios?",
        notifyLink: "Cambiar notificaciones por email",
        footer: "Este correo fue enviado automáticamente por Subflow. No respondas a este mensaje.",
    },
};

/**
 * "NT$390", "$20", "¥1,500", "€9.99". en-US gives every currency a distinct
 * symbol (zh-TW, for example, shows TWD and USD both as "$"), so it is used
 * for all languages. Whole amounts drop the ".00".
 */
function formatMoney(amount: number, currency: string) {
    const whole = Number.isInteger(amount);
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: whole ? 0 : undefined,
        }).format(amount);
    } catch {
        // Unknown currency code: fall back to "1,234.5 XYZ".
        return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
    }
}

/** Sum per currency, e.g. "NT$1,280 + $15.99". */
function formatTotal(items: ReminderItem[]) {
    const sums = new Map<string, number>();
    for (const item of items) {
        sums.set(item.currency, (sums.get(item.currency) ?? 0) + item.amount);
    }
    return [...sums]
        .map(([currency, sum]) => formatMoney(sum, currency))
        .join(" + ");
}

const AVATAR_COLORS = [
    "#6366f1",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#8b5cf6",
    "#14b8a6",
];

function avatarColor(name: string) {
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const FONT =
    "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Noto Sans TC','Hiragino Sans',Roboto,Helvetica,Arial,sans-serif";

export function buildReminderEmail(
    language: ReminderLanguage,
    ownItems: ReminderItem[],
    coItems: ReminderItem[],
    chargeDate: ReminderDate,
): { subject: string; html: string } {
    const lang = copy[language] ? language : "en";
    const t = copy[lang];
    const all = [...ownItems, ...coItems];
    const count = all.length;
    const total = formatTotal(all);

    const renderRow = (s: ReminderItem, shared: boolean, last: boolean) => {
        const initial = escapeHtml(Array.from(s.name.trim())[0] ?? "?");
        const cycle = t.cycle[s.paymentCycle] ?? escapeHtml(s.paymentCycle);
        const tag = shared
            ? `<span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:4px;background:#eef2ff;color:#4f46e5;font-size:11px;line-height:16px;vertical-align:1px;">${t.shareTag}</span>`
            : "";
        return `
            <tr>
              <td style="padding:14px 0;${last ? "" : "border-bottom:1px solid #f0f0f2;"}">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="40" valign="middle" style="width:40px;">
                      <div style="width:36px;height:36px;border-radius:10px;background:${avatarColor(s.name)};color:#ffffff;font-size:16px;font-weight:700;line-height:36px;text-align:center;">${initial}</div>
                    </td>
                    <td valign="middle" style="padding-left:12px;">
                      <div style="font-size:15px;font-weight:600;color:#18181b;line-height:20px;">${escapeHtml(s.name)}${tag}</div>
                      <div style="font-size:13px;color:#71717a;line-height:18px;margin-top:2px;">${cycle} · ${t.cycleDetail(s)}</div>
                    </td>
                    <td valign="middle" align="right" style="font-size:15px;font-weight:700;color:#18181b;white-space:nowrap;">${escapeHtml(formatMoney(s.amount, s.currency))}</td>
                  </tr>
                </table>
              </td>
            </tr>`;
    };

    const renderSection = (
        title: string,
        items: ReminderItem[],
        shared: boolean,
    ) =>
        items.length === 0
            ? ""
            : `
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <div style="font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#a1a1aa;">${title}</div>
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">${items
                .map((s, i) => renderRow(s, shared, i === items.length - 1))
                .join("")}
            </table>
          </td>
        </tr>`;

    const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(t.badge)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:${FONT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(t.preheader(count, total))}</div>
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f5;">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;">
        <tr>
          <td style="padding:28px 32px 0 32px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td valign="middle"><img src="${SITE}/subflow-light.png" alt="Subflow" height="36" style="display:block;border:0;outline:none;border-radius:9px;"></td>
                <td valign="middle" align="right"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;">${t.badge}</span></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0 32px;">
            <h1 style="margin:0;font-size:22px;line-height:30px;font-weight:700;color:#18181b;">${escapeHtml(t.heading(count, chargeDate))}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 0 32px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fafafa;border:1px solid #f0f0f2;border-radius:12px;">
              <tr>
                <td style="padding:14px 18px;font-size:13px;color:#71717a;">${t.totalLabel}</td>
                <td align="right" style="padding:14px 18px;font-size:20px;font-weight:700;color:#18181b;">${escapeHtml(total)}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${renderSection(t.ownTitle, ownItems, false)}
        ${renderSection(t.coTitle, coItems, true)}
        <tr>
          <td align="center" style="padding:24px 32px 28px 32px;">
            <a href="${SITE}/subscription" target="_blank" style="display:inline-block;background:#18181b;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:10px;">${t.button}</a>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">
        <tr>
          <td align="center" style="padding:20px 24px 0 24px;font-size:12px;line-height:20px;color:#a1a1aa;">
            ${t.notifyPrefix} <a href="${SITE}/subscription?menu=email-notify" target="_blank" style="color:#71717a;text-decoration:underline;">${t.notifyLink}</a><br>
            ${t.footer}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

    return {
        subject: t.subject(ownItems[0]?.name ?? coItems[0]?.name ?? "", count),
        html,
    };
}
