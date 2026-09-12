// Regra de negocio central do "Pasto IA": calcula o indice de saude do
// piquete a partir da lotacao animal e do tempo sem rotacao/descanso, e
// classifica o risco de superpastejo.
//
// Formula simplificada para o prototipo -- em producao seria alimentada por
// leituras reais de sensores de solo/biomassa em vez de estimativa manual.

function calcIndiceSaude({ areaHectares, capacidadeUA, lotacaoAtualUA, diasDescanso }) {
  const taxaOcupacao = lotacaoAtualUA / capacidadeUA;
  const degradacao = taxaOcupacao * diasDescanso * 5;
  const indice = Math.round(Math.max(0, Math.min(100, 100 - degradacao)));
  return indice;
}

function classificar(indiceSaude) {
  if (indiceSaude < 40) return "SUPERPASTEJO";
  if (indiceSaude < 60) return "ROTACAO_RECOMENDADA";
  return "SAUDAVEL";
}

module.exports = { calcIndiceSaude, classificar };
