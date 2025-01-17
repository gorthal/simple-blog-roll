let blogs = [];
let currentIndex = 0;

// Charger les blogs depuis le serveur
fetch("https://your-server-url/blogs")
  .then((response) => response.json())
  .then((data) => {
    blogs = data;
    if (blogs.length > 0) {
      updateBlog(0); // Affiche le premier blog
    }
  });

// Met à jour l'affichage du blog
function updateBlog(index) {
  const blog = blogs[index];
  document.getElementById("blog-name").textContent = blog.name;
  document.getElementById("blog-description").textContent = blog.description;
  document.getElementById("blog-url").href = blog.url;
}

// Boutons navigation
document.getElementById("prev-blog").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + blogs.length) % blogs.length;
  updateBlog(currentIndex);
});

document.getElementById("next-blog").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % blogs.length;
  updateBlog(currentIndex);
});

document.getElementById("random-blog").addEventListener("click", () => {
  currentIndex = Math.floor(Math.random() * blogs.length);
  updateBlog(currentIndex);
});
