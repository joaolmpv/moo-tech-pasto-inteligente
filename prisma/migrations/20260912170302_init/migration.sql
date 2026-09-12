-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Piquete" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaHectares" REAL NOT NULL,
    "capacidadeUA" REAL NOT NULL,
    "lotacaoAtualUA" REAL NOT NULL,
    "diasDescanso" INTEGER NOT NULL,
    "indiceSaude" INTEGER NOT NULL DEFAULT 100,
    "ultimaRotacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Piquete_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfidTag" TEXT NOT NULL,
    "piqueteId" TEXT NOT NULL,
    "raca" TEXT,
    "entradaFazenda" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Animal_piqueteId_fkey" FOREIGN KEY ("piqueteId") REFERENCES "Piquete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "piqueteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvido" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Alerta_piqueteId_fkey" FOREIGN KEY ("piqueteId") REFERENCES "Piquete" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Animal_rfidTag_key" ON "Animal"("rfidTag");
