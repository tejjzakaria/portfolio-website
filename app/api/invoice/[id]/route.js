import dbConnect from '@/libs/mongodb';
import Invoice from '@/models/invoice.model';
import BillableHours from '@/models/billableHours.model';

// GET, UPDATE, DELETE single invoice by id
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  const invoice = await Invoice.findById(id)
    .populate({
      path: 'billables',
      populate: [
        { path: 'client', select: 'client email company' },
        { path: 'project', select: 'name' },
      ],
    })
    .populate('client', 'client email company')
    .populate('project', 'name');
  if (!invoice) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(invoice), { status: 200 });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  // Allow partial updates: only update provided fields
  let updateFields = { ...body };

  // If billables or hourlyRate are present, recalculate totalHours/amount
  let recalcTotals = false;
  let billableDocs = [];
  if (updateFields.billables) {
    billableDocs = await BillableHours.find({ _id: { $in: updateFields.billables } });
    recalcTotals = true;
  }
  if (typeof updateFields.hourlyRate !== 'undefined') {
    recalcTotals = true;
  }
  if (recalcTotals) {
    // Use new or existing billables/hourlyRate
    const billablesToUse = updateFields.billables || (await Invoice.findById(id)).billables;
    const hourlyRateToUse = typeof updateFields.hourlyRate !== 'undefined' ? updateFields.hourlyRate : (await Invoice.findById(id)).hourlyRate;
    const docs = billableDocs.length ? billableDocs : await BillableHours.find({ _id: { $in: billablesToUse } });
    const totalHours = docs.reduce((sum, b) => sum + (b.totalHours || 0), 0);
    const amount = totalHours * hourlyRateToUse;
    updateFields.totalHours = totalHours;
    updateFields.amount = amount;
  }

  const updated = await Invoice.findByIdAndUpdate(
    id,
    updateFields,
    { new: true }
  )
    .populate({
      path: 'billables',
      populate: [
        { path: 'client', select: 'client email company' },
        { path: 'project', select: 'name' },
      ],
    })
    .populate('client', 'client email company')
    .populate('project', 'name');
  if (!updated) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  const deleted = await Invoice.findByIdAndDelete(id);
  if (!deleted) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
