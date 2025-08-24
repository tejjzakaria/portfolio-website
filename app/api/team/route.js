import dbConnect from '@/libs/mongodb';
import TeamMember from '@/models/team.model.js';

export async function GET(req) {
  await dbConnect();
  try {
    const members = await TeamMember.find();
    return new Response(JSON.stringify(members), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch team members' }), { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const member = await TeamMember.create(body);
    return new Response(JSON.stringify(member), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to create team member' }), { status: 400 });
  }
}
