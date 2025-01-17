# simple-blog-roll

un moteur de blogroll le plus simple possible à héberger et partager

## serveur en local

- npm install express sqlite3 body-parser
- node server.js

par défaut le serveur tourne sur le port 3000

## client

- dans public/index.html, la page publique du blogroll
- snippet.html : le code à ajouter dans une page, y mettre l'URL du serveur
- blogroll.js : le script appelé par le snippet sur le serveur
