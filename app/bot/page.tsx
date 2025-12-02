"use client"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"

const event = {
    type: "session.update",
    session: {
        type: "realtime",
        model: "gpt-realtime-mini-2025-10-06",
        output_modalities: ["audio"],
        truncation: {
            type: "retention_ratio",
            retention_ratio: 0.8,
            token_limits: {
                post_instructions: 1000
            }
        },
        audio: {
            input: {
                format: {
                    type: "audio/pcm",
                    rate: 24000,
                },
                turn_detection: {
                    type: "semantic_vad"
                }
            },
            output: {
                format: {
                    type: "audio/pcm",
                },
                voice: "marin",
            }
        },
        instructions: `
            Te llamas David, eres un asistente virtual amigable y servicial.
            Responde de manera concisa y clara a las preguntas que te hagan.
            Si no sabes la respuesta, di "No lo sé".
            Eres el encargado de ayudar a los psicologos a manejar mejor sus consultas con los pacientes.
            Serás amable amigable y empático en tus respuestas.
        `,
    },
};

type UserResponse = {
    user: { [key: string]: any }
}

export default function Bot() {
    const router = useRouter()
    const [running, setRunning] = useState(false);
    const webSocket = useRef<WebSocket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioChunksRef = useRef<Map<string, Uint8Array[]>>(new Map());

    useEffect(() => {
        const ac = new AbortController()
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/user', { signal: ac.signal })
                if (!res.ok) {
                    router.push('/login')
                    return
                }
                const data: UserResponse = await res.json()
                if (!data.user.isPlus) {
                    router.push('/login')
                    return
                }
            } catch (err) {
                if ((err as any).name === 'AbortError') return
            }
        }
        fetchUser()
        return () => ac.abort()
    }, []);

    const BotStatus = ({ running, model }: { running: boolean; model: string }) => {
        return (
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-700 bg-gradient-to-r from-slate-800 to-slate-900 text-white" aria-live="polite">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${running ? 'bg-green-500' : 'bg-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V6a4 4 0 118 0v1m-9 8h10a2 2 0 012 2v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1a2 2 0 012-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14v.01M15 14v.01" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{running ? 'Bot activo' : 'Bot inactivo'}</span>
                        <span className="text-xs text-gray-300">Modelo: <span className="font-mono text-xs">{model}</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-xs text-gray-300">Estado de la sesión</span>
                        <span className={`text-sm font-medium ${running ? 'text-green-300' : 'text-gray-400'}`}>{running ? 'En uso' : 'Esperando'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full ${running ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    </div>
                </div>
            </div>
        );
    };

    const start = async () => {
        if (webSocket.current)
            return;
        webSocket.current = new WebSocket(
            `wss://api.openai.com/v1/realtime?model=gpt-realtime`,
            [
                "realtime",
                "openai-insecure-api-key." + process.env.NEXT_PUBLIC_API_KEY
            ]
        );
        setTimeout(() => {
            if (webSocket.current)
                webSocket.current.send(JSON.stringify(event));
        }, 3000);
        webSocket.current.onopen = () => {
            console.log("Connected to server.");
            // Start capturing and sending audio when socket opens
            startSendingAudio(webSocket.current!).catch((err) => console.log('startSendingAudio error: ' + String(err)));
        };
        webSocket.current.onmessage = (event: MessageEvent) => {
            try {
                const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                // console.log('WS msg', data);
                // addLog(JSON.stringify(data).substring(0, 400));

                // Buscar y manejar clips de audio en la respuesta
                handleIncomingAudioMessage(data).catch((e) => console.log('handleIncomingAudioMessage error: ' + String(e)));
            } catch (err) {
                console.log(event.data);
            }
        };
        webSocket.current.onerror = (event) => {
            console.error("WebSocket error", event);
            console.log("WebSocket error");
        };
        webSocket.current.onclose = () => {
            console.log("WebSocket closed");
            setRunning(false);
            webSocket.current = null;
            // Ensure audio resources stopped
            stopSendingAudio().catch(() => { });
        };
        setRunning(true);
    };

    const stop = async () => {
        if (!webSocket.current)
            return;
        // ask finalization: commit buffer and request response, then close
        try {
            webSocket.current.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
            webSocket.current.send(JSON.stringify({
                type: 'response.create',
                response: { instructions: 'Transcribe and respond briefly.', modalities: ['audio'] }
            }));
        } catch (e) {
            console.log('Error sending commit/response.create: ' + String(e));
        }

        // stop audio capture and then close socket
        await stopSendingAudio();
        webSocket.current.close();
        webSocket.current = null;
        setRunning(false);
    };

    // --- Audio helpers ---
    function floatTo16BitPCM(float32Array: Float32Array) {
        const l = float32Array.length;
        const buffer = new ArrayBuffer(l * 2);
        const view = new DataView(buffer);
        let offset = 0;
        for (let i = 0; i < l; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return new Uint8Array(buffer);
    }

    function arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
    }

    function downsampleBuffer(buffer: Float32Array, srcRate: number, dstRate: number) {
        if (dstRate === srcRate) return buffer;
        const sampleRateRatio = srcRate / dstRate;
        const newLength = Math.round(buffer.length / sampleRateRatio);
        const result = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult < result.length) {
            const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            let accum = 0, count = 0;
            for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = count ? accum / count : 0;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }

    async function startSendingAudio(ws: WebSocket) {
        if (mediaStreamRef.current) return; // already started
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        sourceNodeRef.current = source;

        const bufferSize = 4096;
        const processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        processorRef.current = processor;

        // prevent audible feedback: connect to a zero-gain node
        const zeroGain = audioCtx.createGain();
        zeroGain.gain.value = 0;
        processor.connect(zeroGain);
        zeroGain.connect(audioCtx.destination);

        const targetSampleRate = 16000;

        processor.onaudioprocess = (event) => {
            try {
                const inputData = event.inputBuffer.getChannelData(0);
                const down = downsampleBuffer(inputData, audioCtx.sampleRate, targetSampleRate);
                const pcm16 = floatTo16BitPCM(down);
                const b64 = arrayBufferToBase64(pcm16.buffer);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }));
                }
            } catch (e) {
                console.log('audio process error: ' + String(e));
            }
        };

        source.connect(processor);
        // do not connect processor to destination directly to avoid echo
    }

    async function stopSendingAudio() {
        // stop processor and audio nodes
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
            processorRef.current = null;
        }
        if (sourceNodeRef.current) {
            try { sourceNodeRef.current.disconnect(); } catch { };
            sourceNodeRef.current = null;
        }
        if (audioCtxRef.current) {
            try { await audioCtxRef.current.close(); } catch { };
            audioCtxRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }
    }
    function base64ToUint8Array(b64: string) {
        const binary = atob(b64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    async function tryDecodeAndPlay(bytes: Uint8Array, format: { type: string, rate: number }) {
        try {
            const audioCtx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
            if (!audioCtxRef.current) audioCtxRef.current = audioCtx;
            const pcm16 = new DataView(bytes.buffer);
            const samples = new Float32Array(pcm16.byteLength / 2);
            for (let i = 0; i < samples.length; i++) {
                const val = pcm16.getInt16(i * 2, true);
                samples[i] = val / 32768;
            }
            const sampleRate = format.rate;
            const audioBuffer = audioCtx.createBuffer(1, samples.length, sampleRate);
            audioBuffer.getChannelData(0).set(samples);
            const src2 = audioCtx.createBufferSource();
            src2.buffer = audioBuffer;
            src2.connect(audioCtx.destination);
            src2.start();
            console.log(`Playing PCM16 ${sampleRate}Hz fallback audio`);
        } catch (e) {
            console.log('Error playing audio: ' + String(e));
        }
    }

    async function handleIncomingAudioMessage(msg: any) {
        const [response, out, delta] = msg.type.split(".");
        console.log(response, out, delta);
        const map = audioChunksRef.current;
        if (response === 'response' && out === 'done') {
            console.log(msg);
            const responseId = msg["response"]["id"] || "default";
            const format = msg["response"]["audio"]["output"]["format"]
            const chunks = map.get(responseId)!;
            let totalLen = 0;
            for (const ch of chunks) totalLen += ch.length;
            const concat = new Uint8Array(totalLen);
            let offset = 0;
            for (const ch of chunks) { concat.set(ch, offset); offset += ch.length; }
            await tryDecodeAndPlay(concat, format);
            return;
        }
        if (response !== 'response' || out !== 'output_audio' || delta !== 'delta')
            return;
        const responseId = msg["response_id"] || "default";
        if (!map.has(responseId)) map.set(responseId, []);
        const bytes = base64ToUint8Array(msg.delta);
        map.get(responseId)!.push(bytes);
        const chunks = map.get(responseId)!;
        let totalLen = 0;
        for (const ch of chunks) totalLen += ch.length;
        const concat = new Uint8Array(totalLen);
        let offset = 0;
        for (const ch of chunks) { concat.set(ch, offset); offset += ch.length; }
    }

    return (
        <>
            <AppHeader />
            <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
                <div className="max-w-3xl w-full space-y-6">
                    <h1 className="text-2xl font-bold mb-4">Bot Realtime</h1>

                    {/* Tarjeta de estado del bot */}
                    <BotStatus running={running} model={event.session.model} />

                    <div className="mb-4 flex justify-center gap-4">
                        {!running ? (
                            <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded">Iniciar Asistente</button>
                        ) : (
                            <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">Detener Asistente</button>
                        )}
                    </div>
                </div>
            </main>
            <AppFooter />
        </>
    );
}