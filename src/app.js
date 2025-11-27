const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const openapi = require('../openapi.json');

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const instituicoesRouter = require('./routes/instituicoes');
const programasRouter = require('./routes/programas');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/instituicoes', instituicoesRouter(prisma));
app.use('/programas', programasRouter(prisma));

app.get('/', (req, res) => res.send({ ok: true }));

app.listen(port, () => console.log(`Server running on port ${port}`));
