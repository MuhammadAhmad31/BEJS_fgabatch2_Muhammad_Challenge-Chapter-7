import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "masruhanmasruhan19@gmail.com",
    pass: 'ticcvxmajyzawgor',
  }
});

const sendResetPasswordEmail = (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  return transporter.sendMail({
    from: "masruhanmasruhan19@gmail.com",
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });
};

export { sendResetPasswordEmail };