const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const app = express();

// Configuration
const PORT = 3000;
const SECRET_URL = "/moderate"; // URL secrète pour modération
const db = new sqlite3.Database("blogroll.db");

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Pour servir les fichiers statiques

// Initialisation de la base de données
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);
});

// Route pour ajouter un blog
app.post("/add", (req, res) => {
  const { name, url, description } = req.body;

  if (!name || !url || !description || description.length > 250) {
    return res.status(400).json({ error: "Données invalides." });
  }

  db.run(
    "INSERT INTO blogs (name, url, description) VALUES (?, ?, ?)",
    [name, url, description],
    (err) => {
      if (err) {
        res.status(500).json({ error: "Erreur lors de l'ajout du blog." });
      } else {
        res.json({ success: true, message: "Blog ajouté avec succès !" });
      }
    }
  );
});

// Route pour récupérer tous les blogs
app.get("/blogs", (req, res) => {
  db.all("SELECT * FROM blogs", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des blogs." });
    } else {
      res.json(rows);
    }
  });
});

// Route de modération (supprimer un blog)
app.delete(`${SECRET_URL}/delete/:id`, (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM blogs WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du blog." });
    } else {
      res.json({ success: true, message: "Blog supprimé avec succès." });
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
