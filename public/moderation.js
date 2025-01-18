// Sélection des éléments HTML
const form = document.getElementById('addForm');
const blogsList = document.getElementById('blogsList');

// Fonction pour récupérer les blogs depuis l'API
async function fetchBlogs() {
  try {
    const response = await fetch('/api/blogs');
    if (!response.ok) throw new Error('Erreur lors de la récupération des blogs');
    const blogs = await response.json();
    displayBlogs(blogs);
  } catch (error) {
    console.error(error);
    alert('Impossible de récupérer les blogs. Vérifiez l\'API.');
  }
}

// Fonction pour afficher les blogs dans la liste
function displayBlogs(blogs) {
  blogsList.innerHTML = ''; // Vider la liste avant de l'afficher
  blogs.forEach(blog => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${blog.name}</strong> 
      <p>${blog.description}</p>
      <a href="${blog.url}" target="_blank">${blog.url}</a>
      <button class="editBtn" data-id="${blog.id}">Modifier</button>
      <button class="deleteBtn" data-id="${blog.id}">Supprimer</button>
    `;
    blogsList.appendChild(listItem);
  });

  // Ajout des gestionnaires d'événements pour les boutons Modifier/Supprimer
  document.querySelectorAll('.editBtn').forEach(btn =>
    btn.addEventListener('click', handleEditBlog)
  );
  document.querySelectorAll('.deleteBtn').forEach(btn =>
    btn.addEventListener('click', handleDeleteBlog)
  );
}

// Gestionnaire pour ajouter un blog
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const url = document.getElementById('url').value.trim();

  if (!name || !description || !url) {
    alert('Tous les champs sont requis.');
    return;
  }

  try {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, url }),
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout du blog');
    alert('Blog ajouté avec succès !');
    form.reset(); // Réinitialiser le formulaire
    fetchBlogs(); // Recharger la liste des blogs
  } catch (error) {
    console.error(error);
    alert('Impossible d\'ajouter le blog.');
  }
});

// Gestionnaire pour supprimer un blog
async function handleDeleteBlog(e) {
  const id = e.target.dataset.id;

  if (!confirm('Voulez-vous vraiment supprimer ce blog ?')) return;

  try {
    const response = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression du blog');
    alert('Blog supprimé avec succès !');
    fetchBlogs(); // Recharger la liste des blogs
  } catch (error) {
    console.error(error);
    alert('Impossible de supprimer le blog.');
  }
}

// Gestionnaire pour modifier un blog
async function handleEditBlog(e) {
  const id = e.target.dataset.id;
  const listItem = e.target.parentElement;

  const currentName = listItem.querySelector('strong').textContent;
  const currentDescription = listItem.querySelector('p').textContent;
  const currentUrl = listItem.querySelector('a').href;

  // Préparer les champs de modification
  const newName = prompt('Modifier le nom :', currentName);
  const newDescription = prompt('Modifier la description :', currentDescription);
  const newUrl = prompt('Modifier l\'URL :', currentUrl);

  if (!newName || !newDescription || !newUrl) {
    alert('Modification annulée. Tous les champs sont requis.');
    return;
  }

  try {
    const response = await fetch('/api/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newName, description: newDescription, url: newUrl }),
    });
    if (!response.ok) throw new Error('Erreur lors de la modification du blog');
    alert('Blog modifié avec succès !');
    fetchBlogs(); // Recharger la liste des blogs
  } catch (error) {
    console.error(error);
    alert('Impossible de modifier le blog.');
  }
}

// Charger les blogs au démarrage
fetchBlogs();
