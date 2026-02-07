import {
    getContent,
    getIcon,
    type EmailContent,
    type Language,
} from "./content";

export function generateEmail(language: Language) {
    const content = getContent(language);

    const html = `
    <div style="background-color:#27272a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:0;">
        <div style="margin:0 auto;max-width:600px;padding:20px 0;">
            <div style="background-color:#fff;margin:0 auto;border-radius:10px;max-width:600px;overflow:hidden;">
                <div style="padding:40px;letter-spacing:0.1em;font-weight:500;">
                    ${renderPreheader(content.preview)}
                    ${renderHeader()}
                    ${renderHero(content)}
                    ${renderHighlights(content.sections.highlights)}
                    ${renderBasicUsage(content.sections.basic, language)}
                    ${renderCTA(content.cta)}
                    ${renderFooter(content.footer)}
                </div>
            </div>
            <div style="text-align:center;letter-spacing:0.1em;padding:20px;color:#faf0e6;font-size:12px;">
                <p>${content.footer.copyright}</p>
            </div>
        </div>
    </div>`;

    const text = `
${content.subject}
${content.intro.replace(/<br\/>/g, "\n")}

${content.sections.highlights.title}
${content.sections.highlights.items.map((i) => `- ${i.title}: ${i.description}`).join("\n")}

${content.sections.basic.title}
${content.sections.basic.items.map((i) => `- ${i.label}: ${toPlainText(i.text)}`).join("\n")}

[ ${content.cta.text} ]( ${content.cta.url} )

${content.footer.regards}
${content.footer.team}
    `.trim();

    return { subject: content.subject, html, text };
}

function renderHeader() {
    return `
    <div style="margin-bottom:24px;text-align:left;">
        <span style="display:inline-flex;align-items:center;vertical-align:middle;">
            <img alt="Subflow Logo" src="https://subflow.ing/favicon.ico" width="42" style="border:0;border-radius:10px;display:block;outline:0;text-decoration:none;height:auto;width:42px;margin-right:12px;" />
            <span style="font-size:26px;font-weight:600;color:#333;letter-spacing:0.05em;">Subflow</span>
        </span>
    </div>
    <hr style="border:0;border-top:1px solid #eaecef;margin:0 0 30px 0;" />
    `;
}

function renderPreheader(preview: string) {
    return `<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;color:transparent;">${preview}</div>`;
}

function toPlainText(input: string): string {
    return input
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function renderHero(content: EmailContent) {
    return `
    <img alt="Subflow" src="${content.heroImage}" style="border:0;border-radius:12px;display:block;outline:0;text-decoration:none;height:auto;width:100%;margin-bottom:24px;" />
    <p style="color:#24292e;font-size:16px;line-height:1.2;">
        ${content.intro}
    </p>
    `;
}

function renderHighlights(
    highlightSection: EmailContent["sections"]["highlights"],
) {
    const itemsHtml = highlightSection.items
        .map(
            (item) => `
        <div style="margin-bottom:24px;">
            <div style="font-weight:700;margin-bottom:6px;display:flex;align-items:center;line-height:1.2;">
                <span style="display:inline-flex;align-items:center;justify-content:center;margin-right:8px;width:22px;height:22px;line-height:1;">
                    ${getIcon(item.icon, 22)}
                </span>
                <span style="font-size:18px;display:block;line-height:1.2;">
                    ${item.title}
                </span>
            </div>
            <div style="margin-bottom:6px;">
                 <img src="${item.image}" alt="${item.title}" style="width:100%;max-width:100%;height:auto;border-radius:8px;display:block;margin:12px 0;background-color:#f3f4f6;" />
            </div>
            <div style="margin-bottom:6px;">
                 ${item.description}
            </div>
            <div style="color:#27272a;background-color:rgba(250,240,230,0.5);padding:14px;border-radius:6px;font-size:14px;margin-top:12px;">
                <span>${item.usage.label}</span> ${item.usage.text}
            </div>
        </div>
    `,
        )
        .join("");

    return `
    <h3 style="color:#24292e;font-size:20px;font-weight:700;margin-top:40px;margin-bottom:28px;">
        ${highlightSection.title}
    </h3>
    <div style="margin:0;color:#24292e;font-size:16px;line-height:1.2;">
        ${itemsHtml}
    </div>
    `;
}

function renderBasicUsage(
    basicSection: EmailContent["sections"]["basic"],
    language: Language,
) {
    const separator = language === "zh" || language === "ja" ? "： " : ": ";
    const itemsHtml = basicSection.items
        .map(
            (item) => `
        <li style="margin-bottom:16px;">
            <span style="font-weight:600;">${item.label}</span>${separator}${item.text}
        </li>
    `,
        )
        .join("");

    return `
    <h3 style="color:#24292e;font-size:20px;font-weight:700;margin-top:40px;margin-bottom:28px;">
        ${basicSection.title}
    </h3>
    <img src="${basicSection.image}" alt="Subscription Page" style="width:100%;max-width:100%;height:auto;border-radius:8px;display:block;margin:18px 0;background-color:#f3f4f6;" />
    <ul style="padding-left:20px;margin:0;color:#24292e;font-size:16px;line-height:1.2;">
        ${itemsHtml}
    </ul>
    `;
}

function renderCTA(cta: EmailContent["cta"]) {
    return `
    <div style="text-align:center;margin-top:40px;margin-bottom:20px;">
        <a href="${cta.url}" style="background-color:#27272a;color:#faf0e6;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:700;font-size:16px;display:inline-block;">
            ${cta.text}
        </a>
    </div>
    `;
}

function renderFooter(footer: EmailContent["footer"]) {
    return `
    <hr style="border:0;border-top:1px solid #eaecef;margin:30px 0;" />
    <p style="color:#6b7280;font-size:13px;line-height:1.2;margin-top:16px;">
        ${footer.regards} ${footer.team}
    </p>
    `;
}
