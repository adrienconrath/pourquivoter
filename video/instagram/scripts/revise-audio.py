"""Produce edit-v002 from the archived voice, omitting the spoken URL suffix.

The original take remains immutable. No synthesis request or credential is needed.
"""
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/audio/edit-v002'
SOURCE = ROOT / 'assets/audio/edit-v001/voice.wav'
MUSIC = ROOT / 'assets/audio/music-v001/original.mp3'
# Word alignment: voter ends 23.9311; point starts 24.1111; I ends 25.4145.
START, END = 24.02, 25.55


def main():
    if OUT.exists():
        raise SystemExit('Edit v002 exists; use another version for further changes')
    OUT.mkdir(parents=True)
    filters = (
        f'[0:a]asplit=2[a][b];[a]atrim=end={START},asetpts=PTS-STARTPTS,'
        f'afade=t=out:st={START-.03}:d=0.03[first];'
        f'anullsrc=r=48000:cl=stereo,atrim=duration={END-START}[silence];'
        f'[b]atrim=start={END},asetpts=PTS-STARTPTS,afade=t=in:d=0.03[last];'
        '[first][silence][last]concat=n=3:v=0:a=1,atrim=duration=30[out]'
    )
    subprocess.run(['ffmpeg','-v','error','-i',str(SOURCE),'-filter_complex',filters,
                    '-map','[out]','-ar','48000','-c:a','pcm_s16le',str(OUT/'voice.wav')],check=True)
    mix = ('[0:a]anull[v];[1:a]atrim=duration=30,loudnorm=I=-27:TP=-5:LRA=8,'
           'aresample=48000,afade=t=in:d=0.25,afade=t=out:st=28.3:d=1.7[m];'
           '[v][m]amix=inputs=2:normalize=0,alimiter=limit=0.89:level=0,atrim=duration=30[out]')
    subprocess.run(['ffmpeg','-v','error','-i',str(OUT/'voice.wav'),'-i',str(MUSIC),
                    '-filter_complex',mix,'-map','[out]','-ar','48000','-c:a','pcm_s16le',str(OUT/'mix.wav')],check=True)
    timing = json.loads((SOURCE.parent/'timeline.json').read_text())
    timing['phrases'][-2]['text'] = 'Pour qui voter.'
    timing['words'] = [w for w in timing['words'] if not START <= w['start'] < END]
    for word in timing['words']:
        if word['text']=='voter,': word['text']='voter.'
    timing['revision'] = {'source':'assets/audio/edit-v001/voice.wav',
        'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        'silencedInterval':[START,END], 'fadeSeconds':.03,
        'reason':'Supprimer « point F Y I » ; conserver le nom oral Pour qui voter et afficher le domaine à l’écran.',
        'newSynthesis':False}
    (OUT/'timeline.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2)+'\n')
    print('Edit v002 ready: spoken suffix omitted, music and 30-second timing preserved')


if __name__=='__main__': main()
