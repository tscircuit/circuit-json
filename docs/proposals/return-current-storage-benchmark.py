import gzip
import json
import math
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).parent
CHANNELS = ('sheetCurrentXReal', 'sheetCurrentXImag', 'sheetCurrentYReal', 'sheetCurrentYImag')

def measure(path):
    reference = json.loads(path.read_text())
    columns, rows = reference['columns'], reference['rows']
    count = columns * rows
    # These saved cases start at the bottom-left occupied cell.
    min_x = min(s['x'] for s in reference['samples']) - reference['cellWidth'] / 2
    min_y = min(s['y'] for s in reference['samples']) - reference['cellHeight'] / 2
    arrays = [[None] * count for _ in CHANNELS]
    for sample in reference['samples']:
        column = round((sample['x'] - min_x) / reference['cellWidth'] - 0.5)
        row = round((sample['y'] - min_y) / reference['cellHeight'] - 0.5)
        assert 0 <= column < columns and 0 <= row < rows
        index = row * columns + column
        assert arrays[0][index] is None
        for channel, key in enumerate(CHANNELS):
            value = sample[key]
            assert math.isfinite(value)
            arrays[channel][index] = value
    names = ('sheet_current_x_real', 'sheet_current_x_imag', 'sheet_current_y_real', 'sheet_current_y_imag')
    payload = json.dumps(dict(field_type="complex_phasor", **dict(zip(names, arrays))), separators=(',', ':'), allow_nan=False).encode()
    # Same fields, rounded to Float32 first: separates precision from storage effects.
    rounded = [[None if v is None else struct.unpack('<f', struct.pack('<f', v))[0] for v in a] for a in arrays]
    rounded_json = json.dumps(dict(field_type="complex_phasor", **dict(zip(names, rounded))), separators=(',', ':'), allow_nan=False).encode()
    bitmap = bytearray((count + 7) // 8)
    packed = bytearray()
    for index in range(count):
        if arrays[0][index] is not None:
            bitmap[index // 8] |= 1 << (index % 8)
            packed.extend(struct.pack('<ffff', *(a[index] for a in arrays)))
    binary = bytes(bitmap + packed)
    compress = lambda data: gzip.compress(data, compresslevel=6, mtime=0)
    zipped = compress(payload)
    assert gzip.decompress(zipped) == payload
    assert json.loads(gzip.decompress(zipped)) == dict(field_type="complex_phasor", **dict(zip(names, arrays)))
    assert len(binary) == len(bitmap) + len(reference['samples']) * 16
    return dict(case=path.stem, grid_cells=count, occupied_cells=len(reference['samples']),
                json_bytes=len(payload), json_gzip_bytes=len(zipped),
                float32_json_gzip_bytes=len(compress(rounded_json)),
                float32_bytes=len(binary), float32_gzip_bytes=len(compress(binary)),
                json_gzip_base64_bytes=4*((len(zipped)+2)//3))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('Usage: python return-current-storage-benchmark.py explicit-ports-reference.json multilayer-reference.json')
    print(json.dumps([measure(Path(path)) for path in sys.argv[1:]], indent=2))
