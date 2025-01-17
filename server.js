const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();

// Configuration
const PORT = 3000;
const SECRET_URL = "/moderate";
const DB_FILE = "blogroll.json";

// Initialize JSON database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ blogs: [], lastId: 0 }));
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Database operations
const readDB = () => {
  return JSON.parse(fs.readFileSync(DB_FILE));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Routes
app.post("/add", (req, res) => {
  const { name, url, description } = req.body;

  if (!name || !url || !description || description.length > 250) {
    return res.status(400).json({ error: "Données invalides." });
  }

  const db = readDB();
  const newId = db.lastId + 1;
  
  db.blogs.push({
    id: newId,
    name,
    url,
    description
  });
  
  db.lastId = newId;
  writeDB(db);

  res.json({ success: true, message: "Blog ajouté avec succès !" });
});

app.get("/blogs", (req, res) => {
  const db = readDB();
  res.json(db.blogs);
});

app.delete(`${SECRET_URL}/delete/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  
  db.blogs = db.blogs.filter(blog => blog.id !== id);
  writeDB(db);

  res.json({ success: true, message: "Blog supprimé avec succès." });
});

app.get("/moderate", (req, res) => {
  res.sendFile(__dirname + "/public/moderate.html");
});

app.put("/moderate/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url, description } = req.body;

  if (!name || !url || !description || description.length > 250) {
    return res.status(400).json({ error: "Données invalides." });
  }

  const db = readDB();
  const blogIndex = db.blogs.findIndex(blog => blog.id === id);
  
  if (blogIndex === -1) {
    return res.status(404).json({ error: "Blog non trouvé." });
  }

  db.blogs[blogIndex] = {
    id,
    name,
    url,
    description
  };

  writeDB(db);
  res.json({ success: true, message: "Blog mis à jour avec succès !" });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});