const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => res.status(200).json({ message: 'Hello' }));

app.listen(port, () => `Server running on port ${port} 🔥`);
