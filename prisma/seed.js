// Popula o banco com uma fazenda, piquetes em diferentes estagios de
// pastejo e animais com brinco RFID -- gera alertas de superpastejo
// automaticamente para os piquetes que precisam de rotacao.

const { PrismaClient } = require("@prisma/client");
const { calcIndiceSaude, classificar } = require("../src/pastureHealth");

const prisma = new PrismaClient();

const PIQUETES = [
  { name: "Piquete 1", areaHectares: 12, capacidadeUA: 30, lotacaoAtualUA: 28, diasDescanso: 2 },
  { name: "Piquete 2", areaHectares: 8, capacidadeUA: 20, lotacaoAtualUA: 23, diasDescanso: 14 },
  { name: "Piquete 3", areaHectares: 15, capacidadeUA: 35, lotacaoAtualUA: 15, diasDescanso: 1 },
  { name: "Piquete 4", areaHectares: 10, capacidadeUA: 25, lotacaoAtualUA: 24, diasDescanso: 6 },
  { name: "Piquete 5", areaHectares: 9, capacidadeUA: 22, lotacaoAtualUA: 20, diasDescanso: 12 },
  { name: "Piquete 6", areaHectares: 11, capacidadeUA: 28, lotacaoAtualUA: 10, diasDescanso: 3 },
];

async function main() {
  const farm = await prisma.farm.create({
    data: { name: "Fazenda Demonstração Moo Tech", city: "Goiás - GO" },
  });

  let tagCounter = 1;

  for (const p of PIQUETES) {
    const indiceSaude = calcIndiceSaude(p);
    const piquete = await prisma.piquete.create({
      data: { ...p, farmId: farm.id, indiceSaude },
    });

    // 1 UA ~ 1 animal adulto, simplificado para o prototipo
    const nAnimais = Math.round(p.lotacaoAtualUA / 3);
    for (let i = 0; i < nAnimais; i++) {
      await prisma.animal.create({
        data: {
          rfidTag: `SENSE-${String(tagCounter).padStart(4, "0")}`,
          piqueteId: piquete.id,
          raca: "Nelore",
        },
      });
      tagCounter++;
    }

    const risco = classificar(indiceSaude);
    if (risco !== "SAUDAVEL") {
      await prisma.alerta.create({
        data: {
          piqueteId: piquete.id,
          tipo: risco,
          mensagem:
            risco === "SUPERPASTEJO"
              ? `${p.name}: risco de superpastejo (índice ${indiceSaude}). Rotação recomendada imediatamente.`
              : `${p.name}: índice de saúde ${indiceSaude}. Planeje a rotação nos próximos dias.`,
        },
      });
    }
  }

  const total = await prisma.piquete.count();
  const alertas = await prisma.alerta.count({ where: { resolvido: false } });
  console.log(`Fazenda "${farm.name}" criada com ${total} piquetes e ${alertas} alertas ativos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
