"""Package an immutable MP4, poster, captions and a portable provenance record."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def stamp(seconds):
    millis = round(seconds * 1000)
    hours, millis = divmod(millis, 3600000)
    minutes, millis = divmod(millis, 60000)
    secs, millis = divmod(millis, 1000)
    return f'{hours:02}:{minutes:02}:{secs:02},{millis:03}'


def fingerprint(path):
    return {'path':path.relative_to(ROOT).as_posix(), 'bytes':path.stat().st_size,
            'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--render', required=True)
    parser.add_argument('--delivery', required=True)
    parser.add_argument('--check-report', type=Path)
    args = parser.parse_args()
    if not all(re.fullmatch(r'v\d{3}', value) for value in [args.render,args.delivery]):
        parser.error('Versions must look like v001')
    source = ROOT / f'renders/{args.render}/pourquivoter-instagram-{args.render}.mp4'
    destination = ROOT / 'deliveries' / args.delivery
    if destination.exists() or not source.is_file():
        parser.error('Use a new delivery identifier and an existing render')
    destination.mkdir(parents=True)
    video = destination / f'pourquivoter-instagram-{args.delivery}.mp4'
    shutil.copy2(source,video)
    subprocess.run(['ffmpeg','-v','error','-ss','29.4','-i',str(video),'-frames:v','1','-q:v','2',str(destination/'poster.jpg')],check=True)
    html = (ROOT/'index.html').read_text()
    captions = json.loads(re.search(r'window\.filmData=(\{.*?\});</script>',html,re.S)[1])['captions']
    srt = '\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n'+ ' '.join(w['text'] for w in c['words']) for i,c in enumerate(captions))+'\n'
    (destination/'narration.srt').write_text(srt)
    probe = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels','-of','json',str(video)]))
    vs = next(s for s in probe['streams'] if s.get('width'))
    assert (vs['width'],vs['height'],vs['r_frame_rate'],vs['pix_fmt']) == (1080,1920,'30/1','yuv420p')
    assert abs(float(probe['format']['duration'])-30)<.05
    subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True)
    loudness = subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
    measurement = json.loads(loudness[loudness.rfind('{'):])
    assert float(measurement['input_tp'])<-.8
    checks = None
    if args.check_report:
        report = args.check_report.read_text()
        report = json.loads(report[report.index('{'):])
        if not report['ok']:
            raise SystemExit('Hyperframes check must pass before packaging')
        checks = {k:{key:value.get(key) for key in ['ok','enabled','errorCount','warningCount'] if key in value}
                  for k,value in report.items() if isinstance(value,dict) and 'errorCount' in value}
    inputs=[]
    for folder in ['assets','prompts','scripts']:
        inputs.extend(fingerprint(p) for p in sorted((ROOT/folder).rglob('*')) if p.is_file() and '__pycache__' not in p.parts)
    for name in ['composition.html.in','film.css','film.js','index.html','package.json','package-lock.json']:
        inputs.append(fingerprint(ROOT/name))
    record = {'id':'pourquivoter-instagram-'+args.delivery, 'createdAt':datetime.now(timezone.utc).isoformat(),
              'sourceRender':args.render, 'format':probe,
              'audio':{'integratedLUFS':float(measurement['input_i']), 'truePeakDBTP':float(measurement['input_tp']), 'loudnessRangeLU':float(measurement['input_lra'])},
              'hyperframes':checks, 'inputs':inputs,
              'outputs':[fingerprint(p) for p in sorted(destination.iterdir()) if p.is_file()]}
    (destination/'manifest.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    print('Packaged',video.relative_to(ROOT),'with poster, captions and SHA-256 manifest')


if __name__=='__main__':
    main()
