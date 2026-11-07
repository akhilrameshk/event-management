import { teamCrud } from '@/lib/crudConfigs';

export const dynamic = 'force-dynamic';
export const GET = () => teamCrud.list();
export const POST = (req) => teamCrud.create(req);
