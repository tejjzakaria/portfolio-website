
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Helper to extract cookies/headers for session forwarding
function getForwardHeaders(req: NextRequest) {
  const headers: Record<string, string> = {};
  // Forward cookies for session context
  const cookie = req.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;
  // Forward authorization header if present
  const authz = req.headers.get('authorization');
  if (authz) headers['authorization'] = authz;
  // Forward user-agent for completeness
  const ua = req.headers.get('user-agent');
  if (ua) headers['user-agent'] = ua;
  return headers;
}

// GET /api/better-auth-users/[id] - get single user by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing user id' }), { status: 400 });
    }
    // Try _id first
    let result = await auth.api.listUsers({ query: { filterField: '_id', filterValue: userId, filterOperator: 'eq', limit: 1 } });
    let user = result?.users?.[0];
    // If not found, try id
    if (!user) {
      result = await auth.api.listUsers({ query: { filterField: 'id', filterValue: userId, filterOperator: 'eq', limit: 1 } });
      user = result?.users?.[0];
    }
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), { status: 500 });
  }
}

// PATCH /api/better-auth-users/[id] - update user details
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing user id' }), { status: 400 });
    }
    const body = await req.json();
    const forwardHeaders = getForwardHeaders(req);

    // Ban/unban user logic
    if (typeof body.banned === 'boolean') {
      try {
        if (body.banned) {
          // Ban user using api.banUser (with body property)
          const result = await auth.api.banUser({
            body: {
              userId,
              banReason: body.banReason,
              banExpiresIn: body.banExpiresIn,
            },
            headers: forwardHeaders,
          });
          console.log('[banUser] result:', result);
          return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          // Unban user using api.unbanUser (with body property)
          const result = await auth.api.unbanUser({
            body: { userId },
            headers: forwardHeaders,
          });
          console.log('[unbanUser] result:', result);
          return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (err: any) {
        console.error('[ban/unbanUser] error:', err);
        return new Response(JSON.stringify({ error: err?.message || 'Unknown error', details: err }), { status: 500 });
      }
    }



    // Set password (Better Auth expects newPassword and userId)
    if (typeof body.password === 'string' && body.password.length > 0) {
      try {
        const result = await auth.api.setUserPassword({
          body: { userId: userId, newPassword: body.password },
          headers: forwardHeaders,
        });
        return new Response(JSON.stringify({ result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || 'Unknown error', details: err }), { status: 500 });
      }
    }

    // Set role (use updateUser)
    if (typeof body.role === 'string' && body.role.length > 0) {
      try {
        // @ts-ignore: Better Auth API expects id in body, but types are incomplete
        const result = await auth.api.updateUser({
          body: { id: userId, role: body.role },
          headers: forwardHeaders,
        });
        return new Response(JSON.stringify({ result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || 'Unknown error', details: err }), { status: 500 });
      }
    }

    // Fallback: generic update (for any other fields)
    if (Object.keys(body).length > 0) {
      try {
        // @ts-ignore: Better Auth API expects id in body, but types are incomplete
        const result = await auth.api.updateUser({ body: { id: userId, ...body }, headers: forwardHeaders });
        return new Response(JSON.stringify({ result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || 'Unknown error', details: err }), { status: 500 });
      }
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), { status: 500 });
  }
}
