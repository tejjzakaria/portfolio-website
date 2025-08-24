import dbConnect from '@/libs/mongodb';
import Announcement from '@/models/announcements.model.js';

export async function GET(req, { params }) {
  await dbConnect();
  const announcement = await Announcement.findById(params.id);
  if (!announcement) return new Response('Not found', { status: 404 });
  return Response.json(announcement);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Announcement.findByIdAndUpdate(params.id, body, { new: true });
  if (!updated) return new Response('Not found', { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const deleted = await Announcement.findByIdAndDelete(params.id);
  if (!deleted) return new Response('Not found', { status: 404 });
  return Response.json({ success: true });
}
