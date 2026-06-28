// import "dotenv/config";
// import cors from "cors";
// import multer from "multer";
// import express from "express";
// import jwt from "jsonwebtoken";
// import passport from "passport";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";
// import session from "express-session";
// import LocalStrategy from "passport-local";
// import { User } from "./src/Models/UserModel.js";
// import { jwtAuthMiddleware, generateToken } from "./jwt.js";
// import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// // 🛠️ FIX 1: Safe ES-Module bypass for pdf-parse package wrapper
// import pdf from "pdf-parse/lib/pdf-parse.js";

// const PORT = 3001;
// const app = express();

// const appName = process.env.APP_GMAIL;
// const jwtSecret = process.env.JWT_SECRET;
// const mongodbUrl = process.env.MONGODBURL;
// const frontendUrl = process.env.FRONTENDURL;
// const dashboadUrl = process.env.DASHBOARD_URL;
// const password = process.env.APP_GMAIL_PASSWORD;

// const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_BOT_API });

// // Configured exclusively for direct memory stream uploads
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 50 * 1024 * 1024 } // Set boundary ceiling to 50MB
// });

// // --- TRANSPORTER ---
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: appName,
//         pass: password,
//     },
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.log("SMTP ERROR:", error);
//     } else {
//         console.log("SMTP SERVER READY ✅");
//     }
// });

// // --- PARSING MIDDLEWARES ---
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // --- CORS & SESSION CONFIGURATION ---
// app.use(cors({
//     origin: [frontendUrl, dashboadUrl],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"]
// }));

// const sessionOptions = {
//     secret: "mysupersecret",
//     resave: false,
//     saveUninitialized: false,
//     proxy: true,
//     cookie: {
//         secure: true,
//         sameSite: "none",
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000
//     }
// };

// app.use(session(sessionOptions));

// // --- PASSPORT INITIALIZATION ---
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // --- ROUTES ---

// app.post('/login', (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (!user) return res.status(401).json({ message: "Invalid username or password" });

//         if (!user.isVerified) {
//             return res.status(403).json({ message: "Please verify your email before login." });
//         }

//         const payload = {
//             id: user.id,
//             username: user.username
//         };

//         const token = generateToken(payload);

//         return res.json({
//             message: "Logged in successfully",
//             token: token,
//             user: { id: user.id, username: user.username }
//         });
//     })(req, res, next);
// });

// app.post("/signup", async (req, res) => {
//     try {
//         console.log(req.body);
//         const { username, email, password } = req.body;

//         const userNameExist = await User.findOne({ username: username });
//         if (userNameExist) {
//             return res.status(421).json({ message: "Username already Exist", userNameExist });
//         }

//         const userEmailExist = await User.findOne({ email: email });
//         if (userEmailExist) {
//             return res.status(422).json({ message: "Email already registered", userEmailExist });
//         }

//         const userData = new User({ username, email });
//         const registeredUser = await User.register(userData, password);

//         const emailToken = jwt.sign(
//             { id: registeredUser._id },
//             jwtSecret,
//             { expiresIn: '15m' }
//         );

//         const verificationUrl = `${frontendUrl}/verify-email?token=${emailToken}`;

//         const mailOptions = {
//             // FIX: Formatted with your specified sender email and a professional display name
//             from: `"${appName}" <airesumeproteam@gmail.com>`,
//             to: email,
//             // TIP: Kept the subject clear and direct to satisfy strict anti-spam filters
//             subject: "Welcome to AI Resume Pro! Verify your email",

//             // FIX: Crucial plain-text fallback string dropped your overall spam score significantly
//             text: `Hello ${username},\n\nThank you for creating an account with AI Resume Pro. To complete your registration and secure your profile, please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nFor security purposes, this verification link will expire in 15 minutes. If you did not create this account, you can safely ignore this email.`,

//             // OPTIMIZED HTML: Converted from floating divs to standard bulletproof table structures
//             html: `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Verify Your Email</title>
//     </head>
//     <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
//         <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 550px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
//             <tr>
//                 <td style="padding: 32px 24px;">

