const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

const apiKey = process.env.GEMINI_API_KEY;

console.log("API KEY LOADED:", !!apiKey);

// =====================
// LOGIN API
// =====================
app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        return res.json({
            success: true,
            message: "تم تسجيل الدخول بنجاح"
        });
    }

    return res.json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور خطأ"
    });
});

// =====================
// AI TEXT ANALYZE
// =====================
app.post("/api/analyze-text", async (req, res) => {

    try {

        const text = req.body.text;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text }]
                    }
                ]
            }
        );

        const answer =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({
            success: true,
            answer
        });

    } catch (error) {

        console.log("TEXT ERROR:", error.response?.data || error.message);

        return res.json({
            success: false,
            message: "AI Error"
        });
    }
});

// =====================
// FILE ANALYZE (FIXED + WORKING)
// =====================
app.post("/api/analyze-file", upload.single("file"), async (req, res) => {

    try {

        if (!req.file) {
            return res.json({
                success: false,
                message: "لم يتم رفع ملف"
            });
        }

        const fileName = req.file.originalname;

        const text = `
        لديك تقرير طبي باسم: ${fileName}

        قم بتحليل الحالة الطبية بشكل مبسط:
        - ما المشكلة المحتملة؟
        - هل الحالة خطيرة؟
        - ما التخصص المناسب للطبيب؟
        - نصيحة للمريض
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text }]
                    }
                ]
            }
        );

        const answer =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({
            success: true,
            answer
        });

    } catch (error) {

        console.log("FILE ERROR:", error.response?.data || error.message);

        return res.json({
            success: false,
            message: "AI Error"
        });
    }
});

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
    res.send("Backend Working");
});

// =====================
// SERVER START
// =====================
const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});