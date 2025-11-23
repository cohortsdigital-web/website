export async function onRequestPost(context) {
  const { request, env } = context;

  const data = await request.json();
  const { name, email, phone, message } = data;

  // Brevo email payload
  const brevoPayload = {
    sender: { email: "cohortsdigital@gmail.com" },
    to: [{ email: "cohortsdigital@gmail.com" }], // receive here
    subject: "New Contact Message from Website",
    htmlContent: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  // Send request to Brevo
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY
    },
    body: JSON.stringify(brevoPayload)
  });

  if (!response.ok) {
    return new Response("Email failed", { status: 500 });
  }

  return new Response("Email sent", { status: 200 });
}

