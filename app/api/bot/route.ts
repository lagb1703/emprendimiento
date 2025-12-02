
import { NextResponse } from "next/server";

export async function POST() {
	const OPENAI_KEY = process.env.OPENAI_API_KEY;
	if (!OPENAI_KEY) {
		return NextResponse.json({ error: "Missing server OPENAI_API_KEY" }, { status: 500 });
	}

	try {
		const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_KEY}`,
			},
			body: JSON.stringify({
				// Ajusta el modelo aquí si es necesario
				model: "gpt-4o-realtime-preview-2024",
				// Opcional: voice u otras opciones
				voice: "alloy",
			}),
		});

		const data = await res.json();
		if (!res.ok) {
			return NextResponse.json({ error: data }, { status: res.status });
		}

		// Normalizamos y devolvemos solo la clave efímera para evitar enviar
		// toda la respuesta (y así prevenir malinterpretación en el cliente).
		const clientSecret = data?.client_secret?.value ?? data?.client_secret;
		if (!clientSecret) {
			return NextResponse.json({ error: 'Missing client_secret in OpenAI response', raw: data }, { status: 500 });
		}

		return NextResponse.json({
			client_secret: clientSecret,
			id: data?.id,
			model: data?.model,
		});
	} catch (err) {
		return NextResponse.json({ error: String(err) }, { status: 500 });
	}
}
