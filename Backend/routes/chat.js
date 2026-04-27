import express from "express";
import "dotenv/config";
import cors from "cors";
import Thread from "../models/Thread.js";
import { getGeminiResponse } from "../utils/gemini.js"; // ✅ Fixed: now matches named export

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread"
        });

        await thread.save();
        res.json(thread);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in DB" });
    }
});


router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});


router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId }); // ✅ Fixed: was missing query object

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" }); // ✅ Added return
        }

        res.json(thread.messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => { // ✅ Fixed typo in route param: theradId → threadId
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread could not be deleted" }); // ✅ Added return
        }
        res.status(200).json({ success: "Thread deleted" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.substring(0, 30), // Fixed typo: substring
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const history = thread.messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        history.pop();

        const assistantReply = await getGeminiResponse(message, history);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        
        res.json({ reply: assistantReply });

    } catch (err) {
        console.error("FULL ERROR LOG:", err); // Look at your terminal for this!
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;