export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const res = await fetch(`${process.env.MAILER_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MAILER_TOKEN}`,
    },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!res.ok) {
    throw new Error(`Mailer responded with ${res.status}`);
  }
}
