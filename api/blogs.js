import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('./api/blogs.json');
const backupDir = path.resolve('./backups');

// Fonction pour créer une sauvegarde
const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `blogs-${timestamp}.json`);
  await fs.mkdir(backupDir, { recursive: true });
  await fs.copyFile(filePath, backupPath);
};

export default async (req, res) => {
  const { method } = req;

  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const blogs = JSON.parse(fileData);

    switch (method) {
      case 'POST': {
        const { name, description, url } = req.body;
        if (!name || !description || !url) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const newBlog = { id: Date.now(), name, description, url };
        blogs.push(newBlog);
        await fs.writeFile(filePath, JSON.stringify(blogs, null, 2));
        await createBackup(); // Sauvegarde après modification
        return res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
      }
      case 'DELETE': {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const updatedBlogs = blogs.filter(blog => blog.id !== parseInt(id));
        await fs.writeFile(filePath, JSON.stringify(updatedBlogs, null, 2));
        await createBackup(); // Sauvegarde après modification
        return res.status(200).json({ message: 'Blog deleted successfully' });
      }
      case 'PUT': {
        const { id, name, description, url } = req.body;
        if (!id || !name || !description || !url) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const index = blogs.findIndex(blog => blog.id === parseInt(id));
        if (index === -1) return res.status(404).json({ error: 'Blog not found' });
        blogs[index] = { id: parseInt(id), name, description, url };
        await fs.writeFile(filePath, JSON.stringify(blogs, null, 2));
        await createBackup(); // Sauvegarde après modification
        return res.status(200).json({ message: 'Blog updated successfully', blog: blogs[index] });
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
