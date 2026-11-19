"""Generate and archive audio; read credentials only from the environment."""
import argparse
import base64
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("kind", choices=["voice", "music"])
    parser.add_argument("--take", default="v001")
    parser.add_argument("--voice-id", default="R2zfCl7xyI0UyX6zoGu4")
    args = parser.parse_args()
    if not args.take.isalnum() or not args.voice_id.isalnum():
        parser.error("Take and voice identifiers must be alphanumeric")
    credential = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not credential:
        parser.error("Set ELEVENLABS_API_KEY outside Git")
    output = ROOT / "assets" / "audio" / f"{args.kind}-{args.take}"
    if output.exists():
        parser.error("Take already exists; use a new identifier")
    if args.kind == "voice":
        text = (ROOT / "prompts" / "narration-v002.txt").read_text().strip()
        route = f"/v1/text-to-speech/{args.voice_id}/with-timestamps?output_format=mp3_44100_192"
        body = {"text": text, "model_id": "eleven_multilingual_v2", "seed": 20261119,
                "voice_settings": {"stability": 0.4, "similarity_boost": 0.75,
                                   "style": 0.25, "use_speaker_boost": True, "speed": 1.10}}
    else:
        route = "/v1/music?output_format=mp3_44100_128"
        body = {"prompt": (ROOT / "prompts" / "music-v001.txt").read_text().strip(),
                "model_id": "music_v1", "music_length_ms": 30000, "force_instrumental": True}
    encoded = json.dumps(body, ensure_ascii=False).encode()
    request = urllib.request.Request("https://api.elevenlabs.io" + route, data=encoded,
                                    headers={"xi-api-key": credential, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=240) as response:
            content = response.read()
    except urllib.error.HTTPError as error:
        raise SystemExit(f"ElevenLabs HTTP {error.code}; no automatic retry of billable generation") from None
    if args.kind == "voice":
        data = json.loads(content)
        audio = base64.b64decode(data.pop("audio_base64"), validate=True)
    else:
        data = None
        audio = content
    if not audio:
        raise SystemExit("Empty audio response")
    output.mkdir(parents=True)
    (output / "original.mp3").write_bytes(audio)
    (output / "request.json").write_bytes(encoded + b"\n")
    if data:
        (output / "alignment.json").write_text(json.dumps(data, ensure_ascii=False) + "\n")
    record = {"provider": "ElevenLabs", "createdAt": datetime.now(timezone.utc).isoformat(),
              "route": route, "model": body["model_id"], "sha256": hashlib.sha256(audio).hexdigest(),
              "reproducibility": "Use the archived MP3 for exact replay; a new generation may differ."}
    if args.kind == "voice":
        record.update(voiceId=args.voice_id)
        if args.voice_id == "R2zfCl7xyI0UyX6zoGu4":
            record["voiceName"] = "Dorian - Parisian"
    (output / "generation.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(f"Generated {args.kind}: {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
