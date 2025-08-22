import { NextResponse } from "next/server";
import connectMongoDb from "../../../libs/mongodb";
import Project from "../../../models/projects.model";

export async function GET() {
  try {
    await connectMongoDb();
    const projects = await Project.find({}).lean();
    const mappedProjects = projects.map((project) => ({
      id: project._id?.toString() ?? "",
      name: project.name ?? "",
      status: project.status ?? "",
      budget: project.budget ?? 0,
      description: project.description ?? "",
      deadline: project.deadline ?? "",
      progress: project.progress ?? "0",
      team: project.team ?? [],
      priority: project.priority ?? "",
    }));
    return NextResponse.json({ projects: mappedProjects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, status, budget, description, deadline, progress, team, priority } = await request.json();
    await connectMongoDb();
    const createdProject = await Project.create({ name, status, budget, description, deadline, progress, team, priority });
    return NextResponse.json(
      { message: "Project created", project: createdProject },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
