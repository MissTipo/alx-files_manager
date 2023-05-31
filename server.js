//Express server
import routes from './routes';
import express from 'express';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use('/', routes);

app.listen(port, () => console.log(`Server running on port ${port}`));
