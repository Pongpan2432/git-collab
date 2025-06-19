import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuid } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

// ดึง __dirname (แก้ไข: เพิ่ม underscore)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// path ไปยังโฟลเดอร์ Front-end (อยู่ข้างนอก)
const frontEndPath = path.join(__dirname, "../Front-end");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontEndPath)); // ✅ เสิร์ฟไฟล์ static จาก Front-end/

// เสิร์ฟ main.html เมื่อเข้า root
app.get("/", (req, res) => {
  res.sendFile(path.join(frontEndPath, "main.html"));
});

// ----------------- CRUD API ------------------
let slides = [
  { id: uuid(), src: "imgs/image1.png", caption: "Sky 1" },
  { id: uuid(), src: "imgs/image2.jpg", caption: "Sky 2" },
  { id: uuid(), src: "imgs/image3.png", caption: "Sky 3" },
  { id: uuid(), src: "imgs/image4.jpg", caption: "Sky 4" },
  { id: uuid(), src: "imgs/image5.jpg", caption: "Sky 5" },
];

// GET - ดึงทุก slides
app.get("/api/slides", (req, res) => {
  res.json(slides);
});

// GET - ดึง slide เดียวตาม ID
app.get("/api/slides/:id", (req, res) => {
  const slide = slides.find(s => s.id === req.params.id);
  slide ? res.json(slide) : res.status(404).json({ error: "Not found" });
});

// POST - เพิ่ม slide ใหม่
app.post("/api/slides", (req, res) => {
  const { src, caption } = req.body;
  if (!src) return res.status(400).json({ error: "`src` is required" });
  
  const newSlide = { id: uuid(), src, caption: caption ?? "" };
  slides.push(newSlide);
  res.status(201).json(newSlide);
});

// PUT - อัปเดต slide
app.put("/api/slides/:id", (req, res) => {
  const idx = slides.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  
  const { src, caption } = req.body;
  if (src !== undefined) slides[idx].src = src;
  if (caption !== undefined) slides[idx].caption = caption;
  
  res.json(slides[idx]);
});

// DELETE - ลบ slide
app.delete("/api/slides/:id", (req, res) => {
  const idx = slides.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  
  const removed = slides.splice(idx, 1)[0];
  res.json(removed);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌤 Server running at http://localhost:${PORT}`);
});