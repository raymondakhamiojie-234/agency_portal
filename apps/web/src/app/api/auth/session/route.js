/**
 * Dummy session endpoint to silence 404 errors from third-party libraries
 * This app uses custom authentication - this endpoint is just for compatibility
 */
export async function GET() {
  return Response.json({ user: null }, { status: 200 });
}
