export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { name, email, phone, message } = data;

    const brevoPayload = {
      sender: { email: "cohortsdigital@gmail.com" },
      to: [{ email: "cohortsdigital@gmail.com" }],
      subject: "New Contact Message from Website",
      htmlContent: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    };

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY
      },
      body: JSON.stringify(brevoPayload)
    });

    const brevoText = await brevoResponse.text();

    if (!brevoResponse.ok) {
      return new Response("BREVO ERROR: " + brevoText, {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }

    return new Response("OK", { status: 200 });

  } catch (err) {
    return new Response("FUNCTION ERROR: " + err.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
