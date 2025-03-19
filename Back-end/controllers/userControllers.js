const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User, UserVerification, Role, UserRole} = require("../models");

const transporter = require("../config/mailConfig");

const EMAIL_VERIFICATION_TIMEOUT = 10 * 60 * 1000;

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

async function generateTokens(user, regenerateRefreshToken = false) {
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "4h" }
    );

    let refreshToken = user.refreshToken;
    let refreshTokenExpiry = user.refreshTokenExpiry;

    if (regenerateRefreshToken || !refreshToken || new Date() > refreshTokenExpiry) {
        refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" }
        );
        refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

        await user.update({ refreshToken, refreshTokenExpiry });
    }

    return { accessToken, refreshToken, refreshTokenExpiry };
}

const sendVerificationEmail = async (user, nurseryName) => {

    const mailOptions = {
        from: `"${nurseryName} Support" <${process.env.MANAGER_EMAIL}>`,
        to: user.email,
        subject: `🔑 Verify Your Email - ${nurseryName}`,
        html: `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #2c3e50; text-align: center;">Welcome to ${nurseryName}! 🎉</h2>
                <p style="font-size: 16px; color: #555;">Hi <strong>${user.userName}</strong>,</p>
                <p style="font-size: 16px; color: #555;">Please verify your email using the code below:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 22px; font-weight: bold; color: #e74c3c; padding: 10px 20px; border: 2px dashed #e74c3c;">
                        ${user.UserVerification.emailVerificationCode}
                    </span>
                </div>
                <p style="font-size: 14px; color: #777;">This code is valid for <strong>10 minutes</strong>.</p>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #999; text-align: center;">
                    &copy; ${new Date().getFullYear()} ${nurseryName}. All rights reserved.
                </p>
            </div>`
    };
    await transporter.sendMail(mailOptions);
};
