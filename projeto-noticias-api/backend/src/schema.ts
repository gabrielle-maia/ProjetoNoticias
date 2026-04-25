import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const noticias = sqliteTable("noticias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  conteudo: text("conteudo").notNull(),
  autor: text("autor").notNull(),
  tag: text("tag").notNull(),
  uf: text("uf").notNull(),
  publicada: integer("publicada").notNull(),
});


export {};

