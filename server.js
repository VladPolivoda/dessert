const express    = require('express');
const path       = require('path');
const pool       = require('./db');
const multer     = require('multer');
const checkAuth  = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Папка для завантажень
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Статика
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JSON-парсер
app.use(express.json());

// Тестовий маршрут
app.get('/api/ping', (req, res) => {
  res.json({ message: 'PONG' });
});

// ===== POSTS CRUD =====

// GET all posts
app.get('/api/posts', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.id, p.title, p.content, p.created_at, u.email AS author
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

// GET one post + its media
app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const [[post]] = await pool.query(
    'SELECT * FROM posts WHERE id = ?',
    [postId]
  );
  const [media] = await pool.query(
    'SELECT * FROM media WHERE post_id = ?',
    [postId]
  );
  res.json({ post, media });
});

// CREATE post — лише для авторизованих
app.post('/api/posts', checkAuth, async (req, res) => {
  const { title, content } = req.body;
  // Знаходимо свій user_id за firebase_uid
  const [[userRow]] = await pool.query(
    'SELECT id FROM users WHERE firebase_uid = ?',
    [req.user.uid]
  );
  if (!userRow) {
    return res.status(404).json({ error: 'User not found' });
  }
  const [result] = await pool.query(
    'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
    [userRow.id, title, content]
  );
  res.json({ id: result.insertId });
});

// UPDATE post
app.put('/api/posts/:id', checkAuth, async (req, res) => {
  const { title, content } = req.body;
  await pool.query(
    'UPDATE posts SET title = ?, content = ? WHERE id = ?',
    [title, content, req.params.id]
  );
  res.json({ updated: true });
});

// DELETE post
app.delete('/api/posts/:id', checkAuth, async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

// ===== MEDIA CRUD =====

// UPLOAD media (image/video)
app.post(
  '/api/media',
  checkAuth,
  upload.single('file'),
  async (req, res) => {
    const { post_id, type } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const [result] = await pool.query(
      'INSERT INTO media (post_id, type, file_url) VALUES (?, ?, ?)',
      [post_id, type, fileUrl]
    );
    res.json({ id: result.insertId, fileUrl });
  }
);

// GET media for a post
app.get('/api/media/:postId', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM media WHERE post_id = ?',
    [req.params.postId]
  );
  res.json(rows);
});

// ===== COMMENTS CRUD =====

// GET comments for a post
app.get('/api/comments/:postId', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.content, c.created_at, u.email AS author
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [req.params.postId]
  );
  res.json(rows);
});

// CREATE comment — лише для авторизованих
app.post('/api/comments', checkAuth, async (req, res) => {
  const { post_id, content } = req.body;
  // Знаходимо свій user_id за firebase_uid
  const [[userRow]] = await pool.query(
    'SELECT id FROM users WHERE firebase_uid = ?',
    [req.user.uid]
  );
  if (!userRow) {
    return res.status(404).json({ error: 'User not found' });
  }
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [post_id, userRow.id, content]
  );
  res.json({ id: result.insertId });
});

// DELETE comment (опційно)
app.delete('/api/comments/:id', checkAuth, async (req, res) => {
  await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
