"""Edit the archived narration into a 30-second, word-aligned soundtrack."""
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/audio/edit-v001'
SPEED = 0.90
START = 0.20
GAPS = [0.45, 0.35, 0.55, 0.32, 0.32, 0.40, 0.38, 0.45, 0.40, 0.40]
PHRASES = ["Des milliers", "Moi,", "Alors", "Tu choisis", "tu sélectionnes", "et tu compares",
           "Un résumé", "Les détails", "L'IA", "Pour qui voter, point", "Fais-toi"]


def run(args):
    subprocess.run(args, check=True)


def main():
    if OUT.exists():
        raise SystemExit('Edit v001 exists; use a new version before changing delivered audio')
    OUT.mkdir(parents=True)
    original = ROOT / 'assets/audio/voice-v001/original.mp3'
    alignment = json.loads((ROOT / 'assets/audio/voice-v001/alignment.json').read_text())
    a = alignment.get('normalized_alignment') or alignment['alignment']
    text = ''.join(a['characters'])
    indexes = [text.index(phrase) for phrase in PHRASES]
    starts, ends = a['character_start_times_seconds'], a['character_end_times_seconds']
    duration = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(original)]))
    cuts = [0.0]
    for index in indexes[1:]:
        previous = index - 1
        while previous > 0 and text[previous].isspace():
            previous -= 1
        cuts.append((ends[previous]+starts[index])/2)
    cuts.append(duration)
    timing = []
    clock = START
    for i in range(len(PHRASES)):
        timing.append({'text':text[indexes[i]:indexes[i+1] if i+1<len(indexes) else len(text)].strip(),
                       'start':round(clock,4),'sourceStart':cuts[i],'sourceEnd':cuts[i+1]})
        clock += (cuts[i+1]-cuts[i])/SPEED + (GAPS[i] if i<len(GAPS) else 0)
    if clock > 29.4:
        raise SystemExit(f'Narration ends at {clock:.2f}; adjust the edit explicitly')
    words=[]
    for match in re.finditer(r'\S+',text):
        segment=max(i for i in range(len(PHRASES)) if cuts[i]<=starts[match.start()])
        words.append({'text':match.group(),
          'start':round(timing[segment]['start']+(starts[match.start()]-cuts[segment])/SPEED,4),
          'end':round(timing[segment]['start']+(ends[match.end()-1]-cuts[segment])/SPEED,4)})
    filters=['[0:a]asplit='+str(len(PHRASES))+''.join(f'[v{i}]' for i in range(len(PHRASES)))]
    order=[]
    filters.append(f'anullsrc=r=48000:cl=stereo,atrim=duration={START}[lead]');order.append('[lead]')
    for i in range(len(PHRASES)):
        filters.append(f'[v{i}]atrim=start={cuts[i]}:end={cuts[i+1]},asetpts=PTS-STARTPTS,atempo={SPEED},aresample=48000,aformat=channel_layouts=stereo[p{i}]');order.append(f'[p{i}]')
        if i<len(GAPS):
            filters.append(f'anullsrc=r=48000:cl=stereo,atrim=duration={GAPS[i]}[s{i}]');order.append(f'[s{i}]')
    filters.append(''.join(order)+f'concat=n={len(order)}:v=0:a=1,apad,atrim=duration=30,loudnorm=I=-16:TP=-2:LRA=7,aresample=48000[voice]')
    run(['ffmpeg','-v','error','-i',str(original),'-filter_complex',';'.join(filters),'-map','[voice]','-c:a','pcm_s16le',str(OUT/'voice.wav')])
    music=ROOT/'assets/audio/music-v001/original.mp3'
    # Keep the bed subordinate to the creator voice; a little more air after narration.
    mix="[0:a]anull[v];[1:a]atrim=duration=30,loudnorm=I=-27:TP=-5:LRA=8,aresample=48000,afade=t=in:d=0.25,afade=t=out:st=28.3:d=1.7[m];[v][m]amix=inputs=2:normalize=0,alimiter=limit=0.89:level=0,atrim=duration=30[out]"
    run(['ffmpeg','-v','error','-i',str(OUT/'voice.wav'),'-i',str(music),'-filter_complex',mix,'-map','[out]','-ar','48000','-c:a','pcm_s16le',str(OUT/'mix.wav')])
    data={'duration':30,'narrationEnd':round(clock,3),'tempo':SPEED,'lead':START,'gaps':GAPS,'phrases':timing,'words':words}
    (OUT/'timeline.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print('Narration end:',round(clock,2),'seconds; music resolves at 30 seconds')


if __name__=='__main__':
    main()
