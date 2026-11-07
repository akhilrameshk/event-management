import { testimonialCrud } from '@/lib/crudConfigs';

export const PUT = (req, ctx) => testimonialCrud.update(req, ctx);
export const DELETE = (req, ctx) => testimonialCrud.remove(req, ctx);
