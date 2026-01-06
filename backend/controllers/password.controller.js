import crypto from "crypto";
import Users from "../database/models/user.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find the user
    const user = await Users.findOne({ where: { email } });

    // 2. Security: Don't reveal if a user exists or not
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    // 3. Generate a temporary secret "key" (token)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Hashing the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Save the hashed token and set it to expire in 30 minutes
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins in milliseconds
    await user.save();

    // 6. Create the Reset URL

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls:{
        rejectUnauthorized: false
      }
    });

    // 8. Send the Email
    await transporter.sendMail({
      from: `"Job Board Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to proceed:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link expires in 30 minutes.</p>`,
    });

    res.status(200).json({
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Reset Request Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    //  Hash the token received from the URL to match the one in our DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find a user who has this token AND ensure the token hasn't expired
    const user = await Users.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired.",
      });
    }

    // Hashing the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset fields so the token can't be used again
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save new password
    await user.save();

    // Send confirmation mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls:{
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"Job Board Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Security Alert: Password Changed",
      html: `
        <h3>Your password has been changed</h3>
        <p>This is a confirmation that the password for your account <b>${user.email}</b> has just been changed.</p>
        <p>If you did <b>not</b> make this change, please contact our support team immediately to secure your account.</p>
      `,
    });
    return res
      .status(200)
      .json({ message: "Password has been successfully updated!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
