# Van Ihale API (ornek entegrasyon)

Bu proje, `https://ihale.van.bel.tr/` uzerindeki ilan listesini JSON API olarak sunmak icin hazir bir iskelet saglar.

## Ozellikler

- FastAPI tabanli endpointler
- Opsiyonel login (session/cookie ile)
- Ilan listesini HTML'den parse ederek JSON'a cevirme
- Query parametrelerini kaynak siteye aynen iletme

## Kurulum

```bash
cd ihale_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Calistirma

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpointler

- `GET /health`
- `GET /login-test?username=...&password=...`
- `GET /ilanlar`
  - `use_auth=true` verirseniz login denenir.
  - `username`/`password` query ile verilebilir (veya `.env` icinden okunur).
  - Diger tum query parametreleri hedef siteye forward edilir.

### Ornekler

```bash
# Public liste cek
curl "http://localhost:8000/ilanlar"

# Login ile liste cek
curl "http://localhost:8000/ilanlar?use_auth=true&username=KULLANICI&password=SIFRE"

# Kaynak siteye filtre parametresi gonder
curl "http://localhost:8000/ilanlar?ilanTuru=dogrudan-temin&iknYili=2026"
```

## Notlar

- Hedef sitenin login form alan adlari degisirse `app/scraper.py` icindeki otomatik alan tespitini guncellemek gerekebilir.
- Bu iskelet, resmi bir API olmadigi durumda entegrasyon ihtiyacini karsilamak icin hazirlanmistir.
