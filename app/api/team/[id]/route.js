import dbConnect from '@/libs/mongodb';
import TeamMember from '@/models/team.model.js';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const member = await TeamMember.findById(params.id);
    if (!member) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch team member' }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    const member = await TeamMember.findByIdAndUpdate(params.id, body, { new: true });
    if (!member) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update team member' }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const member = await TeamMember.findByIdAndDelete(params.id);
    if (!member) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete team member' }), { status: 400 });
  }
}
