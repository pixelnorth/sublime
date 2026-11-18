// Transcription Whisper 100 % locale (WebGPU si dispo, sinon WASM).
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';

const models = {};
const post = (m) => self.postMessage(m);

async function load(model) {
  const progress_callback = (p) => {
    if (p.status === 'progress') post({ type: 'progress', text: `Téléchargement du modèle (une seule fois)… ${Math.round(p.progress)} %`, value: p.progress });
  };
  if (navigator.gpu) {
    // Gros modèle : encodeur en fp16 pour tenir en mémoire GPU ; sinon fp32, plus sûr
    const big = model.includes('large');
    for (const enc of big ? ['fp16', 'q4'] : ['fp32']) {
      try {
        return await pipeline('automatic-speech-recognition', model, {
          device: 'webgpu', dtype: { encoder_model: enc, decoder_model_merged: 'q4' }, progress_callback,
        });
      } catch { /* essai suivant */ }
    }
  }
  return pipeline('automatic-speech-recognition', model, { dtype: 'q8', progress_callback });
}

self.onmessage = async ({ data: { audio, model, lang } }) => {
  try {
    models[model] ??= await load(model);
    post({ type: 'progress', text: 'Transcription en cours…', value: 100 });
    const opts = { task: 'transcribe', chunk_length_s: 30, stride_length_s: 5, language: lang || undefined };
    let out, word = true;
    try {
      out = await models[model](audio, { ...opts, return_timestamps: 'word' });
    } catch {
      word = false; // modèle sans timestamps par mot : timestamps par phrase
      out = await models[model](audio, { ...opts, return_timestamps: true });
    }
    post({ type: 'done', chunks: out.chunks, word });
  } catch (e) {
    post({ type: 'error', text: String(e?.message || e) });
  }
};