//                     <!-- Header / Brand -->
//                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
//                         <tr>
//                             <td>
//                                 <span style="font-size: 16px; font-weight: 600; letter-spacing: -0.01em; color: #111827;">AI RESUME PRO</span>
//                             </td>
//                         </tr>
//                     </table>

//                     <!-- Body Content -->
//                     <div style="font-size: 14px; line-height: 1.6; color: #374151;">
//                         <p style="margin-top: 0; margin-bottom: 16px; font-weight: 500; color: #111827;">
//                             Hello ${username},
//                         </p>
//                         <p style="margin-top: 0; margin-bottom: 24px;">
//                             Thank you for creating an account with AI Resume Pro. To complete your registration and secure your profile, please verify your email address by clicking the button below:
//                         </p>

//                         <!-- CTA Button Container (Keeps button intact across modern inbox layouts) -->
//                         <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
//                             <tr>
//                                 <td align="center" bgcolor="#111827" style="border-radius: 6px;">
//                                     <a href="${verificationUrl}" target="_blank" style="font-size: 13px; font-family: sans-serif; font-weight: 500; color: #ffffff; text-decoration: none; padding: 10px 20px; border: 1px solid #111827; border-radius: 6px; display: inline-block;">
//                                         Verify Email Address
//                                     </a>
//                                 </td>
//                             </tr>
//                         </table>

//                         <p style="margin-top: 0; margin-bottom: 0; font-size: 12px; color: #6b7280;">
//                             For security purposes, this verification link will expire in <strong>15 minutes</strong>. If you did not create this account, you can safely ignore this email.
//                         </p>
//                     </div>

//                     <!-- Divider -->
//                     <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;" />

//                     <!-- Footer Security Note -->
//                     <div style="font-size: 12px; line-height: 1.5; color: #9ca3af;">
//                         <p style="margin: 0 0 8px 0;">
//                             Button not working? Copy and paste this URL into your browser instead:
//                         </p>
//                         <p style="margin: 0 0 16px 0; word-break: break-all; color: #2563eb;">
//                             ${verificationUrl}
//                         </p>
//                         <p style="margin: 0; font-size: 11px;">AI Resume Pro • India</p>
//                     </div>

//                 </td>
//             </tr>
//         </table>
//     </body>
//     </html>
//     `,
//         };

//         console.log(mailOptions);
//         await transporter.sendMail(mailOptions);

//         return res.status(200).json({ message: "Registration successful! Verification email sent." });
//     } catch (error) {
//         console.error("Signup Route Error:", error);
//         return res.status(500).json({ error: "Something went wrong during signup." });
//     }
// });

// app.get("/api/verify-email", async (req, res) => {
//     const { token } = req.query;
//     try {
//         console.log(req.query);
//         const decode = jwt.verify(token, jwtSecret);
//         await User.findByIdAndUpdate(decode.id, { isVerified: true });
//         return res.status(200).json({ message: "Email verification successful!" });
//     } catch (error) {
//         console.error("Verification Route Error:", error);
//         return res.status(400).json({ error: "Invalid or expired verification link token." });
//     }
// });

// app.post('/api/forgot-password', async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

//         if (!user) {
//             return res.status(404).json({ success: false, message: "Unable to find that email." });
//         }

//         const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '15m' });
//         const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

//         const mailOptions = {
//             // FIX: Must include a valid sender email address tied to your domain
//             from: `"${appName}" <airesumeproteam@gmail.com>`,
//             to: email,
//             subject: "AI Resume Pro - Reset Your Password",

//             // FIX: Providing a plain text fallback heavily drops your spam filter score
//             text: `Hello ${user.username},\n\nWe received a request to reset the password for your AI Resume Pro account. Click the link below to configure your new credentials:\n\n${resetUrl}\n\nThis recovery link expires in 15 minutes. If you did not initiate this request, you can safely ignore this email.`,

//             // OPTIMIZED HTML: Swapped root div for a layout table for perfect filter parsing
//             html: `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Reset Your Password</title>
//     </head>
//     <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
//         <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 550px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
//             <tr>
//                 <td style="padding: 32px 24px;">

