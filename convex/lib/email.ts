/**
 * Plain-string email templates. Deliberately dependency-free so they run in the
 * default Convex runtime; swap in React Email later if the templates grow.
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const shell = (title: string, body: string) => `
<!doctype html>
<html>
  <body style="margin:0;background:#05100c;padding:32px 16px;font-family:ui-sans-serif,system-ui,sans-serif;color:#e8f2ec">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#0b1a15;border:1px solid #1e3830;border-radius:10px">
      <tr>
        <td style="padding:28px">
          <p style="margin:0 0 20px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#8fa79d">${escapeHtml(title)}</p>
          ${body}
        </td>
      </tr>
    </table>
  </body>
</html>`

export function renderContactEmail(message: { name: string; email: string; message: string }) {
  return shell(
    'New contact message',
    `
    <p style="margin:0 0 6px;font-size:18px;font-weight:600">${escapeHtml(message.name)}</p>
    <p style="margin:0 0 20px;font-size:14px;color:#8fa79d">${escapeHtml(message.email)}</p>
    <div style="white-space:pre-wrap;font-size:15px;line-height:1.6">${escapeHtml(message.message)}</div>
  `,
  )
}

/** Stub — wire this up when you add transactional email. */
export function renderWelcomeEmail(user: { name?: string }) {
  return shell(
    'Welcome aboard',
    `
    <p style="margin:0 0 12px;font-size:18px;font-weight:600">Hi ${escapeHtml(user.name ?? 'there')},</p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#8fa79d">
      Your workspace is ready. Reply to this email if anything looks off.
    </p>
  `,
  )
}
