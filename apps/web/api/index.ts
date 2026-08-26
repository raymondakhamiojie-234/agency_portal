import { handle } from 'hono/vercel';
import { app } from '../__create/index.js';

export const config = {
  runtime: 'nodejs',
};

export default handle(app);