//                     <!-- Header / Brand -->
//                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
//                         <tr>
//                             <td>
//                                 <span style="font-size: 16px; font-weight: 600; letter-spacing: -0.01em; color: #111827;">AI RESUME PRO</span>
//                             </td>
//                         </tr>
//                     </table>

//                     <!-- Body Content -->
//                     <div style="font-size: 14px; line-height: 1.6; color: #374151;">
//                         <p style="margin-top: 0; margin-bottom: 16px; font-weight: 500; color: #111827;">
//                             Hello ${user.username},
//                         </p>
//                         <p style="margin-top: 0; margin-bottom: 24px;">
//                             We received a request to reset the password for your AI Resume Pro account. Click the button below to configure your new credentials:
//                         </p>

//                         <!-- CTA Button (Using bulletproof table container) -->
//                         <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
//                             <tr>
//                                 <td align="center" bgcolor="#111827" style="border-radius: 6px;">
//                                     <a href="${resetUrl}" target="_blank" style="font-size: 13px; font-family: sans-serif; font-weight: 500; color: #ffffff; text-decoration: none; padding: 10px 20px; border: 1px solid #111827; border-radius: 6px; display: inline-block;">
//                                         Reset Password
//                                     </a>
//                                 </td>
//                             </tr>
//                         </table>

//                         <p style="margin-top: 0; margin-bottom: 0; font-size: 12px; color: #6b7280;">
//                             This recovery link expires in <strong>15 minutes</strong>. If you did not initiate this request, you can safely ignore this email and your password will remain unchanged.
//                         </p>
//                     </div>

//                     <!-- Divider -->
//                     <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;" />

//                     <!-- Footer Security Note -->
//                     <div style="font-size: 12px; line-height: 1.5; color: #9ca3af;">
//                         <p style="margin: 0 0 8px 0;">
//                             If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:
//                         </p>
//                         <p style="margin: 0 0 16px 0; word-break: break-all; color: #2563eb;">
//                             ${resetUrl}
//                         </p>
//                         <p style="margin: 0; font-size: 11px;">AI Resume Pro • India</p>
//                     </div>

//                 </td>
//             </tr>
//         </table>
//     </body>
//     </html>
//     `,
//         };

//         console.log(mailOptions);
//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ success: true, message: "Recovery email dispatched successfully!" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to send email" });
//     }
// });

// app.post("/api/reset-password", async (req, res) => {
//     const { token, newPassword } = req.body;
//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         const user = await User.findById(decoded.id);

//         if (!user) return res.status(404).json({ message: "User not found" });

//         await user.setPassword(newPassword);
//         await user.save();

//         res.status(200).json({ message: "Password updated successfully!" });
//     } catch (err) {
//         res.status(400).json({ message: "Link expired or invalid." });
//     }
// });

// // --- TEXT PARSING ROUTE ---
// // 1. Move the delay utility helper to the global scope (top of your file)
// const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// app.post("/getText", upload.single("pdfFile"), async (req, res) => {
//     try {
//         // 1. Structural Validation Guard
//         if (!req.file) {
//             return res.status(400).json({ error: "No file object detected." });
//         }

//         console.log(`Processing file stream memory chunk: ${req.file.originalname}`);

//         // 2. Clear out document buffer layout
//         const parsedData = await pdf(req.file.buffer);
//         const resumeText = parsedData.text ? parsedData.text.trim() : String(parsedData).trim();

//         if (!resumeText) {
//             return res.status(400).json({ error: "Unable to extract text layers from this PDF document." });
//         }

//         let cleanJsonData = null;
//         let retries = 3;

//         // 3. Execution Retry Loop
//         while (retries > 0) {
//             try {
//                 const response = await ai.models.generateContent({
//                     model: "gemini-2.5-flash",
//                     contents: [{
//                         role: "user",
//                         parts: [{
//                             text: `Perform a strict ATS compatibility analysis and quality critique on the following resume text. 
// Calculate metrics, isolate matching/missing technical keywords, call out layout flaws, and assemble contextual actionable wins.

