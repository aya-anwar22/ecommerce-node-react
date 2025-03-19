const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User, UserVerification, Role, UserRole} = require("../models/sql");

const transporter = require("../config/mailConfig");
const EMAIL_VERIFICATION_TIMEOUT = 10 * 60 * 1000;
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

async function generateTokens(user, regenerateRefreshToken = false) {
    const accessToken = jwt.sign(
        {userId: user.id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "10h"}
    );

    let refreshToken = user.refreshToken;
    let refreshTokenExpiry = user.refreshTokenExpiry;
    if(regenerateRefreshToken || !refreshToken || new Date() > refreshTokenExpiry){
        refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" }
        );
        refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        await user.update({ refreshToken, refreshTokenExpiry });
    }
    return {accessToken, refreshToken, refreshTokenExpiry}
    
};



const sendVerificationEmail = async (user, nurseryName) => {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: user.email,
        subject: "verfication",
        html: user.UserVerification.emailVerificationCode

    };
    await transporter.sendMail(mailOptions);
};




exports.register = asyncHandler(async (req, res) => {
    const { userName,email, password, confirmPassword, phoneNumber} = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ where: { email }, include: UserVerification });

    if (existingUser) {
        // Check if UserVerification exists
        if (existingUser.UserVerification) {
            // Check if the user verification exists and isVerified is true
            if (existingUser.UserVerification.isVerified) {
                return res.status(409).json({ message: "User already exists and is verified" });
            } else {
                const newCode = generateCode();
                await existingUser.UserVerification.update({
                    emailVerificationCode: newCode,
                    verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
                });

                // Ensure UserVerification exists before calling sendVerificationEmail
                if (existingUser.UserVerification.emailVerificationCode) {
                    await sendVerificationEmail(existingUser); // Ensure this is correctly handled
                    return res.status(200).json({ message: "Verification code resent. Please verify your email." });
                } else {
                    return res.status(400).json({ message: "Error: Verification code not found" });
                }
            }
        } else {
            // If UserVerification does not exist, create it
            const newCode = generateCode();
            const verification = await UserVerification.create({
                userId: existingUser.id,
                emailVerificationCode: newCode,
                verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
            });

            // Ensure UserVerification exists before calling sendVerificationEmail
            if (verification.emailVerificationCode) {
                await sendVerificationEmail(existingUser); // Ensure this is correctly handled
                return res.status(200).json({ message: "Verification code sent. Please verify your email." });
            } else {
                return res.status(400).json({ message: "Error: Verification code not found" });
            }
        }
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        let role = 'user'; 
        
        if (email === process.env.ADMIN_EMAIL) {
            role = 'admin';
        } 

        const newUser = await User.create({ 
            userName, email, password: hashedPassword,phoneNumber
        });

        const roleRecord = await Role.findOne({ where: { role } });

        await newUser.addRole(roleRecord);

        const verificationCode = generateCode();
        await UserVerification.create({
            userId: newUser.id,
            emailVerificationCode: verificationCode,
            verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
        });

        const userWithVerification = await User.findOne({
            where: { id: newUser.id },
            include: UserVerification,
        });

        if (userWithVerification.UserVerification) {
            await sendVerificationEmail(userWithVerification); // Ensure this is correctly handled
            return res.status(201).json({ message: "User registered successfully. Please verify your email." });
        } else {
            return res.status(400).json({ message: "Error: Verification code not found" });
        }
    }
});




exports.verifyEmail = asyncHandler(async (req, res) => {
    const { email, emailVerificationCode } = req.body;

    if (!email || !emailVerificationCode) {
        return res.status(400).json({ message: "Please provide email and emailVerificationCode" });
    }

    const user = await User.findOne({ where: { email }, include: UserVerification });

    if (!user || !user.UserVerification) {
        return res.status(404).json({ message: "User not found" });
    }

    if (
        !user.UserVerification.emailVerificationCode ||
        user.UserVerification.emailVerificationCode !== emailVerificationCode ||
        new Date() > user.UserVerification.verificationCodeExpiry
    ) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    await user.UserVerification.update({
        isVerified: true,
        emailVerificationCode: null,
        verificationCodeExpiry: null,
    });

    return res.status(200).json({ message: "Email verified successfully" });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ where: { email }, include: UserVerification });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    if (!user.UserVerification.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
    }

    const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(user, true);

    return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        refreshTokenExpiry,
    });
});




exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }

    let userVerification = await UserVerification.findOne({ where: { userId: user.id } });

    if (!userVerification) {
        userVerification = await UserVerification.create({
            userId: user.id,
            resetCode: generateCode(),
            resetCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
        });
    } else {
        userVerification.resetCode = generateCode();
        userVerification.resetCodeExpiry = new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT);
        await userVerification.save();
    }

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: user.email,
        subject: `Password Reset Request - `,
        html: `<p>Use this code to reset your password: <strong>${userVerification.resetCode}</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    return res.status(201).json({ message: "Password reset code sent. Please check your email." });
});


exports.resetPassword = asyncHandler(async (req, res) => {
    const { resetCode, newPassword, email } = req.body;

    if (!resetCode || !newPassword || !email) {
        return res.status(400).json({ message: "Please provide resetCode, newPassword, and email." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userVerification = await UserVerification.findOne({ where: { userId: user.id } });
    if (!userVerification) {
        return res.status(400).json({ message: "Invalid or expired reset code." });
    }

    if (!userVerification.resetCode || userVerification.resetCode !== resetCode || new Date() > userVerification.resetCodeExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset code." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    userVerification.resetCode = null;
    userVerification.resetCodeExpiry = null;
    await userVerification.save();

    return res.status(201).json({ message: "Password reset successful. You can now log in with your new password." });
});



exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({
            accessToken,
            refreshTokenExpiry: user.refreshTokenExpiry
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token", error: error.message });
    }
});

exports.logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' });
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({ message: 'You have been logged out successfully' });
});