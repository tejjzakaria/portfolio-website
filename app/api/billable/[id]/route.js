import dbConnect from '@/libs/mongodb';
import BillableHours from '@/models/billableHours.model';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const billable = await BillableHours.findById(id);
  if (!billable) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(billable), { status: 200 });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const body = await req.json();
  const updated = await BillableHours.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const deleted = await BillableHours.findByIdAndDelete(id);
  if (!deleted) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
