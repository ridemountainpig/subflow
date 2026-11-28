/**
 * Payment reminder email in en/zh/ja/es.
 *
 * Email clients only render a narrow subset of HTML, so this uses nested
 * tables and inline styles only (no flexbox, no <style> blocks).
 */

export type ReminderLanguage = "en" | "zh" | "ja" | "es";

export interface ReminderItem {
    /** Set when the subscription uses one of the built-in services. */
    serviceId?: string;
    /** True when that service has a logo at /api/email-icon/[serviceId]. */
    hasLogo?: boolean;
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

// The apex domain redirects to www; images should not depend on a redirect.
const SITE = "https://www.subflow.ing";

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
    eyebrow: (date: ReminderDate) => string;
    countLine: (count: number) => string;
    totalLabel: string;
    ownTitle: string;
    coTitle: string;
    shareTag: string;
    cycle: Record<string, string>;
    cycleDetail: (item: ReminderItem) => string;
    button: string;
    /** Why the reader got this email. */
    reason: string;
    notifyLink: string;
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
        eyebrow: (d) => `Due tomorrow · ${d.month}/${d.date}`,
        countLine: (n) => `${n} subscription${n === 1 ? "" : "s"}`,
        totalLabel: "Total",
        ownTitle: "Your subscriptions",
        coTitle: "Shared with you",
        shareTag: "Your share",
        cycle: { monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `every ${s.startDate.month}/${s.startDate.date}`
                : `on day ${s.startDate.date}`,
        button: "View my subscriptions",
        reason: "You're getting this because payment reminders are turned on in Subflow.",
        notifyLink: "Manage notifications",
    },
    zh: {
        subject: (first, n) =>
            n === 1
                ? `扣款提醒：${first} 明天扣款`
                : `扣款提醒：${first} 等 ${n} 筆訂閱明天扣款`,
        preheader: (n, total) => `明天有 ${n} 筆訂閱會扣款，合計 ${total}。`,
        badge: "付款提醒",
        eyebrow: (d) => `明天扣款 · ${d.month}/${d.date}`,
        countLine: (n) => `共 ${n} 筆訂閱`,
        totalLabel: "合計",
        ownTitle: "你的訂閱",
        coTitle: "共享訂閱",
        shareTag: "你的分攤",
        cycle: { monthly: "每月", quarterly: "每季", yearly: "每年" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 號`
                : `${s.startDate.date} 號`,
        button: "查看我的訂閱",
        reason: "你收到這封信，是因為你在 Subflow 開啟了付款提醒。",
        notifyLink: "管理通知設定",
    },
    ja: {
        subject: (first, n) =>
            n === 1
                ? `お支払いリマインダー：${first} は明日更新されます`
                : `お支払いリマインダー：${first} ほか ${n - 1} 件が明日更新されます`,
        preheader: (n, total) =>
            `明日 ${n} 件のサブスクリプションが請求されます（合計 ${total}）。`,
        badge: "お支払いリマインダー",
        eyebrow: (d) => `明日のお支払い · ${d.month}/${d.date}`,
        countLine: (n) => `${n} 件のサブスクリプション`,
        totalLabel: "合計",
        ownTitle: "あなたのサブスクリプション",
        coTitle: "共有サブスクリプション",
        shareTag: "あなたの負担分",
        cycle: { monthly: "毎月", quarterly: "四半期", yearly: "毎年" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 日`
                : `${s.startDate.date} 日`,
        button: "サブスクリプションを見る",
        reason: "Subflow で支払いリマインダーをオンにしているため、このメールをお送りしています。",
        notifyLink: "通知設定を管理",
    },
    es: {
        subject: (first, n) =>
            n === 1
                ? `Recordatorio: ${first} se renueva mañana`
                : `Recordatorio: ${first} y ${n - 1} más se renuevan mañana`,
        preheader: (n, total) =>
            `Mañana se cobrarán ${n} suscripcion${n === 1 ? "" : "es"}, ${total} en total.`,
        badge: "Recordatorio de pago",
        eyebrow: (d) => `Se cobra mañana · ${d.date}/${d.month}`,
        countLine: (n) => `${n} suscripcion${n === 1 ? "" : "es"}`,
        totalLabel: "Total",
        ownTitle: "Tus suscripciones",
        coTitle: "Compartidas contigo",
        shareTag: "Tu parte",
        cycle: { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" },
        cycleDetail: (s) =>
            s.paymentCycle === "yearly"
                ? `cada ${s.startDate.date}/${s.startDate.month}`
                : `el día ${s.startDate.date}`,
        button: "Ver mis suscripciones",
        reason: "Recibes este correo porque activaste los recordatorios de pago en Subflow.",
        notifyLink: "Gestionar notificaciones",
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

// Same tile as the calendar on the subscription page: a dark square with a
// light border, holding the service logo or the name's first letter.
function renderIconTile(s: ReminderItem) {
    const initial = escapeHtml(
        (Array.from(s.name.trim())[0] ?? "?").toUpperCase(),
    );
    const inner =
        s.hasLogo && s.serviceId
            ? `<img src="${SITE}/api/email-icon/${encodeURIComponent(s.serviceId)}" width="20" height="20" alt="${initial}" style="display:block;width:20px;height:20px;margin:6px auto;border:0;outline:none;text-decoration:none;color:#faf0e6;font-size:14px;font-weight:700;line-height:20px;text-align:center;">`
            : initial;
    return `<div style="width:32px;height:32px;border:2px solid #e5dcd3;border-radius:10px;background:#27272a;color:#faf0e6;font-size:15px;font-weight:700;line-height:32px;text-align:center;">${inner}</div>`;
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
    const chargeYear = new Date().getUTCFullYear();

    const renderRow = (s: ReminderItem, shared: boolean) => {
        const cycle = t.cycle[s.paymentCycle] ?? escapeHtml(s.paymentCycle);
        const meta = [cycle, t.cycleDetail(s), ...(shared ? [t.shareTag] : [])];
        return `
            <tr>
              <td width="44" valign="middle" style="width:44px;padding:12px 0;">${renderIconTile(s)}</td>
              <td valign="middle" style="padding:12px 0 12px 12px;">
                <div style="font-size:15px;font-weight:600;color:#27272a;line-height:20px;">${escapeHtml(s.name)}</div>
                <div style="font-size:13px;color:#918c88;line-height:18px;margin-top:2px;">${meta.join(" · ")}</div>
              </td>
              <td valign="middle" align="right" style="padding:12px 0;font-size:15px;font-weight:600;color:#27272a;white-space:nowrap;">${escapeHtml(formatMoney(s.amount, s.currency))}</td>
            </tr>`;
    };

    const renderSection = (
        title: string,
        items: ReminderItem[],
        shared: boolean,
        first: boolean,
    ) =>
        items.length === 0
            ? ""
            : `
            <tr>
              <td colspan="3" style="padding:${first ? "0" : "16px"} 0 4px 0;font-size:12px;font-weight:600;letter-spacing:0.04em;color:#918c88;">${title}</td>
            </tr>${items.map((s) => renderRow(s, shared)).join("")}`;

    const hr = `<tr><td style="padding:0 36px;"><div style="height:1px;line-height:1px;font-size:0;background:#efe7de;">&nbsp;</div></td></tr>`;

    const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(t.badge)}</title>
</head>
<body style="margin:0;padding:0;background:#f5efe8;font-family:${FONT};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(t.preheader(count, total))}</div>
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5efe8;">
  <tr>
    <td align="center" style="padding:40px 12px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">
        <tr>
          <td style="padding:0 4px 20px 4px;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td valign="middle"><img src="${SITE}/subflow-light.png" alt="" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;"></td>
                <td valign="middle" style="padding-left:8px;font-size:17px;font-weight:700;letter-spacing:0.08em;color:#27272a;">Subflow</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;background:#ffffff;border:1px solid #ebe2d8;border-radius:16px;">
        <tr>
          <td style="padding:36px 36px 28px 36px;">
            <div style="font-size:14px;font-weight:600;color:#918c88;">${escapeHtml(t.eyebrow(chargeDate))}</div>
            <div style="margin-top:8px;font-size:36px;line-height:42px;font-weight:700;letter-spacing:-0.01em;color:#27272a;">${escapeHtml(total)}</div>
            <div style="margin-top:6px;font-size:15px;color:#666362;">${escapeHtml(t.countLine(count))}</div>
          </td>
        </tr>
        ${hr}
        <tr>
          <td style="padding:24px 36px 8px 36px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">${renderSection(t.ownTitle, ownItems, false, true)}${renderSection(t.coTitle, coItems, true, ownItems.length === 0)}
            </table>
          </td>
        </tr>
        ${hr}
        <tr>
          <td style="padding:16px 36px 0 36px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="font-size:15px;font-weight:600;color:#27272a;">${t.totalLabel}</td>
                <td align="right" style="font-size:15px;font-weight:700;color:#27272a;white-space:nowrap;">${escapeHtml(total)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 36px 36px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="background:#27272a;border-radius:10px;">
                  <a href="${SITE}/subscription" target="_blank" style="display:block;padding:14px 20px;color:#faf0e6;font-size:15px;font-weight:600;text-decoration:none;">${t.button}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">
        <tr>
          <td align="center" style="padding:28px 24px 0 24px;">
            <div style="font-size:12px;line-height:18px;color:#918c88;">${t.reason}</div>
            <div style="margin-top:12px;font-size:12px;line-height:18px;">
              <a href="${SITE}/subscription?menu=email-notify" target="_blank" style="color:#514f50;font-weight:600;text-decoration:none;">${t.notifyLink}</a>
              <span style="color:#d0c8c0;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <a href="${SITE}" target="_blank" style="color:#514f50;font-weight:600;text-decoration:none;">subflow.ing</a>
            </div>
            <div style="margin-top:12px;font-size:11px;line-height:16px;color:#bbb4ae;">&copy; ${chargeYear} Subflow</div>
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
