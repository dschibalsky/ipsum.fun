// view.tsx
async function trackView(slug: string) {
  const response = await fetch('http://localhost:3001/api/views', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    throw new Error('Failed to track view');
  }

  const data = await response.json();
  return data;
}