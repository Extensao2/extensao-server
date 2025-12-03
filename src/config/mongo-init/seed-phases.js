db = db.getSiblingDB('sistema-aprendizagem');

// 1. Limpeza das coleções
db.phases.drop();
db.questions.drop();

// 2. Definição das Fases (Estrutura do Mapa)
const rawPhases = [
  // GRUPO 1
  { group: 1, position: 1, name: "Fase 1 - Baía Tranquila", isBossPhase: false },
  { group: 1, position: 2, name: "Fase 2 - Recifes Perigosos", isBossPhase: false },
  { group: 1, position: 3, name: "Fase 3 - Ilha Misteriosa", isBossPhase: false },
  { group: 1, position: 4, name: "Fase 4 - Tempestade no Horizonte", isBossPhase: false },
  { group: 1, position: 5, name: "Chefe - O Capitão Fantasma", isBossPhase: true },

  // GRUPO 2
  { group: 2, position: 1, name: "Fase 1 - Trilha do Eco", isBossPhase: false },
  { group: 2, position: 2, name: "Fase 2 - Pico Gelado", isBossPhase: false },
  { group: 2, position: 3, name: "Fase 3 - Vale Nebuloso", isBossPhase: false },
  { group: 2, position: 4, name: "Fase 4 - Caverna Secreta", isBossPhase: false },
  { group: 2, position: 5, name: "Chefe - Guardião da Montanha", isBossPhase: true },

  // GRUPO 3
  { group: 3, position: 1, name: "Fase 1 - Clareira Silenciosa", isBossPhase: false },
  { group: 3, position: 2, name: "Fase 2 - Troncos Caídos", isBossPhase: false },
  { group: 3, position: 3, name: "Fase 3 - Rio Rápido", isBossPhase: false },
  { group: 3, position: 4, name: "Fase 4 - Penhasco Oculto", isBossPhase: false },
  { group: 3, position: 5, name: "Chefe - Sábio da Floresta", isBossPhase: true },

  // GRUPO 4
  { group: 4, position: 1, name: "Fase 1 - Dunas Infinitas", isBossPhase: false },
  { group: 4, position: 2, name: "Fase 2 - Oásis Escondido", isBossPhase: false },
  { group: 4, position: 3, name: "Fase 3 - Tempestade de Areia", isBossPhase: false },
  { group: 4, position: 4, name: "Fase 4 - Ruínas Antigas", isBossPhase: false },
  { group: 4, position: 5, name: "Chefe - Faraó Esquecido", isBossPhase: true },

  // GRUPO 5
  { group: 5, position: 1, name: "Fase 1 - Túnel Escuro", isBossPhase: false },
  { group: 5, position: 2, name: "Fase 2 - Lago de Lava", isBossPhase: false },
  { group: 5, position: 3, name: "Fase 3 - Caverna Cristalina", isBossPhase: false },
  { group: 5, position: 4, name: "Fase 4 - Abismo Profundo", isBossPhase: false },
  { group: 5, position: 5, name: "Chefe - Dragão Ancião", isBossPhase: true }
];

// --- BANCO DE DADOS DE PERGUNTAS (POOLS) ---

// MATH: Gerado proceduralmente no código mais abaixo para ser infinito.

// HISTORY: Revolução Francesa, Brasil, Geral
const HISTORY_POOL = [
  { s: "Em que ano foi proclamada a Independência do Brasil?", c: "1822", w: ["1500", "1889", "1988"] },
  { s: "Qual evento marcou o início da Revolução Francesa em 1789?", c: "A Queda da Bastilha", w: ["A Morte do Rei", "A Guerra dos 100 Anos", "O Descobrimento da América"] },
  { s: "Quem foi o primeiro presidente do Brasil?", c: "Deodoro da Fonseca", w: ["Getúlio Vargas", "Dom Pedro II", "Juscelino Kubitschek"] },
  { s: "Qual civilização construiu as pirâmides de Gizé?", c: "Egípcios", w: ["Romanos", "Maias", "Gregos"] },
  { s: "Em que ano o homem pisou na Lua pela primeira vez?", c: "1969", w: ["1950", "2000", "1980"] },
  { s: "Qual era a capital do Brasil antes de Brasília?", c: "Rio de Janeiro", w: ["Salvador", "São Paulo", "Recife"] },
  { s: "Quem descobriu o Brasil em 1500?", c: "Pedro Álvares Cabral", w: ["Cristóvão Colombo", "Vasco da Gama", "Dom Pedro I"] },
  { s: "Qual guerra ocorreu entre 1939 e 1945?", c: "Segunda Guerra Mundial", w: ["Primeira Guerra Mundial", "Guerra Fria", "Guerra do Vietnã"] },
  { s: "Quem pintou a Mona Lisa?", c: "Leonardo da Vinci", w: ["Michelangelo", "Van Gogh", "Picasso"] },
  { s: "Qual país presenteou os EUA com a Estátua da Liberdade?", c: "França", w: ["Inglaterra", "Espanha", "Itália"] }
];

// SCIENCE: Corpo Humano, Células, Plantas, Espaço
const SCIENCE_POOL = [
  { s: "Qual é a unidade básica da vida?", c: "Célula", w: ["Átomo", "Tecido", "Órgão"] },
  { s: "Qual gás nós respiramos para sobreviver?", c: "Oxigênio", w: ["Gás Carbônico", "Hélio", "Nitrogênio"] },
  { s: "Qual é o processo pelo qual as plantas produzem alimento?", c: "Fotossíntese", w: ["Respiração", "Digestão", "Germinação"] },
  { s: "Qual é o maior órgão do corpo humano?", c: "Pele", w: ["Fígado", "Coração", "Pulmão"] },
  { s: "Quantos planetas existem no Sistema Solar?", c: "8", w: ["7", "9", "10"] },
  { s: "O que significa H2O?", c: "Água", w: ["Ouro", "Sal", "Oxigênio"] },
  { s: "Qual parte da célula contém o DNA?", c: "Núcleo", w: ["Membrana", "Citoplasma", "Mitocôndria"] },
  { s: "Qual o animal terrestre mais rápido do mundo?", c: "Guepardo", w: ["Leão", "Cavalo", "Tigre"] },
  { s: "O que as abelhas produzem?", c: "Mel", w: ["Leite", "Seda", "Algodão"] },
  { s: "Qual é o planeta mais próximo do Sol?", c: "Mercúrio", w: ["Vênus", "Terra", "Marte"] }
];

