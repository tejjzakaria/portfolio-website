import { NextResponse } from "next/server";
import connectMongoDb from "../../../../libs/mongodb";
import Project from "../../../../models/projects.model";

export async function GET(req, { params }) {
  try {
    await connectMongoDb();
    const project = await Project.findById(params.id).lean();
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching project", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    await connectMongoDb();
    const updated = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project updated", project: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating project", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDb();
    const deleted = await Project.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting project", error: error.message }, { status: 500 });
  }
}
