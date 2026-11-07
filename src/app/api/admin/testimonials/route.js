import { testimonialCrud } from '@/lib/crudConfigs';

export const dynamic = 'force-dynamic';
export const GET = () => testimonialCrud.list();
export const POST = (req) => testimonialCrud.create(req);
