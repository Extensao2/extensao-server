import Questao from "../models/Questao.js";

class QuestaoController {

  async listar(req, res) {
    try {
      const { disciplina, ano } = req.query;

      const filtro = {};
      if (disciplina) filtro.disciplina = disciplina;
      if (ano) filtro.ano = parseInt(ano);

      const questoes = await Questao.find(filtro);
      return res.json(questoes);

    } catch (err) {
      console.error('Erro ao buscar questões:', err);
      return res.status(500).json({ error: 'Erro ao buscar questões' });
    }
  }
}

export default new QuestaoController();
