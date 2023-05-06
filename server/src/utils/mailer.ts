import nodemailer from "nodemailer";

const transport = {
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD
  }
};
export const sendEmail = async (email: string, token: string): Promise<string> => {
  try {
    const mail = nodemailer.createTransport(transport);
    const url = `${process.env.BASE_FRONT_URL}/verify?token=${token}`;
    const mailOptions = {
      from: process.env.TRANSPORTER_EMAIL,
      to: email,
      subject: "Email verification - Events project",
      html: `<p>Вы запросили подтверждение электронной почты, пожалуйста, перейдите по этой <a href="${url}">ссылке</a> для подтверждения вашего адреса</p>`
    };

    await mail.sendMail(mailOptions);
    return `Подтверждение аккаунта было отправлено на этот адресс - ${email}. Эта ссылка будет действительно в течение 1 дня.`;
  } catch (error) {
    console.log(error);
    return "";
  }
}