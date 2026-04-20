import nodemailer from 'nodemailer';

// EMAIL_TRANSPORT=internal  → PDPU internal relay (no auth, no TLS)
// EMAIL_TRANSPORT=gmail     → Gmail SMTP (default for dev)
const transporter =
  process.env.EMAIL_TRANSPORT === 'internal'
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST || '10.30.1.35',
        port: parseInt(process.env.EMAIL_PORT || '25'),
        secure: false,
        requireTLS: false,
        ignoreTLS: true,
      })
    : nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL!,
          pass: process.env.EMAIL_PASS!,
        },
      });

export default transporter;
