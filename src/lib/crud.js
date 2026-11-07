import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from './db';
import { refreshSite } from './revalidate';

// Small generic list / create / update / delete handlers for simple admin collections.
// read(body) -> { data } or { error };  serialize(doc) -> plain object for the admin screen.
export function crud({ Model, read, serialize, populate }) {
  const find = async (sort = { order: 1, createdAt: 1 }) => {
    let q = Model.find({}).sort(sort);
    if (populate) q = q.populate(populate);
    return q.lean();
  };
  return {
    async list() {
      await connectDB();
      return NextResponse.json({ items: (await find()).map(serialize) });
    },
    async create(req) {
      const r = read(await req.json().catch(() => ({})));
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      await connectDB();
      const count = await Model.countDocuments({});
      const doc = await Model.create({ order: count, ...r.data });
      refreshSite();
      return NextResponse.json({ item: serialize(doc) });
    },
    async update(req, { params }) {
      if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
      await connectDB();
      const doc = await Model.findById(params.id);
      if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const body = await req.json().catch(() => ({}));
      const r = read({ ...serialize(doc), ...body }); // partial updates such as { visible } are fine
      if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
      doc.set(r.data);
      await doc.save();
      refreshSite();
      return NextResponse.json({ item: serialize(doc) });
    },
    async remove(_req, { params }) {
      if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
      await connectDB();
      await Model.findByIdAndDelete(params.id);
      refreshSite();
      return NextResponse.json({ ok: true });
    },
  };
}