// <resume_text>
// ${resumeText}
// </resume_text>`
//                         }]
//                     }],
//                     generationConfig: {
//                         systemInstruction: systemInstruction,
//                         responseMimeType: "application/json",
//                         responseSchema: resumeAnalysisSchema,
//                         temperature: 0.0, // Drop variability completely for reliable data returns
//                         maxOutputTokens: 4096,
//                     },
//                 });

//                 // Structured output allows clean JSON execution with zero regex cleaning
//                 cleanJsonData = JSON.parse(response.text);
//                 break;

//             } catch (error) {
//                 retries--;
//                 if ((error.status === 503 || error.status === 429) && retries > 0) {
//                     console.warn(`⚠️ Engine busy/throttled. Autoretrying context in 4s... (${retries} left)`);
//                     await wait(4000);
//                 } else {
//                     console.error("Extraction Engine Fault:", error);
//                     return res.status(503).json({
//                         error: "The AI analysis server is currently crowded with high traffic. Please try uploading again in a few moments."
//                     });
//                 }
//             }
//         }

//         // 4. Send clean object context directly to map to frontend requirements
//         if (cleanJsonData) {
//             return res.json(cleanJsonData);
//         } else {
//             return res.status(500).json({ error: "Parsing strategy collapsed unexpectedly." });
//         }

//     } catch (err) {
//         console.error("PDF Parsing Runtime Failure:", err);
//         return res.status(500).json({
//             error: "Failed to compile document mapping structure: " + err.message
//         });
//     }
// });

// async function main() {
//     await mongoose.connect(mongodbUrl);
// }

// main()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server listening on port: ${PORT} `);
//             console.log("Connection built Successfully ✅");
//         });
//     })
//     .catch((err) => {
//         console.error("Database Connection Error ❌", err);
//     });

import "dotenv/config";
import cors from "cors";
import Groq from "groq-sdk";
import multer from "multer";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import session from "express-session";
import LocalStrategy from "passport-local";
import { storage } from "./cloudinary.js";
import { GoogleGenAI } from "@google/genai";
import { User } from "./src/Models/UserModel.js";
import { JobData } from "./src/Models/JobModel.js";
import { jwtAuthMiddleware, generateToken } from "./jwt.js";

// 🛠️ Safe ES-Module bypass for pdf-parse package wrapper
import pdf from "pdf-parse/lib/pdf-parse.js";

const PORT = 3001;
const app = express();

const appName = process.env.APP_GMAIL;
const jwtSecret = process.env.JWT_SECRET;
const mongodbUrl = process.env.MONGODBURL;
const frontendUrl = process.env.FRONTENDURL;
const dashboadUrl = process.env.DASHBOARD_URL;
const password = process.env.APP_GMAIL_PASSWORD;

// Instantiate the Gemini SDK client
const groqAi = new Groq({ apiKey: process.env.GROQ_API });
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_BOT_API });

// Global helper for backoff delays
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Explicit declaration of the AI system instruction to prevent reference errors
const systemInstruction = `You are an expert, highly objective ATS (Applicant Tracking System) extraction engine and structural analyst. 
Your goal is to perform a rigorous analysis of the given resume text layer against industry technical engineering standards.
You must output a highly granular assessment matching the exact structural JSON schema requested. Do not extrapolate data points.`;

// Configured exclusively for direct memory stream uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Set boundary ceiling to 50MB
});

const logoUpload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Set boundary ceiling to 50MB
});


// --- TRANSPORTER ---
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: appName,
        pass: password,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP SERVER READY ✅");
    }
});

