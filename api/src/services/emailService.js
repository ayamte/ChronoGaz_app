const nodemailer = require('nodemailer');  
  
const transporter = nodemailer.createTransport({  // CORRIGÉ: createTransport au lieu de createTransporter  
  host: process.env.SMTP_HOST || 'smtp.gmail.com',  
  port: process.env.SMTP_PORT || 587,  
  secure: false,  
  auth: {  
    user: process.env.SMTP_USER,  
    pass: process.env.SMTP_PASS  
  }  
});  
  
const sendPasswordResetEmail = async (email, resetToken) => {  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;  
    
  const mailOptions = {  
    from: process.env.SMTP_USER,  
    to: email,  
    subject: 'ChronoGaz - Réinitialisation de mot de passe',  
    html: `  
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">  
        <h2 style="color: #1f55a3;">Réinitialisation de votre mot de passe</h2>  
        <p>Vous avez demandé la réinitialisation de votre mot de passe ChronoGaz.</p>  
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>  
        <a href="${resetUrl}" style="background-color: #1f55a3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">  
          Réinitialiser mon mot de passe  
        </a>  
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>  
        <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>  
      </div>  
    `  
  };  
  
  await transporter.sendMail(mailOptions);  
};  
  
module.exports = { sendPasswordResetEmail };