import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

// public хавтасыг serve хийх
app.use(express.static("public"));
// uploads хавтасыг serve хийх
app.use("/uploads", express.static("uploads"));

// Зураг upload хийх endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  const filename = Date.now() + ".png";
  const filepath = path.join("uploads", filename);
  fs.renameSync(req.file.path, filepath);

  const pageUrl = `${req.protocol}://${req.get("host")}/share/${filename}`;
  res.json({ pageUrl });
});

// OG meta бүхий share page
app.get("/share/:filename", (req, res) => {
  const filename = req.params.filename;
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

  res.send(`
    <!doctype html>
    <html lang="mn">
    <head>
      <meta charset="utf-8">
      <title>Facebook Share Demo</title>
      <meta property="og:title" content="Миний гоё canvas зураг" />
      <meta property="og:description" content="Энэ бол demo зураг юм ✨" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="article" />
    </head>
    <body>
      <h1>Таны зураг</h1>
      <img src="${imageUrl}" style="max-width:100%">
    </body>
    </html>
  `);
});

// Порт (Render дээр process.env.PORT ашиглана)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