// --- PARSING MIDDLEWARES ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- CORS & SESSION CONFIGURATION ---
app.use(cors({
    origin: [frontendUrl, dashboadUrl],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));

// --- PASSPORT INITIALIZATION ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Complete Uncompressed Schema Definition mapping cleanly to uncompressed UI keys
const resumeAnalysisSchema = {
    "atsScore": 84,
    "atsBreakdown": {
        "formatStructure": 92,
        "keywordDensity": 79,
        "experienceImpact": 88,
        "coreTechSkills": 76
    },
    "keywords": {
        "matched": [
            "Product strategy",
            "Agile leadership",
            "Roadmap planning",
            "User research",
            "OKRs",
            "Stakeholder sync",
            "Data storytelling",
            "MVP delivery"
        ],
        "gaps": [
            "SQL analytics",
            "A/B testing",
            "Productboard",
            "GTM launch"
        ]
    },
    "structuralInsights": [
        {
            "type": "positive",
            "title": "Clean ATS layout",
            "description": "No columns, standard fonts — perfect for parsing."
        },
        {
            "type": "warning",
            "title": "Missing LinkedIn & GitHub",
            "description": "Recruiters expect contact enrichment."
        },
        {
            "type": "positive",
            "title": "Strong quantifiable achievements",
            "description": "+34% engagement, $2M pipeline examples."
        }
    ],
    "candidateProfile": {
        "name": "Emily Rodriguez",
        "title": "Senior Product Manager",
        "experience": "8 yrs",
        "atsReadiness": "84% · Excellent",
        "keywordMatchRate": "18/22 core terms",
        "formattingScore": "92%",
        "experienceLevel": "Senior+"
    },
    "quickWins": [
        {
            "id": 1,
            "title": "Add SQL & data analytics keywords",
            "description": "Include \"SQL queries\" and \"A/B test framework\" to pass technical filters.",
            "priority": "high"
        },
        {
            "id": 2,
            "title": "Insert 2 more metrics per role",
            "description": "Recruiters love numbers: show % increase in retention or velocity.",
            "priority": "medium"
        },
        {
            "id": 3,
            "title": "Optimize professional summary",
            "description": "Add role-specific terms like \"cross-functional roadmap owner\".",
            "priority": "high"
        }
    ],
    "aiSummary": "Data-driven Product Manager with 8+ years in B2B SaaS. Expert in end-to-end product lifecycle, user-centric design, and scaling features from 0 to 1. Boosted NPS by 22% and reduced churn by 14% through strategic roadmap initiatives. Passionate about using analytics to drive product decisions."
}

// --- ROUTES ---

app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ message: "Invalid username or password" });

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before login." });
        }

        const payload = {
            id: user.id,
            username: user.username
        };

        const token = generateToken(payload);

        return res.json({
            message: "Logged in successfully",
            token: token,
            user: { id: user.id, username: user.username }
        });
    })(req, res, next);
});

app.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password } = req.body;

        const userNameExist = await User.findOne({ username: username });
        if (userNameExist) {
            return res.status(421).json({ message: "Username already Exist", userNameExist });
        }

        const userEmailExist = await User.findOne({ email: email });
        if (userEmailExist) {
            return res.status(422).json({ message: "Email already registered", userEmailExist });
        }

        const userData = new User({ username, email });
        const registeredUser = await User.register(userData, password);

        const emailToken = jwt.sign(
            { id: registeredUser._id },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const verificationUrl = `${frontendUrl}/verify-email?token=${emailToken}`;

        const mailOptions = {
            from: `"${appName}" <airesumeproteam@gmail.com>`,
            to: email,
            subject: "Welcome to AI Resume Pro! Verify your email",
            text: `Hello ${username},\n\nThank you for creating an account with AI Resume Pro. To complete your registration and secure your profile, please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nFor security purposes, this verification link will expire in 15 minutes. If you did not create this account, you can safely ignore this email.`,
            html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 550px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
            <tr>
                <td style="padding: 32px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                            <td>
                                <span style="font-size: 16px; font-weight: 600; letter-spacing: -0.01em; color: #111827;">AI RESUME PRO</span>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                        <p style="margin-top: 0; margin-bottom: 16px; font-weight: 500; color: #111827;">
                            Hello ${username},
                        </p>
                        <p style="margin-top: 0; margin-bottom: 24px;">
                            Thank you for creating an account with AI Resume Pro. To complete your registration and secure your profile, please verify your email address by clicking the button below:
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                            <tr>
                                <td align="center" bgcolor="#111827" style="border-radius: 6px;">
                                    <a href="${verificationUrl}" target="_blank" style="font-size: 13px; font-family: sans-serif; font-weight: 500; color: #ffffff; text-decoration: none; padding: 10px 20px; border: 1px solid #111827; border-radius: 6px; display: inline-block;">
                                        Verify Email Address
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="margin-top: 0; margin-bottom: 0; font-size: 12px; color: #6b7280;">
                            For security purposes, this verification link will expire in <strong>15 minutes</strong>. If you did not create this account, you can safely ignore this email.
                        </p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;" />
                    <div style="font-size: 12px; line-height: 1.5; color: #9ca3af;">
                        <p style="margin: 0 0 8px 0;">
                            Button not working? Copy and paste this URL into your browser instead:
                        </p>
                        <p style="margin: 0 0 16px 0; word-break: break-all; color: #2563eb;">
                            ${verificationUrl}
                        </p>
                        <p style="margin: 0; font-size: 11px;">AI Resume Pro • India</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
        };

        console.log(mailOptions);
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Registration successful! Verification email sent." });
    } catch (error) {
        console.error("Signup Route Error:", error);
        return res.status(500).json({ error: "Something went wrong during signup." });
    }
});

