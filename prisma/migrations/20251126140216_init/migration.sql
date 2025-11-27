-- CreateTable
CREATE TABLE "Instituicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "logoUrl" TEXT,
    "siteUrl" TEXT,
    "descricao" TEXT,

    CONSTRAINT "Instituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programa" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "publicoAlvo" TEXT NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFim" TIMESTAMP(3) NOT NULL,
    "editalUrl" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "tags" TEXT[],
    "resumo" TEXT NOT NULL,
    "descricaoCompleta" TEXT NOT NULL,

    CONSTRAINT "Programa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Programa" ADD CONSTRAINT "Programa_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "Instituicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