// LANGUAGES: Sinônimos, Inglês básico, Gramática
const LANGUAGES_POOL = [
  { s: "Qual é o antônimo de 'Rápido'?", c: "Lento", w: ["Veloz", "Apressado", "Correndo"] },
  { s: "Como se diz 'Cachorro' em inglês?", c: "Dog", w: ["Cat", "Bird", "Fish"] },
  { s: "Qual é o plural de 'Cidadão'?", c: "Cidadãos", w: ["Cidadões", "Cidadães", "Cidades"] },
  { s: "O que significa a palavra 'Book' em português?", c: "Livro", w: ["Mesa", "Cadeira", "Caneta"] },
  { s: "Qual destas palavras é um verbo?", c: "Correr", w: ["Azul", "Casa", "Lápis"] },
  { s: "Qual é o sinônimo de 'Feliz'?", c: "Alegre", w: ["Triste", "Raiva", "Cansado"] },
  { s: "Complete: 'The sky is ___' (O céu é azul).", c: "Blue", w: ["Red", "Green", "Yellow"] },
  { s: "Qual é o feminino de 'Cavalo'?", c: "Égua", w: ["Cavala", "Mula", "Burra"] },
  { s: "O que é um adjetivo?", c: "Uma qualidade", w: ["Uma ação", "Um nome", "Um lugar"] },
  { s: "Como se escreve o número 10 em inglês?", c: "Ten", w: ["Two", "One", "Twenty"] }
];

// --- LÓGICA DE GERAÇÃO ---

const CATEGORIES = ['MATH', 'HISTORY', 'SCIENCE', 'LANGUAGES'];

/**
 * Retorna um elemento aleatório de um array de questões-base (pool).
 *
 * @param {Array<{ s: string, c: string, w: string[] }>} pool Lista de questões base.
 * @returns {{ s: string, c: string, w: string[] }} Questão escolhida aleatoriamente.
 */
function getRandomFromPool(pool) {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Gera proceduralmente uma questão de matemática simples, com operação
 * de soma, subtração ou multiplicação, e alternativas derivadas do
 * resultado correto.
 *
 * @returns {{ s: string, c: string, w: string[] }} Objeto com enunciado,
 *          resposta correta e alternativas incorretas.
 */
function generateMathQuestion() {
  const operacoes = ['+', '-', 'x'];
  const op = operacoes[Math.floor(Math.random() * operacoes.length)];
  let a, b, result;

  if (op === 'x') {
    a = Math.floor(Math.random() * 9) + 2; // 2 a 10
    b = Math.floor(Math.random() * 9) + 2;
    result = a * b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a); // Garante positivo
    result = a - b;
  } else {
    a = Math.floor(Math.random() * 50);
    b = Math.floor(Math.random() * 50);
    result = a + b;
  }

  return {
    s: `Quanto é ${a} ${op} ${b}?`,
    c: `${result}`,
    w: [`${result + 2}`, `${result - 3}`, `${result + 10}`]
  };
}

const phasesToInsert = [];
const questionsToInsert = [];

/**
 * Gera um conjunto de questões para uma fase específica, rotacionando
 * as categorias (MATH, HISTORY, SCIENCE, LANGUAGES) e garantindo que
 * a alternativa correta esteja sempre no índice 0.
 *
 * @param {any} phaseId ID da fase (ObjectId no Mongo shell).
 * @param {string} phaseName Nome da fase (usado no título da questão).
 * @param {number} count Quantidade de questões a serem geradas.
 * @returns {Array<any>} Lista de documentos de questão prontos para inserção.
 */
function generateQuestionsForPhase(phaseId, phaseName, count) {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const categoryCode = CATEGORIES[i % CATEGORIES.length]; // Rotaciona as matérias
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

    // REGRA DE OURO: Resposta correta sempre no índice 0
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
      
      title: `${phaseName} - Q${i + 1}`,
      statement: content.s,
      
      options: optionsArray,
      correctOptionIndex: 0, // Sempre 0
      
      points: phaseName.includes("Chefe") ? 25 : 10,
      difficulty: i >= (count - 3) ? "hard" : "medium" // Últimas mais difíceis
    });
  }
  return questions;
}

// --- EXECUÇÃO DO SCRIPT ---

rawPhases.forEach(phaseData => {
  const phaseId = ObjectId();
  
  phasesToInsert.push({
    _id: phaseId,
    ...phaseData
  });

  // Regra: Boss = 15, Normal = 10
  const questionCount = phaseData.isBossPhase ? 15 : 10;

  const newQuestions = generateQuestionsForPhase(phaseId, phaseData.name, questionCount);
  questionsToInsert.push(...newQuestions);
});

print(`Inserindo ${phasesToInsert.length} fases...`);
db.phases.insertMany(phasesToInsert);

print(`Inserindo ${questionsToInsert.length} perguntas...`);
db.questions.insertMany(questionsToInsert);

print("Seed Completo! Perguntas variadas (Revolução Francesa, Células, etc) com 4 alternativas e resposta correta no índice 0.");