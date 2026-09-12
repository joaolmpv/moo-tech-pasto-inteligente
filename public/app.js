async function carregar() {
  const [piquetes, alertas] = await Promise.all([
    fetch("/api/piquetes").then((r) => r.json()),
    fetch("/api/alertas").then((r) => r.json()),
  ]);

  const alertasEl = document.getElementById("alertas");
  alertasEl.innerHTML = alertas.length
    ? alertas
        .map(
          (a) =>
            `<div class="alerta ${a.tipo === "SUPERPASTEJO" ? "superpastejo" : ""}">⚠️ ${a.mensagem}</div>`
        )
        .join("")
    : "<p style='opacity:.6'>Nenhum alerta ativo.</p>";

  const grid = document.getElementById("piquetes");
  grid.innerHTML = piquetes
    .map(
      (p) => `
      <div class="card ${p.status}">
        <h3>${p.name}</h3>
        <div class="indice">${p.indiceSaude}</div>
        <dl>
          <dt>Status</dt><dd>${p.status.replace("_", " ")}</dd>
          <dt>Lotação</dt><dd>${p.lotacaoAtualUA} / ${p.capacidadeUA} UA</dd>
          <dt>Área</dt><dd>${p.areaHectares} ha</dd>
          <dt>Dias sem rotação</dt><dd>${p.diasDescanso}</dd>
          <dt>Animais (RFID)</dt><dd>${p.totalAnimais}</dd>
        </dl>
        <button onclick="rotacionar('${p.id}')">Registrar rotação</button>
      </div>`
    )
    .join("");
}

async function rotacionar(id) {
  await fetch(`/api/piquetes/${id}/rotacionar`, { method: "POST" });
  carregar();
}

carregar();
