import dbConnect from '@/libs/mongodb';
import Invoice from '@/models/invoice.model';
import BillableHours from '@/models/billableHours.model';

// GET all invoices
export async function GET(req) {
  await dbConnect();
  const invoices = await Invoice.find({})
    .populate({
      path: 'billables',
      populate: [
        { path: 'client', select: 'client email company' },
        { path: 'project', select: 'name' },
      ],
    })
    .populate('client', 'client email company')
    .populate('project', 'name')
    .sort({ createdAt: -1 });
  return new Response(JSON.stringify(invoices), { status: 200 });
}

// CREATE invoice
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('Received body:', body);

    const { invoiceNumber, client, project, billables, hourlyRate, status } = body;
    if (!client || !project || !Array.isArray(billables) || billables.length === 0 || !hourlyRate) {
      console.error('Missing required fields', { client, project, billables, hourlyRate });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Auto-generate invoice number if not provided
    let newInvoiceNumber = invoiceNumber;
    if (!newInvoiceNumber) {
      // Find latest invoice for this year
      const year = new Date().getFullYear();
      const lastInvoice = await Invoice.findOne({ invoiceNumber: { $regex: `^INV-${year}-` } })
        .sort({ createdAt: -1 });
      let nextNum = 1;
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
        if (match) nextNum = parseInt(match[1], 10) + 1;
      }
      newInvoiceNumber = `INV-${year}-${String(nextNum).padStart(4, '0')}`;
    }

    // Fetch billable details to calculate totalHours and validate client/project
    const billableDocs = await BillableHours.find({ _id: { $in: billables } });
    console.log('Fetched billableDocs:', billableDocs);
    if (billableDocs.length !== billables.length) {
      console.error('Some billables not found', { billables, found: billableDocs.map(b => b._id) });
      return new Response(JSON.stringify({ error: 'Some billables not found' }), { status: 400 });
    }
    // Enforce all billables are for the same client
    const allSameClient = billableDocs.every(b => b.client.toString() === client);
    if (!allSameClient) {
      console.error('All billables must be for the same client', { client, billableClients: billableDocs.map(b => b.client) });
      return new Response(JSON.stringify({ error: 'All billables must be for the same client' }), { status: 400 });
    }
    // Optionally, enforce all billables are for the same project
    // const allSameProject = billableDocs.every(b => b.project.toString() === project);
    // if (!allSameProject) {
    //   console.error('All billables must be for the same project', { project, billableProjects: billableDocs.map(b => b.project) });
    //   return new Response(JSON.stringify({ error: 'All billables must be for the same project' }), { status: 400 });
    // }

    const totalHours = billableDocs.reduce((sum, b) => sum + (b.totalHours || 0), 0);
    const amount = totalHours * hourlyRate;
    console.log('Calculated totalHours and amount:', { totalHours, amount });

    const invoice = await Invoice.create({
      invoiceNumber: newInvoiceNumber,
      client,
      project,
      billables,
      amount,
      totalHours,
      hourlyRate,
      status: status || 'draft',
    });
    console.log('Created invoice:', invoice);
    return new Response(JSON.stringify(invoice), { status: 201 });
  } catch (err) {
    console.error('Internal server error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: err?.message }), { status: 500 });
  }
}
