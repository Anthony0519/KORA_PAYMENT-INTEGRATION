import express from 'express'
import sequelize from './core/config/dbConnect'
import variable from './core/envVariables/environment'
import { userRoutes } from './api/routes/user'
import { transactionRoutes } from './api/routes/transaction'
import { logger } from './core/utils/logger'
import { Errors } from './core/constant/errorResponse'
import { handleErrors } from './api/middleware/handleError'

const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(transactionRoutes)

app.use((req, res, _next): void => {
  res.status(404).send({
    status: false,
    error: 'not found',
    message: `${Errors.RESOURCE_NOT_FOUND}... Probably a wrong URL or method`,
    data: {},
    path: req.url
  })
})
app.use(handleErrors)

app.listen(variable.PORT, async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to Database.');
  } catch (error: any) {
    logger.error(`Unable to connect to the database: ${error.message}`);
  }

  logger.info(`server on port: ${variable.PORT}`);
})
