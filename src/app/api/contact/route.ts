import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return false

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`
  })

  const data = await res.json()
  return data.success === true
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, mensaje, captchaToken } = await req.json()

    // Validate required fields
    if (!nombre || !email || !mensaje || !captchaToken) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verify captcha
    const captchaValid = await verifyCaptcha(captchaToken)
    if (!captchaValid) {
      return NextResponse.json({ error: 'Captcha inválido' }, { status: 400 })
    }

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.sendMail({
      from: `"Casagrande Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_MAIL_TO,
      replyTo: email,
      subject: `Nuevo contacto desde la web - ${nombre}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enviando mail:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
