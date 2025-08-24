import dbConnect from '@/libs/mongodb';
import Announcement from '@/models/announcements.model.js';

export async function GET(req) {
  await dbConnect();
  const announcements = await Announcement.find().sort({ publishedAt: -1 });
  return Response.json(announcements);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const announcement = await Announcement.create(body);
  return Response.json(announcement);
}
