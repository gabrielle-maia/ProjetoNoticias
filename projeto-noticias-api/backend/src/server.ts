import express from "express";
import cors from "cors";
import { db } from "./db";
import { noticias } from "./schema";
import { eq } from "drizzle-orm";

console.log("TESTE");

const app = express();

db.run(`
  CREATE TABLE IF NOT EXISTS noticias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  autor TEXT NOT NULL,
  tag TEXT NOT NULL,
  uf TEXT NOT NULL,
  publicada INTEGER NOT NULL
)
`);

app.use(cors());
app.use(express.json());

// GET - listar
app.get("/noticias", async (req, res) => {
  const result = await db.select().from(noticias);
  res.json(result);
});

// POST - criar
app.post("/noticias", async (req, res) => {
  const { titulo, conteudo, autor, tag, uf } = req.body;

  await db.insert(noticias).values({
    titulo,
    conteudo,
    autor,
    tag,
    uf,
    publicada: 0,
  });

  res.json({ message: "Notícia criada" });
});

// PUT - editar
app.put("/noticias/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, conteudo, autor, tag, uf, publicada } = req.body;

  await db
    .update(noticias)
    .set({ titulo, conteudo, autor, tag, uf, publicada })
    .where(eq(noticias.id, id));

  res.json({ message: "Atualizada" });
});

// DELETE - excluir
app.delete("/noticias/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.delete(noticias).where(eq(noticias.id, id));

  res.json({ message: "Deletada" });
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});