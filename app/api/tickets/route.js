import dbConnect from '@/libs/mongodb';
import Ticket from '@/models/tickets.model';

export async function GET(req) {
  await dbConnect();
  const tickets = await Ticket.find().populate('client').populate('project').sort({ createdAt: -1 });
  return Response.json(tickets);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const ticket = await Ticket.create(data);
  await ticket.populate('client');
  await ticket.populate('project');
  return Response.json(ticket, { status: 201 });
}
