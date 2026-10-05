"""Aggregate public/data/india/district_transactions.parquet into src/data/indiaData.json.

Run from the project root:  python scripts/prepare-india-data.py
Uses pandas+pyarrow when installed, otherwise falls back to scripts/pqread.py (pure Python).
Source is district-level AGGREGATE UPI transaction data (state/district/quarter).
It is not merchant-level data and carries no fraud labels.
"""
import json, sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public' / 'data' / 'india' / 'district_transactions.parquet'
OUT = ROOT / 'src' / 'data' / 'indiaData.json'

def load(path):
    try:
        import pandas as pd
        return pd.read_parquet(path).to_dict('list')
    except Exception as exc:
        print(f'pandas/pyarrow unavailable ({exc.__class__.__name__}); using scripts/pqread.py')
        sys.path.insert(0, str(Path(__file__).parent))
        import pqread
        cols, _ = pqread.read(str(path))
        return cols

if not SRC.exists():
    OUT.write_text(json.dumps({'ready': False, 'error': f'Missing {SRC.relative_to(ROOT)}'}, indent=2))
    print('India data missing:', SRC); sys.exit(0)

c = load(SRC)
n = len(c['year'])
rows = [dict(y=int(c['year'][i]), q=int(c['quarter'][i]), state=c['state_clean'][i], district=c['district_clean'][i],
             region=c['region'][i], cnt=int(c['transaction_count'][i]), amt=float(c['transaction_amount'][i])) for i in range(n)]

quarters = sorted({(r['y'], r['q']) for r in rows})
last_y = max(r['y'] for r in rows)
label = lambda y, q: f'{y}-Q{q}'
r2 = lambda v: round(v, 2)

national = []
for y, q in quarters:
    sub = [r for r in rows if r['y'] == y and r['q'] == q]
    cnt = sum(r['cnt'] for r in sub); amt = sum(r['amt'] for r in sub)
    national.append(dict(quarter=label(y, q), count=cnt, amount=r2(amt), avgTicket=r2(amt / max(1, cnt)), districts=len(sub)))

def year_totals(year):
    d = defaultdict(lambda: [0, 0.0])
    for r in rows:
        if r['y'] == year:
            d[r['state']][0] += r['cnt']; d[r['state']][1] += r['amt']
    return d

cur, prev = year_totals(last_y), year_totals(last_y - 1)
region_of = {r['state']: r['region'] for r in rows}
nat_amt = sum(v[1] for v in cur.values()) or 1
states = []
for s, (cnt, amt) in cur.items():
    pamt = prev.get(s, [0, 0.0])[1]
    states.append(dict(state=s, region=region_of[s], count=cnt, amount=r2(amt), avgTicket=r2(amt / max(1, cnt)),
                       yoyGrowthPct=r2((amt - pamt) / pamt * 100) if pamt else None, shareOfNationalPct=r2(amt / nat_amt * 100)))
states.sort(key=lambda x: -x['amount'])

reg = defaultdict(lambda: [0, 0.0])
for r in rows:
    if r['y'] == last_y: reg[r['region']][0] += r['cnt']; reg[r['region']][1] += r['amt']
regions = sorted([dict(region=k, count=v[0], amount=r2(v[1]), shareOfNationalPct=r2(v[1] / nat_amt * 100)) for k, v in reg.items()], key=lambda x: -x['amount'])

dist = defaultdict(lambda: [0, 0.0])
for r in rows:
    if r['y'] == last_y: k = (r['state'], r['district']); dist[k][0] += r['cnt']; dist[k][1] += r['amt']
topDistricts = sorted([dict(state=k[0], district=k[1], count=v[0], amount=r2(v[1]), avgTicket=r2(v[1] / max(1, v[0]))) for k, v in dist.items()], key=lambda x: -x['amount'])[:15]

out = dict(ready=True, source='District-level India UPI transactions (state / district / quarter aggregates)',
           note='Aggregate payment data. Not merchant-level transactions and not fraud labels. Amounts as provided in the source file (INR).',
           summary=dict(rows=n, firstQuarter=label(*quarters[0]), lastQuarter=label(*quarters[-1]), latestYear=last_y,
                        states=len({r['state'] for r in rows}), districts=len({(r['state'], r['district']) for r in rows}),
                        totalCount=sum(r['cnt'] for r in rows), totalAmount=r2(sum(r['amt'] for r in rows))),
           national=national, states=states, regions=regions, topDistricts=topDistricts,
           generatedAt=datetime.now(timezone.utc).isoformat())
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out))
print(f'Parakh India: {n:,} rows, {out["summary"]["states"]} states, {out["summary"]["districts"]} districts, {out["summary"]["firstQuarter"]} to {out["summary"]["lastQuarter"]}')
