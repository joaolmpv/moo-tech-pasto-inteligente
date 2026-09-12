const path = require("path");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { calcIndiceSaude, classificar } = require("./pastureHealth");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

app.get("/api/piquetes", async (_req, res) => {
  const piquetes = await prisma.piquete.findMany({
    include: {
      _count: { select: { animais: true } },
      alertas: { where: { resolvido: false } },
    },
    orderBy: { name: "asc" },
  });

  res.json(
    piquetes.map((p) => ({
      id: p.id,
      name: p.name,
      areaHectares: p.areaHectares,
      capacidadeUA: p.capacidadeUA,
      lotacaoAtualUA: p.lotacaoAtualUA,
      diasDescanso: p.diasDescanso,
      indiceSaude: p.indiceSaude,
      status: classificar(p.indiceSaude),
      totalAnimais: p._count.animais,
      alertasAtivos: p.alertas.length,
    }))
  );
});

app.get("/api/alertas", async (_req, res) => {
  const alertas = await prisma.alerta.findMany({
    where: { resolvido: false },
    include: { piquete: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(alertas);
});

app.post("/api/piquetes/:id/rotacionar", async (req, res) => {
  const { id } = req.params;

  await prisma.alerta.updateMany({
    where: { piqueteId: id, resolvido: false },
    data: { resolvido: true },
  });

  const piquete = await prisma.piquete.update({
    where: { id },
    data: { diasDescanso: 0, ultimaRotacao: new Date(), indiceSaude: 100 },
  });

  res.json(piquete);
});

app.listen(PORT, () => {
  console.log(`Moo Tech · Pasto IA rodando em http://localhost:${PORT}`);
});
