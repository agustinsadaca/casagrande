import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

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

  await transporter.sendMail({
    from: `"${nombre}" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nuevo contacto: ${nombre}`,
    text: `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || '-'}\n\n${mensaje}`,
  })

  return NextResponse.json({ ok: true })
}
