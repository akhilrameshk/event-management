import { teamCrud } from '@/lib/crudConfigs';

export const PUT = (req, ctx) => teamCrud.update(req, ctx);
export const DELETE = (req, ctx) => teamCrud.remove(req, ctx);
