(async () => {
  const response = await fetch('/api/blogs');
  const blogs = await response.json();
  let currentIndex = 0;

  const nameElem = document.getElementById('blogName');
  const descElem = document.getElementById('blogDescription');
  const urlElem = document.getElementById('blogUrl');

  function updateBlog(index) {
    const blog = blogs[index];
    nameElem.textContent = blog.name;
    descElem.textContent = blog.description;
    urlElem.href = blog.url;
    urlElem.textContent = blog.url;
  }

  document.getElementById('prevBlog').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + blogs.length) % blogs.length;
    updateBlog(currentIndex);
  });

  document.getElementById('nextBlog').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % blogs.length;
    updateBlog(currentIndex);
  });

  document.getElementById('randomBlog').addEventListener('click', () => {
    currentIndex = Math.floor(Math.random() * blogs.length);
    updateBlog(currentIndex);
  });

  // Initialize with the first blog
  updateBlog(currentIndex);
})();
