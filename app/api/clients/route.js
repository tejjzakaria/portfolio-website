
import { NextResponse } from "next/server";
import connectMongoDb from "../../../libs/mongodb";
import Client from "../../../models/clients.model";

export async function POST(request) {
    try {
        const { client, company, email, phone, projects } = await request.json();
        await connectMongoDb();
        const createdClient = await Client.create({ client, company, email, phone, projects });
        return NextResponse.json(
            {
                message: "Client created",
                client: createdClient
            },
            {
                status: 201
            }
        );
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                message: "Internal Server Error",
                error: error.message || error.toString(),
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            },
            {
                status: 500
            }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDb();
        const clients = await Client.find({}).lean();
        // Map only the fields needed for the table
        const mappedClients = clients.map((client) => ({
            id: client._id?.toString() ?? "",
            client: client.client ?? "",
            company: client.company ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            projects: client.projects ?? "",
            status: client.status ?? "",
        }));
        return NextResponse.json({ clients: mappedClients }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                message: "Internal Server Error",
                error: error.message || error.toString(),
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            },
            {
                status: 500
            }
        );
    }
}