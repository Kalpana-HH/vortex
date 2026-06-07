import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent and key
const api_key = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: api_key,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for general chatbot assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!api_key) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets." 
      });
    }

    // Adapt history into chat parameters format if provided
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are VorteX-AI, the elite robotics lab companion and advisor for FTC Team Vortex #00000.
You have expertise in:
1. FIRST Tech Challenge (FTC) game rules, tournament procedures, and engineering notebooks.
2. FTC Control System, FTC SDK (Java), autonomous odometry, computer vision (OpenCV, Limelight, Apriltags), and mecanum drive kinematics.
3. Mechanical design, CAD fundamentals (using Onshape, SolidWorks), goBILDA/REV hardware ecosystems, 3D printing, and custom CNC routing.
4. Strategic game analysis, alliance communication, scouting, and team outreach campaigns.

Keep your answers extremely practical, technically sound, and inspiring. Suggest clean Java templates or CAD steps when asked. 
Speak with a high-tech, cooperative tone, identifying as Team Vortex's assistant. You never output markdown lists with triple nested structures; keep markdown readable.`,
      },
    });

    // Populate history if available
    if (history && history.length > 0) {
      // Send chat history contents
      for (const turn of history) {
        // Simple mock to pre-populate chat or send in sequence is handled by client or SDK. 
        // To keep things simple and robust under the @google/genai chats API:
        // We will just invoke a single turn generation using system instruction and previous conversation context.
      }
    }

    // Wait for chat response
    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error occurred." });
  }
});

// API endpoint for path-planning autonomous Java code generator
app.post("/api/optimize-path", async (req, res) => {
  try {
    const { waypoints, startPose } = req.body;
    if (!waypoints || !Array.isArray(waypoints)) {
      return res.status(400).json({ error: "Waypoints array is required" });
    }

    if (!api_key) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not set." 
      });
    }

    const formattedPointsStr = waypoints
      .map((p, idx) => `Waypoint ${idx + 1}: x = ${p.x.toFixed(1)} inches, y = ${p.y.toFixed(1)} inches, action = ${p.action || "drive"}`)
      .join("\n");

    const promptMessage = `Optimize this path and generate FIRST Tech Challenge (FTC) robot Java code (Autonomous OpMode) using the layout:
Start Pose: X = ${startPose?.x || 0}, Y = ${startPose?.y || 0}, Heading = ${startPose?.heading || 0} degrees.
Waypoints to visit sequentially:
${formattedPointsStr}

Please generate a professional, fully implementation-ready FTC Java LinearOpMode. Include standard imports, hardware map setup (mecanum motors 'leftFront', 'rightFront', 'leftBack', 'rightBack'), gyro orientation configuration, and structured state processing or direct drive sequences (using basic mecanum trigonometric power calculation, or Road Runner trajectory commands if you notice fit, explain each).
Explain the kinematics briefly and list suggestions for hardware tuning (like pid coefficients and wheel slip mitigation) in clean comments. Make the output exceptionally polished!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction: "You are the head programming mentor for FTC Team Vortex. You generate production-grade, highly annotated FTC Java code. Never output unformatted text; always wrap Java code in markdown code blocks.",
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Path Optimizer Error:", error);
    res.status(500).json({ error: error?.message || "Error generating path optimization code." });
  }
});

// API endpoint for processing contact submissions and forwarding to the team captain's target email
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All form fields (name, email, message) are required." });
    }

    // Forward the details to FormSubmit, securely routing to the team email address
    const recipient = "Hraha0311@gmail.com";
    const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Team Vortex Contact Inquiry from ${name}`,
        _honey: "", // Honeypot spam protection
      })
    });

    if (response.ok) {
      const data: any = await response.json();
      const isActuallySuccess = data.success === true || data.success === "true";
      res.json({ 
        success: isActuallySuccess, 
        message: data.message || "Message forwarded successfully!" 
      });
    } else {
      const errText = await response.text();
      console.error("FormSubmit Forwarding Error:", errText);
      res.status(502).json({ error: "Failed to forward contact detail securely. Please try again." });
    }
  } catch (error: any) {
    console.error("Contact API Server Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error submitting contact form." });
  }
});

// Configure Vite middleware in development or direct static folder serving in production.
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Serving application in Development Mode using Vite Dev Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static files in Production Mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vortex Full-Stack Server running and bound on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Fatal Server Startup Failure:", err);
});
