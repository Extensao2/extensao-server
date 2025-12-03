/**
 * ARQUIVO: 01-seed-full.js
 * DESCRIÇÃO: Script de inicialização do banco de dados MongoDB.
 * FUNCIONALIDADES:
 * 1. Limpa coleções antigas.
 * 2. Cria 25 Fases divididas em 5 Grupos.
 * 3. Gera perguntas variadas (História, Ciências, Linguagens, Matemática).
 * 4. Aplica regras de negócio:
 * - Resposta correta sempre no índice 0.
 * - Perguntas rápidas (regra dos 30s).
 * - Inclusão do campo 'topic' para classificação.
 */

db = db.getSiblingDB('sistema-aprendizagem');

// 1. Limpeza das coleções para evitar duplicidade ou dados sujos
db.phases.drop();
db.questions.drop();

// 2. Definição das Fases (Estrutura do Mapa do Jogo)
const rawPhases = [
  // --- GRUPO 1: Aventura em Alto Mar ---
  { group: 1, position: 1, name: "Fase 1 - Baía Tranquila", isBossPhase: false },
  { group: 1, position: 2, name: "Fase 2 - Recifes Perigosos", isBossPhase: false },
  { group: 1, position: 3, name: "Fase 3 - Ilha Misteriosa", isBossPhase: false },
  { group: 1, position: 4, name: "Fase 4 - Tempestade no Horizonte", isBossPhase: false },
  { group: 1, position: 5, name: "Chefe - O Capitão Fantasma", isBossPhase: true },

  // --- GRUPO 2: Jornada nas Montanhas ---
  { group: 2, position: 1, name: "Fase 1 - Trilha do Eco", isBossPhase: false },
  { group: 2, position: 2, name: "Fase 2 - Pico Gelado", isBossPhase: false },
  { group: 2, position: 3, name: "Fase 3 - Vale Nebuloso", isBossPhase: false },
  { group: 2, position: 4, name: "Fase 4 - Caverna Secreta", isBossPhase: false },
  { group: 2, position: 5, name: "Chefe - Guardião da Montanha", isBossPhase: true },

  // --- GRUPO 3: Expedição na Floresta ---
  { group: 3, position: 1, name: "Fase 1 - Clareira Silenciosa", isBossPhase: false },
  { group: 3, position: 2, name: "Fase 2 - Troncos Caídos", isBossPhase: false },
  { group: 3, position: 3, name: "Fase 3 - Rio Rápido", isBossPhase: false },
  { group: 3, position: 4, name: "Fase 4 - Penhasco Oculto", isBossPhase: false },
  { group: 3, position: 5, name: "Chefe - Sábio da Floresta", isBossPhase: true },

  // --- GRUPO 4: Viagem pelo Deserto ---
  { group: 4, position: 1, name: "Fase 1 - Dunas Infinitas", isBossPhase: false },
  { group: 4, position: 2, name: "Fase 2 - Oásis Escondido", isBossPhase: false },
  { group: 4, position: 3, name: "Fase 3 - Tempestade de Areia", isBossPhase: false },
  { group: 4, position: 4, name: "Fase 4 - Ruínas Antigas", isBossPhase: false },
  { group: 4, position: 5, name: "Chefe - Faraó Esquecido", isBossPhase: true },

  // --- GRUPO 5: Mundo Subterrâneo ---
  { group: 5, position: 1, name: "Fase 1 - Túnel Escuro", isBossPhase: false },
  { group: 5, position: 2, name: "Fase 2 - Lago de Lava", isBossPhase: false },
  { group: 5, position: 3, name: "Fase 3 - Caverna Cristalina", isBossPhase: false },
  { group: 5, position: 4, name: "Fase 4 - Abismo Profundo", isBossPhase: false },
  { group: 5, position: 5, name: "Chefe - Dragão Ancião", isBossPhase: true }
];

// --- BANCO DE DADOS DE PERGUNTAS (POOLS) ---

/**
 * Estrutura dos Pools de Perguntas:
 * t: topic (Tópico da questão para exibição no front)
 * s: statement (Enunciado da pergunta)
 * c: correct (Resposta correta)
 * w: wrongs (Array com 3 respostas incorretas)
 */

