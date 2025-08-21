import { NextResponse } from "next/server";
import connectMongoDb from "../../../../libs/mongodb";
import Client from "../../../../models/clients.model";

export async function GET(req, { params }) {
  try {
    await connectMongoDb();
    const client = await Client.findById(params.id).lean();
    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching client", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    await connectMongoDb();
    const updated = await Client.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Client updated", client: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating client", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDb();
    const deleted = await Client.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Client deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting client", error: error.message }, { status: 500 });
  }
}
