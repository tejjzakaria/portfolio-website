import dbConnect from '@/libs/mongodb';
import Billable from '@/models/billable.model';

export async function GET(req) {
  await dbConnect();
  const billables = await Billable.find({}).sort({ createdAt: -1 });
  return new Response(JSON.stringify(billables), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { startTime, endTime, billable, totalHours } = body;
  if (!startTime || !endTime || typeof billable !== 'boolean' || typeof totalHours !== 'number') {
    return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), { status: 400 });
  }
  const billableDoc = await Billable.create({ startTime, endTime, billable, totalHours });
  return new Response(JSON.stringify(billableDoc), { status: 201 });
}