const HISTORY_POOL = [
  { t: "História do Brasil", s: "Em que ano foi proclamada a Independência do Brasil?", c: "1822", w: ["1500", "1889", "1988"] },
  { t: "Revolução Francesa", s: "Qual evento marcou o início da Revolução Francesa em 1789?", c: "A Queda da Bastilha", w: ["A Morte do Rei", "A Guerra dos 100 Anos", "O Descobrimento da América"] },
  { t: "História do Brasil", s: "Quem foi o primeiro presidente do Brasil?", c: "Deodoro da Fonseca", w: ["Getúlio Vargas", "Dom Pedro II", "Juscelino Kubitschek"] },
  { t: "História Antiga", s: "Qual civilização construiu as pirâmides de Gizé?", c: "Egípcios", w: ["Romanos", "Maias", "Gregos"] },
  { t: "História Contemporânea", s: "Em que ano o homem pisou na Lua pela primeira vez?", c: "1969", w: ["1950", "2000", "1980"] },
  { t: "Geografia Histórica", s: "Qual era a capital do Brasil antes de Brasília?", c: "Rio de Janeiro", w: ["Salvador", "São Paulo", "Recife"] },
  { t: "História do Brasil", s: "Quem descobriu o Brasil em 1500?", c: "Pedro Álvares Cabral", w: ["Cristóvão Colombo", "Vasco da Gama", "Dom Pedro I"] },
  { t: "Guerras Mundiais", s: "Qual guerra ocorreu entre 1939 e 1945?", c: "Segunda Guerra Mundial", w: ["Primeira Guerra Mundial", "Guerra Fria", "Guerra do Vietnã"] },
  { t: "Renascimento", s: "Quem pintou a Mona Lisa?", c: "Leonardo da Vinci", w: ["Michelangelo", "Van Gogh", "Picasso"] },
  { t: "Curiosidades Históricas", s: "Qual país presenteou os EUA com a Estátua da Liberdade?", c: "França", w: ["Inglaterra", "Espanha", "Itália"] }
];

const SCIENCE_POOL = [
  { t: "Biologia Celular", s: "Qual é a unidade básica da vida?", c: "Célula", w: ["Átomo", "Tecido", "Órgão"] },
  { t: "Química Básica", s: "Qual gás nós respiramos para sobreviver?", c: "Oxigênio", w: ["Gás Carbônico", "Hélio", "Nitrogênio"] },
  { t: "Botânica", s: "Qual é o processo pelo qual as plantas produzem alimento?", c: "Fotossíntese", w: ["Respiração", "Digestão", "Germinação"] },
  { t: "Anatomia Humana", s: "Qual é o maior órgão do corpo humano?", c: "Pele", w: ["Fígado", "Coração", "Pulmão"] },
  { t: "Astronomia", s: "Quantos planetas existem no Sistema Solar?", c: "8", w: ["7", "9", "10"] },
  { t: "Química Básica", s: "O que significa H2O?", c: "Água", w: ["Ouro", "Sal", "Oxigênio"] },
  { t: "Biologia Celular", s: "Qual parte da célula contém o DNA?", c: "Núcleo", w: ["Membrana", "Citoplasma", "Mitocôndria"] },
  { t: "Zoologia", s: "Qual o animal terrestre mais rápido do mundo?", c: "Guepardo", w: ["Leão", "Cavalo", "Tigre"] },
  { t: "Zoologia", s: "O que as abelhas produzem?", c: "Mel", w: ["Leite", "Seda", "Algodão"] },
  { t: "Astronomia", s: "Qual é o planeta mais próximo do Sol?", c: "Mercúrio", w: ["Vênus", "Terra", "Marte"] }
];

const LANGUAGES_POOL = [
  { t: "Semântica", s: "Qual é o antônimo de 'Rápido'?", c: "Lento", w: ["Veloz", "Apressado", "Correndo"] },
  { t: "Inglês Básico", s: "Como se diz 'Cachorro' em inglês?", c: "Dog", w: ["Cat", "Bird", "Fish"] },
  { t: "Gramática", s: "Qual é o plural de 'Cidadão'?", c: "Cidadãos", w: ["Cidadões", "Cidadães", "Cidades"] },
  { t: "Inglês Básico", s: "O que significa a palavra 'Book' em português?", c: "Livro", w: ["Mesa", "Cadeira", "Caneta"] },
  { t: "Gramática", s: "Qual destas palavras é um verbo?", c: "Correr", w: ["Azul", "Casa", "Lápis"] },
  { t: "Semântica", s: "Qual é o sinônimo de 'Feliz'?", c: "Alegre", w: ["Triste", "Raiva", "Cansado"] },
  { t: "Inglês Básico", s: "Complete: 'The sky is ___' (O céu é azul).", c: "Blue", w: ["Red", "Green", "Yellow"] },
  { t: "Gramática", s: "Qual é o feminino de 'Cavalo'?", c: "Égua", w: ["Cavala", "Mula", "Burra"] },
  { t: "Gramática", s: "O que é um adjetivo?", c: "Uma qualidade", w: ["Uma ação", "Um nome", "Um lugar"] },
  { t: "Inglês Básico", s: "Como se escreve o número 10 em inglês?", c: "Ten", w: ["Two", "One", "Twenty"] }
];

