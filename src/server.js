import express from 'express';
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const jsonServerRouter = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Usar fileURLToPath para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(middlewares);
app.use('/api', jsonServerRouter);

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || "3001";

app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}/api/tasks`);
});