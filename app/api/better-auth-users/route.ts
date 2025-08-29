import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Log the incoming request details
    console.log('[better-auth-users] Request URL:', request.url);
    console.log('[better-auth-users] Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Use Better Auth admin API to list users
    console.log('[better-auth-users] Calling auth.api.listUsers...');
    const result = await auth.api.listUsers({
      query: {},
      request,
      headers: Object.fromEntries(request.headers.entries())
    });
    // Always return { users: [...] }
    const users = Array.isArray(result?.users) ? result.users : [];
    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('[better-auth-users] Error occurred:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause,
      status: error?.status,
      statusText: error?.statusText,
      response: error?.response,
      fullError: error
    });
    
    return new Response(JSON.stringify({ 
      error: error?.message || error?.name || 'Unknown error',
      errorType: error?.constructor?.name || typeof error,
      status: error?.status || 'unknown',
      details: error?.cause || error?.response || null,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}