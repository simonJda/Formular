import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    await pool.query(
            `INSERT INTO messages
             (name, email, message)
             VALUES ($1, $2, $3)`,
            [name, email, message]
        );

        console.log("Neue Nachricht! ℹ️")
        res.json({ success: true, message: "Nachricht erfolgreich gesendet!" });
});

app.get("/api/getMessages", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, email, message
            FROM messages
        `);
        return res.json({ success: true, messages: result.rows });
    } catch (error) {
        console.error("DB Error: ", error);
        return res.status(500).json({ success: false, message: "DB error" });
    }
});

app.post("/api/deleteMessage", async (req, res) => {
    const { id } = req.body;

    try {
        await pool.query(`
            DELETE FROM messages
            WHERE id = $1
            `,
            [id]
        )

        console.log("Nachricht gelöscht! 🗑️")
        return res.json({ success: true, message: "Nachricht gelöscht!" });
    }
    catch (err) {
        console.log("DB Error: ", err);
        return res.status(500).json({ success: false, message: "DB error" });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));