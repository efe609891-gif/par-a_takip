from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query, Request

from app.config import settings
from app.models import ListResponse
from app.scraper import IhaleClient


app = FastAPI(
    title="Van Ihale API",
    description=(
        "ihale.van.bel.tr uzerindeki ilanlari JSON formatinda cekmek icin "
        "hazirlanmis ornek entegrasyon."
    ),
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ilanlar", response_model=ListResponse)
def list_tenders(
    request: Request,
    use_auth: bool = Query(default=False, description="True ise giris yapip veriyi ceker."),
    username: str | None = Query(default=None, description="Opsiyonel kullanici adi"),
    password: str | None = Query(default=None, description="Opsiyonel sifre"),
) -> ListResponse:
    client = IhaleClient()

    if use_auth:
        resolved_user = username or settings.username
        resolved_password = password or settings.password
        if not resolved_user or not resolved_password:
            raise HTTPException(
                status_code=400,
                detail=(
                    "use_auth=true icin username/password gerekli. "
                    "Bunlari query ile veya .env icinde verebilirsiniz."
                ),
            )
        try:
            client.login(resolved_user, resolved_password)
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=401, detail=f"Giris basarisiz: {exc}") from exc

    query_params = dict(request.query_params)
    for internal_param in ("use_auth", "username", "password"):
        query_params.pop(internal_param, None)

    try:
        html = client.fetch_tender_html(query_params=query_params)
        items = client.parse_tender_list(html)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Kaynak verisi cekilemedi: {exc}") from exc

    source_url = settings.base_url.rstrip("/") + "/" + settings.list_path.lstrip("/")
    return ListResponse(source_url=source_url, count=len(items), items=items)


@app.get("/login-test")
def login_test(
    username: str | None = Query(default=None),
    password: str | None = Query(default=None),
) -> dict[str, str]:
    resolved_user = username or settings.username
    resolved_password = password or settings.password
    if not resolved_user or not resolved_password:
        raise HTTPException(status_code=400, detail="username/password gerekli")

    client = IhaleClient()
    try:
        client.login(resolved_user, resolved_password)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=401, detail=f"Giris basarisiz: {exc}") from exc
    return {"status": "login_ok"}
