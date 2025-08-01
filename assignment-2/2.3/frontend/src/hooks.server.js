/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  try {
    return await resolve(event);
  } catch (err) {
    console.error('Unhandled error:', err);
    // you can customize response or redirect
    throw err;
  }
}
