import { redirect } from 'next/navigation';

// After a staff action: back to a page with what happened in the address, so the result shows
// without JavaScript and survives a reload.
export function done(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export function failed(path: string, problem: string): never {
  redirect(`${path}?error=${encodeURIComponent(problem)}`);
}
