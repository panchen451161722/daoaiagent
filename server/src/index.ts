import express from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(undefined, {
  swaggerUrl: '/swagger.json',
}));

// Routes
RegisterRoutes(app);

// Error handling
app.use(function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void {
  if (err instanceof ValidateError) {
    console.warn('Caught Validation Error:', err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
  next();
});

// Handle 404
app.use(function notFoundHandler(_req: express.Request, res: express.Response) {
  res.status(404).send({
    message: 'Not Found',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
