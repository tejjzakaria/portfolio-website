import dbConnect from '@/libs/mongodb';
import Ticket from '@/models/tickets.model';

export async function GET(req, { params }) {
  await dbConnect();
  const ticket = await Ticket.findById(params.id).populate('client').populate('project');
  if (!ticket) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(ticket);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const data = await req.json();
  const ticket = await Ticket.findByIdAndUpdate(params.id, data, { new: true }).populate('client').populate('project');
  if (!ticket) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(ticket);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const ticket = await Ticket.findByIdAndDelete(params.id);
  if (!ticket) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
