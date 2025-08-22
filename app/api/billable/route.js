
import dbConnect from '@/libs/mongodb';
import BillableHours from '@/models/billableHours.model';

export async function GET(req) {
  await dbConnect();
  // Populate project and client details
  const billableHours = await BillableHours.find({})
    .populate({ path: 'project', select: 'name status budget description deadline progress team priority' })
    .populate({ path: 'client', select: 'client company email phone status' })
    .sort({ createdAt: -1 });
  return new Response(JSON.stringify(billableHours), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { startTime, endTime, billable, totalHours, project, client } = body;
  if (!startTime || !endTime || typeof billable !== 'boolean' || typeof totalHours !== 'number' || !project || !client) {
    return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), { status: 400 });
  }
  const billableHoursDoc = await BillableHours.create({ startTime, endTime, billable, totalHours, project, client });
  return new Response(JSON.stringify(billableHoursDoc), { status: 201 });
}