// --- LÓGICA DE GERAÇÃO E UTILITÁRIOS ---

const CATEGORIES = ['MATH', 'HISTORY', 'SCIENCE', 'LANGUAGES'];

/**
 * Retorna um elemento aleatório de um array de questões-base (pool).
 * @param {Array} pool - O array de objetos contendo as questões.
 * @returns {Object} Objeto contendo {t, s, c, w}.
 */
function getRandomFromPool(pool) {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Gera proceduralmente uma questão de matemática simples.
 * Define o tópico dinamicamente baseado na operação sorteada.
 * @returns {Object} Objeto contendo {t, s, c, w}.
 */
function generateMathQuestion() {
  const operacoes = ['+', '-', 'x'];
  const op = operacoes[Math.floor(Math.random() * operacoes.length)];
  let a, b, result, topicName;

  if (op === 'x') {
    a = Math.floor(Math.random() * 9) + 2; // 2 a 10
    b = Math.floor(Math.random() * 9) + 2;
    result = a * b;
    topicName = "Multiplicação";
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a); // Garante positivo
    result = a - b;
    topicName = "Subtração";
  } else {
    a = Math.floor(Math.random() * 50);
    b = Math.floor(Math.random() * 50);
    result = a + b;
    topicName = "Adição";
  }

  return {
    t: topicName, // Tópico dinâmico
    s: `Quanto é ${a} ${op} ${b}?`,
    c: `${result}`,
    w: [`${result + 2}`, `${Math.abs(result - 3)}`, `${result + 10}`]
  };
}

const phasesToInsert = [];
const questionsToInsert = [];

/**
 * Gera as questões vinculadas a uma fase específica.
 * @param {ObjectId} phaseId - ID da fase pai.
 * @param {String} phaseName - Nome da fase para compor o título.
 * @param {Number} count - Número de questões a gerar.
 * @returns {Array} Array de objetos de Questão prontos para inserção.
 */
function generateQuestionsForPhase(phaseId, phaseName, count) {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    // Rotaciona as categorias para garantir variedade
    const categoryCode = CATEGORIES[i % CATEGORIES.length]; 
    let content;

    // Seleciona o conteúdo baseado na categoria
    switch (categoryCode) {
      case 'MATH':
        content = generateMathQuestion();
        break;
      case 'HISTORY':
        content = getRandomFromPool(HISTORY_POOL);
        break;
      case 'SCIENCE':
        content = getRandomFromPool(SCIENCE_POOL);
        break;
      case 'LANGUAGES':
        content = getRandomFromPool(LANGUAGES_POOL);
        break;
    }

    // REGRA DE NEGÓCIO: Resposta correta sempre no índice 0
    // Garante 4 alternativas (1 certa + 3 erradas)
    const optionsArray = [
      content.c,       // Index 0 (Correta)
      content.w[0],    // Index 1
      content.w[1],    // Index 2
      content.w[2]     // Index 3
    ];

    questions.push({
      _id: ObjectId(),
      phase: phaseId,
      category: categoryCode,
      topic: content.t, // Campo adicionado conforme solicitado
      
      title: `${phaseName} - Q${i + 1}`,
      statement: content.s,
      
      options: optionsArray,
      correctOptionIndex: 0, // Sempre 0
      
      // Chefes valem mais pontos
      points: phaseName.includes("Chefe") ? 25 : 10,
      
      // As últimas 3 perguntas de qualquer fase são consideradas 'hard'
      difficulty: i >= (count - 3) ? "hard" : "medium"
    });
  }
  return questions;
}

// --- EXECUÇÃO DO SCRIPT ---

rawPhases.forEach(phaseData => {
  // Gera um ID novo para a fase
  const phaseId = ObjectId();
  
  phasesToInsert.push({
    _id: phaseId,
    ...phaseData
  });

  // Regra: Boss = 15 perguntas, Normal = 10 perguntas
  const questionCount = phaseData.isBossPhase ? 15 : 10;

  const newQuestions = generateQuestionsForPhase(phaseId, phaseData.name, questionCount);
  questionsToInsert.push(...newQuestions);
});

// Inserção em massa no banco de dados
print(`Inserindo ${phasesToInsert.length} fases...`);
db.phases.insertMany(phasesToInsert);

print(`Inserindo ${questionsToInsert.length} perguntas...`);
db.questions.insertMany(questionsToInsert);

print("Seed Completo! Fases criadas e perguntas geradas com tópicos e categorias.");