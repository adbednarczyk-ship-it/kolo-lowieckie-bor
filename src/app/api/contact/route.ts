import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Niepoprawny format zgłoszenia." },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const topic = String(body.topic ?? "").trim();
  const message = String(body.message ?? "").trim();
  const consent = body.consent === true || body.consent === "true";

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Podaj imię i nazwisko." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Podaj poprawny adres e-mail." },
      { status: 400 },
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Wiadomość jest zbyt krótka." },
      { status: 400 },
    );
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Wymagana jest zgoda na przetwarzanie danych." },
      { status: 400 },
    );
  }

  // W produkcji podepnij tu Resend, Nodemailer lub webhook.
  console.info("[kontakt]", { name, email, phone, topic, message });

  return NextResponse.json({ ok: true });
}
