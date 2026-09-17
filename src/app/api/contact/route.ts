import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export async function POST(req: NextRequest) {
  const { nombre, email, empresa, mensaje, captchaToken } = await req.json()

  if (!nombre || !email || !mensaje || (process.env.RECAPTCHA_SECRET_KEY && !captchaToken)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (process.env.RECAPTCHA_SECRET_KEY) {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    })
    const recaptchaData = await recaptchaRes.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({ error: 'bot' }, { status: 400 })
    }
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')

  console.log('[contact] GMAIL_USER:', user)
  console.log('[contact] GMAIL_APP_PASSWORD length:', pass?.length)

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://casagrandeing.com').replace(/\/$/, '')

  const safeNombre = escapeHtml(nombre)
  const safeEmail = escapeHtml(email)
  const safeEmpresa = empresa ? escapeHtml(empresa) : '—'
  const safeMensaje = escapeHtml(mensaje).replace(/\n/g, '<br/>')

  await transporter.sendMail({
    from: `"Casagrande Ingeniería" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nuevo contacto: ${nombre}`,
    text: `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || '-'}\n\n${mensaje}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
        <head><meta charset="UTF-8" /></head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;">

                  <!-- Header con logo -->
                  <tr>
                    <td align="center" style="background:#131313;padding:32px 40px;">
                      <img src="${siteUrl}/logo-556-x-556.png" alt="Casagrande Ingeniería" width="80" height="80" style="display:block;" />
                      <p style="margin:12px 0 0;color:#ffffff;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;">Casagrande Ingeniería</p>
                    </td>
                  </tr>

                  <!-- Título -->
                  <tr>
                    <td style="padding:32px 40px 8px;">
                      <h2 style="margin:0;font-size:20px;color:#131313;font-weight:600;">Nuevo mensaje de contacto</h2>
                    </td>
                  </tr>

                  <!-- Datos -->
                  <tr>
                    <td style="padding:16px 40px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                            <span style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.08em;">Nombre</span><br/>
                            <span style="font-size:15px;color:#131313;">${safeNombre}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                            <span style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.08em;">Email</span><br/>
                            <a href="mailto:${safeEmail}" style="font-size:15px;color:#131313;text-decoration:none;">${safeEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                            <span style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.08em;">Empresa</span><br/>
                            <span style="font-size:15px;color:#131313;">${safeEmpresa}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;">
                            <span style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.08em;">Mensaje</span><br/>
                            <p style="margin:8px 0 0;font-size:15px;color:#131313;line-height:1.6;">${safeMensaje}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background:#f5f5f5;padding:20px 40px;">
                      <p style="margin:0;font-size:11px;color:#aaaaaa;">casagrandeing.com</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })

  return NextResponse.json({ ok: true })
}
