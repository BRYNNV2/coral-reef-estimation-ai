import requests
from pathlib import Path
import base64

img_path = Path('dataset/test/39_631_0_jpg.rf.f211c3da9c632416ed7d5e7b1b3d86ac.jpg')
url = 'http://localhost:8000/api/v1/predict'

with open(img_path, 'rb') as f:
    files = {'file': (img_path.name, f, 'image/jpeg')}
    print(f'Mengirim gambar {img_path.name} ke API...')
    resp = requests.post(url, files=files)

if resp.status_code == 200:
    response_json = resp.json()
    data = response_json['data']
    print('SUCCESS!')
    print(f"- Persentase Karang Rusak: {data['damage_percentage']}%")
    
    # Save the overlay base64 to an actual image file so we can see it
    overlay_data = base64.b64decode(data['overlay_base64'])
    out_path = Path('test_output_overlay.jpg')
    with open(out_path, 'wb') as f:
        f.write(overlay_data)
    print(f"- Gambar hasil scan disimpan di: {out_path.absolute()}")
else:
    print('ERROR:', resp.status_code, resp.text)
