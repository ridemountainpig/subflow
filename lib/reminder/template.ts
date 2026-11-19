/**
 * Payment reminder email, ported from the n8n "Send notify email" nodes.
 */

export type ReminderLanguage = "en" | "zh" | "ja" | "es";

export interface ReminderItem {
    name: string;
    amount: number;
    currency: string;
    paymentCycle: string;
    startDate: { month: number; date: number };
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const copy: Record<
    ReminderLanguage,
    {
        subject: string;
        title: string;
        greeting: string;
        intro: (count: number) => string;
        ownTitle: string;
        coTitle: string;
        dateLabel: string;
        manage: string;
        button: string;
        footer: string;
        cycle: Record<string, string>;
        chargeDate: (item: ReminderItem) => string;
    }
> = {
    en: {
        subject: "Subflow Subscription Payment Notification",
        title: "Payment Reminder Notification",
        greeting: "Hello,",
        intro: (n) =>
            `You have <strong>${n}</strong> subscriptions that will be charged tomorrow or in the coming days:`,
        ownTitle: "Your Subscriptions",
        coTitle: "Shared Subscriptions",
        dateLabel: "Charge Date: ",
        manage: "If you want to manage or view your subscription, please go to the subscription management page.",
        button: "Go to Manage Subscription",
        footer: "This email was sent automatically by Subflow. Please do not reply directly to this message.",
        cycle: { monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" },
        chargeDate: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} / ${s.startDate.date}`
                : `Day ${s.startDate.date}`,
    },
    zh: {
        subject: "Subflow 訂閱付款通知",
        title: "付款提醒通知",
        greeting: "您好，",
        intro: (n) =>
            `您共有 <strong>${n}</strong> 筆訂閱即將於明日或近日付款：`,
        ownTitle: "您的訂閱",
        coTitle: "共享訂閱",
        dateLabel: "付款日：",
        manage: "如欲管理或查看您的訂閱，請前往訂閱管理頁面。",
        button: "前往訂閱管理頁面",
        footer: "此封信件由 Subflow 自動發送，請勿直接回覆此信件。",
        cycle: { monthly: "每月", quarterly: "每季", yearly: "每年" },
        chargeDate: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 號`
                : `${s.startDate.date} 號`,
    },
    ja: {
        subject: "Subflow サブスクリプション支払い通知",
        title: "お支払いリマインダー通知",
        greeting: "こんにちは、",
        intro: (n) =>
            `<strong>${n}</strong> 件のサブスクリプションが明日または近日中に請求されます：`,
        ownTitle: "あなたのサブスクリプション",
        coTitle: "共有サブスクリプション",
        dateLabel: "請求日：",
        manage: "ご契約内容の管理や確認をご希望の場合は、購読管理ページへアクセスしてください。",
        button: "購読管理ページへ移動",
        footer: "このメールは Subflow により自動送信されています。このメールに直接返信しないでください。",
        cycle: { monthly: "毎月", quarterly: "四半期", yearly: "毎年" },
        chargeDate: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.month} 月 ${s.startDate.date} 日`
                : `${s.startDate.date} 日`,
    },
    es: {
        subject: "Notificación de Pago de Suscripción en Subflow",
        title: "Notificación de Recordatorio de Pago",
        greeting: "Hola,",
        intro: (n) =>
            `Tienes <strong>${n}</strong> suscripciones que se cobrarán mañana o en los próximos días:`,
        ownTitle: "Tus suscripciones",
        coTitle: "Suscripciones compartidas",
        dateLabel: "Fecha de cobro: ",
        manage: "Si deseas gestionar o ver tu suscripción, por favor visita la página de administración de suscripciones.",
        button: "Ir a Gestionar Suscripción",
        footer: "Este correo fue enviado automáticamente por Subflow. Por favor, no respondas directamente a este mensaje.",
        cycle: { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" },
        chargeDate: (s) =>
            s.paymentCycle === "yearly"
                ? `${s.startDate.date} / ${s.startDate.month}`
                : `Día ${s.startDate.date}`,
    },
};

const P = "color:#000;font-size:14px;line-height:24px;margin:16px 0;";

export function buildReminderEmail(
    language: ReminderLanguage,
    ownItems: ReminderItem[],
    coItems: ReminderItem[],
): { subject: string; html: string } {
    const t = copy[language] ?? copy.en;

    const renderList = (items: ReminderItem[]) =>
        items
            .map(
                (s) => `
      <li style="margin:6px 0;color:#000;font-size:14px;line-height:24px;">
        <span style="font-weight:600">${escapeHtml(s.name)}</span> -
        <strong>${s.amount} ${escapeHtml(s.currency)}</strong>
        <span style="color:#000;">｜${t.dateLabel}${t.cycle[s.paymentCycle] ?? escapeHtml(s.paymentCycle)} ${t.chargeDate(s)}</span>
      </li>`,
            )
            .join("");

    const renderSection = (title: string, items: ReminderItem[]) =>
        items.length === 0
            ? ""
            : `
        <p style="color:#000;font-size:14px;font-weight:600;margin:12px 0 4px 0;">${title}</p>
        <ul style="padding-left:20px;margin:8px 0 16px 0;">${renderList(items)}
        </ul>`;

    const html = `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #eaeaea;border-radius:0.25rem;margin:40px auto;padding:20px;max-width:465px;">
  <tbody>
    <tr>
      <td>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;">
          <tbody>
            <tr>
              <td>
                <img src="https://subflow.ing/subflow-light.png" alt="Subflow" height="50" style="display:block;margin:0 auto;border:none;outline:none;border-radius:13px;">
              </td>
            </tr>
          </tbody>
        </table>
        <h1 style="color:#000;font-size:24px;font-weight:400;text-align:center;margin:30px 0;">${t.title}</h1>
        <p style="${P}">${t.greeting}</p>
        <p style="${P}">${t.intro(ownItems.length + coItems.length)}</p>
        ${renderSection(t.ownTitle, ownItems)}
        ${renderSection(t.coTitle, coItems)}
        <p style="${P}">${t.manage}</p>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="text-align:center;margin-top:25px;margin-bottom:25px">
          <tbody>
            <tr>
              <td>
                <a href="https://subflow.ing/subscription" target="_blank" style="background-color:#27272a;border-radius:8px;color:#faf0e6;font-size:14px;font-weight:600;text-align:center;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;">
                  <span style="max-width:100%;display:inline-block;line-height:120%">${t.button}</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <hr style="border-top:1px solid #eaeaea;margin:26px 0;">
        <p style="color:#666;font-size:12px;line-height:24px;margin:16px 0;">${t.footer}</p>
      </td>
    </tr>
  </tbody>
</table>`;

    return { subject: t.subject, html };
}
