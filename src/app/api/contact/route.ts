import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { nombre, email, empresa, mensaje, captchaToken } = await req.json()

  if (!nombre || !email || !mensaje || !captchaToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
  })
  const recaptchaData = await recaptchaRes.json()

  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return NextResponse.json({ error: 'bot' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
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
