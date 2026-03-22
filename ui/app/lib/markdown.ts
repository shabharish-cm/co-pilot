/**
 * Simple markdown-to-HTML renderer.
 * Supports: headings (#, ##, ###), bold (**), italic (*), inline code (`),
 * unordered lists (- / *), horizontal rules (---), and line breaks.
 * Output is sanitised to only allow basic structural tags.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  // Bold + italic: ***text***
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* (not inside bold)
  out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  // Inline code: `text`
  out = out.replace(/`([^`]+)`/g, '<code style="font-family:var(--font-space-mono);font-size:0.9em;background:#f0f0f0;padding:1px 4px;border:1px solid #ddd;">$1</code>');
  // Links: [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#000;text-decoration:underline;">$1</a>');
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;
  let inBlockquote = false;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const closeList = () => {
    if (inList) { html.push('</ul>'); inList = false; }
  };
  const closeBlockquote = () => {
    if (inBlockquote) { html.push('</blockquote>'); inBlockquote = false; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        closeList();
        closeBlockquote();
        inCodeBlock = true;
        codeLines = [];
      } else {
        inCodeBlock = false;
        const escaped = codeLines.map(l => escapeHtml(l)).join('\n');
        html.push(`<pre style="background:#f5f5f5;border:1.5px solid #ddd;padding:12px 16px;overflow-x:auto;font-family:var(--font-space-mono);font-size:12px;line-height:1.5;"><code>${escaped}</code></pre>`);
        codeLines = [];
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line)) {
      closeList();
      closeBlockquote();
      html.push('<hr style="border:none;border-top:2px solid #000;margin:20px 0;" />');
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    if (h3) {
      closeList();
      closeBlockquote();
      html.push(`<h3 style="font-family:var(--font-space-grotesk);font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;margin:20px 0 8px;border-bottom:1.5px solid #000;padding-bottom:4px;">${renderInline(h3[1])}</h3>`);
      continue;
    }
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      closeList();
      closeBlockquote();
      html.push(`<h2 style="font-family:var(--font-space-grotesk);font-weight:700;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;margin:28px 0 10px;background:#000;color:#fff;padding:6px 12px;">${renderInline(h2[1])}</h2>`);
      continue;
    }
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      closeList();
      closeBlockquote();
      html.push(`<h1 style="font-family:var(--font-space-grotesk);font-weight:700;font-size:20px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;">${renderInline(h1[1])}</h1>`);
      continue;
    }

    // Blockquote
    const bq = line.match(/^> (.+)/);
    if (bq) {
      closeList();
      if (!inBlockquote) {
        html.push('<blockquote style="border-left:3px solid #FFE500;margin:12px 0;padding:4px 14px;background:#fffde0;">');
        inBlockquote = true;
      }
      html.push(`<p style="margin:4px 0;font-family:var(--font-body);font-size:13px;">${renderInline(bq[1])}</p>`);
      continue;
    } else {
      closeBlockquote();
    }

    // Unordered list item (- or * or +)
    const li = line.match(/^[-*+] (.+)/);
    if (li) {
      if (!inList) {
        html.push('<ul style="margin:8px 0 8px 20px;padding:0;list-style:none;">');
        inList = true;
      }
      html.push(`<li style="font-family:var(--font-body);font-size:13px;line-height:1.6;margin:3px 0;padding-left:4px;"><span style="color:#000;margin-right:8px;font-weight:700;">—</span>${renderInline(li[1])}</li>`);
      continue;
    }

    // Ordered list item
    const oli = line.match(/^(\d+)\. (.+)/);
    if (oli) {
      closeList();
      closeBlockquote();
      html.push(`<p style="font-family:var(--font-body);font-size:13px;line-height:1.6;margin:4px 0;"><strong style="font-family:var(--font-space-mono);margin-right:8px;">${oli[1]}.</strong>${renderInline(oli[2])}</p>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      closeList();
      closeBlockquote();
      html.push('<br />');
      continue;
    }

    // Plain paragraph
    closeList();
    closeBlockquote();
    html.push(`<p style="font-family:var(--font-body);font-size:13px;line-height:1.7;margin:6px 0;">${renderInline(line)}</p>`);
  }

  closeList();
  closeBlockquote();
  if (inCodeBlock && codeLines.length > 0) {
    const escaped = codeLines.map(l => escapeHtml(l)).join('\n');
    html.push(`<pre style="background:#f5f5f5;border:1.5px solid #ddd;padding:12px 16px;overflow-x:auto;font-family:var(--font-space-mono);font-size:12px;line-height:1.5;"><code>${escaped}</code></pre>`);
  }

  return html.join('\n');
}
