import mongoose from "mongoose";

const QuestaoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  enunciado: { type: String, required: true },
  alternativas: [{ type: String }],
  respostaCorreta: { type: String, required: true },
  ano: { type: Number, required: true },
  area: { type: String, required: true }
});

export default mongoose.model("Questao", QuestaoSchema,"questoes");