app.get("/api/verify-email", async (req, res) => {
    const { token } = req.query;
    try {
        console.log(req.query);
        const decode = jwt.verify(token, jwtSecret);
        await User.findByIdAndUpdate(decode.id, { isVerified: true });
        return res.status(200).json({ message: "Email verification successful!" });
    } catch (error) {
        console.error("Verification Route Error:", error);
        return res.status(400).json({ error: "Invalid or expired verification link token." });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Unable to find that email." });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '15m' });
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"${appName}" <airesumeproteam@gmail.com>`,
            to: email,
            subject: "AI Resume Pro - Reset Your Password",
            text: `Hello ${user.username},\n\nWe received a request to reset the password for your AI Resume Pro account. Click the link below to configure your new credentials:\n\n${resetUrl}\n\nThis recovery link expires in 15 minutes. If you did not initiate this request, you can safely ignore this email.`,
            html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 550px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
            <tr>
                <td style="padding: 32px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                            <td>
                                <span style="font-size: 16px; font-weight: 600; letter-spacing: -0.01em; color: #111827;">AI RESUME PRO</span>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                        <p style="margin-top: 0; margin-bottom: 16px; font-weight: 500; color: #111827;">
                            Hello ${user.username},
                        </p>
                        <p style="margin-top: 0; margin-bottom: 24px;">
                            We received a request to reset the password for your AI Resume Pro account. Click the button below to configure your new credentials:
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                            <tr>
                                <td align="center" bgcolor="#111827" style="border-radius: 6px;">
                                    <a href="${resetUrl}" target="_blank" style="font-size: 13px; font-family: sans-serif; font-weight: 500; color: #ffffff; text-decoration: none; padding: 10px 20px; border: 1px solid #111827; border-radius: 6px; display: inline-block;">
                                        Reset Password
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="margin-top: 0; margin-bottom: 0; font-size: 12px; color: #6b7280;">
                            This recovery link expires in <strong>15 minutes</strong>. If you did not initiate this request, you can safely ignore this email and your password will remain unchanged.
                        </p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;" />
                    <div style="font-size: 12px; line-height: 1.5; color: #9ca3af;">
                        <p style="margin: 0 0 8px 0;">
                            If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:
                        </p>
                        <p style="margin: 0 0 16px 0; word-break: break-all; color: #2563eb;">
                            ${resetUrl}
                        </p>
                        <p style="margin: 0; font-size: 11px;">AI Resume Pro • India</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
        };

        console.log(mailOptions);
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Recovery email dispatched successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        await user.setPassword(newPassword);
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Link expired or invalid." });
    }
});

// --- TEXT PARSING ROUTE ---
app.post("/getText", upload.single("pdfFile"), async (req, res) => {
    try {
        const jobRole = req.body.jobRole && req.body.jobRole.trim() !== ""
            ? req.body.jobRole
            : null;

        console.log("Sanitized Job Role:", jobRole);
        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No file object detected." });
        }

        console.log(`Processing file: ${req.file.originalname}`);

        const parsedData = await pdf(req.file.buffer);
        const resumeText = parsedData.text ? parsedData.text.trim() : String(parsedData).trim();

        if (!resumeText) {
            return res.status(400).json({ error: "Unable to extract text from this PDF document." });
        }

        let cleanJsonData = null;
        let retries = 3;

        while (retries > 0) {
            try {
                const response = await groqAi.chat.completions.create({
                    // FIXED THE CRASHING MODEL ID STRINGS HERE:
                    model: "openai/gpt-oss-120b",
                    messages: [
                        {
                            role: "user",
                            content: `You are an ATS resume analyzer your work is to check whether the resume content is good for the selected ${jobRole} job and give score respectively. Return ONLY valid JSON. No markdown formatting, no extra explanations.
Mostly you give same ats score for all type of pdf content correct it on your own
Return feedback by replacing the JSON content with the real feedback structure and give the correct/strict ats score not give different different score 
when user upload it again and again without updated it yes you can give different different ats score when user update its resume:
-Strict Rule: if the content not as per the selected job role than give the feedback and ats score less than expected.
{
    "atsScore": '',
    "atsBreakdown": {
        "formatStructure": '',
        "keywordDensity": '',
        "experienceImpact": '',
        "coreTechSkills": ''
    },
    "keywords": {
        "matched": ["", ""],
        "gaps": ["", ""]
    },
    "structuralInsights": [
        {"type": "positive", "title": "", "description": "No columns, standard fonts."}
    ],
    "candidateProfile": {
        "name": "",
        "title": "",
        "experience": "",
        "atsReadiness": "84%",
        "keywordMatchRate": "18/22",
        "formattingScore": "92%",
        "experienceLevel": "Senior"
    },
    "quickWins": [
        {"id": 1, "title": "Add SQL keywords", "description": "Include SQL queries", "priority": "high"}
    ],
    "aiSummary": "Professional summary here"
}

Analyze this resume:
${resumeText}`
                        }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.1,
                    max_completion_tokens: 4096
                });

                const responseText = response.choices[0]?.message?.content || "";
                console.log("Response preview:", responseText.substring(0, 100));

                cleanJsonData = extractJSON(responseText);
                break;

            } catch (error) {
                retries--;
                console.error(`Attempt failed. ${retries} retries left.`, error.message);
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    return res.status(503).json({
                        error: "AI service unavailable. Please try again."
                    });
                }
            }
        }

        if (cleanJsonData) {
            console.log("Successfully compiled parsed results.");
            return res.json(cleanJsonData);
        } else {
            return res.status(500).json({ error: "Failed to generate analysis." });
        }

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to process document: " + err.message });
    }
});

app.post("/loggedUser", async (req, res) => {
    try {
        const { Id } = req.body;
        const user = await User.findById({ _id: Id });
        res.status(200).json({ message: "User Data ", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something occurs " })
    }
})

app.post("/sumbitJobData", logoUpload.single("companyLogo"), async (req, res) => {
    try {
        const logoFile = req.file.path;
        const { links, skills, benefits,
            location, job_title, department, applyLink,
            expiry_date, responsibilities, companyName,
            health_insurance } = req.body;

        const newJob = await JobData({
            links: links, skills: skills, benefits: benefits,
            location: location, job_title: job_title, department: department, applyLink: allpyLink,
            expiryDate: expiry_date, responsibilities: responsibilities, healthInsurance: health_insurance,
            companyName: companyName, companyLogo: logoFile
        }).save();

        console.log(newJob);
        res.status(200).json({ message: "Job Added Successfully", newJob });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some error occured " });
    }
});

app.get("/alljobs", async (req, res) => {
    try {
        const allJobs = await JobData.find({});
        console.log(allJobs);
        res.status(200).json({ message: "All Jobs data received", allJobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some Internal error", error});
    }
})
































// --- DATABASE CONNECTION & ASYNC INITIALIZATION ---
async function main() {
    await mongoose.connect(mongodbUrl);
}

main()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
            console.log("Connection built Successfully ✅");
        });
    })
    .catch((err) => {
        console.error("Database Connection Error ❌", err);
    });

// Simple JSON extractor
function extractJSON(text) {
    // Remove markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Find JSON
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;

    if (start === -1 || end === 0) {
        throw new Error('No JSON found');
    }

    const jsonString = text.substring(start, end);
    return JSON.parse(jsonString);
}
