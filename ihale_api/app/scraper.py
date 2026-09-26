from __future__ import annotations

import re
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from app.config import settings
from app.models import TenderItem


ANNOUNCEMENT_RE = re.compile(r"Ilan Numarasi|İlan Numarası", re.IGNORECASE)


class IhaleClient:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": settings.user_agent})

    def _abs_url(self, path: str) -> str:
        return urljoin(settings.base_url.rstrip("/") + "/", path.lstrip("/"))

    def _guess_form_fields(self, form: BeautifulSoup) -> tuple[str | None, str | None]:
        user_field: str | None = None
        pass_field: str | None = None
        for input_tag in form.select("input[name]"):
            field_name = input_tag.get("name", "").lower()
            input_type = (input_tag.get("type") or "").lower()
            if input_type == "password" and not pass_field:
                pass_field = input_tag["name"]
            if any(x in field_name for x in ["user", "mail", "eposta", "email", "kullanici", "tc"]):
                user_field = input_tag["name"]
        return user_field, pass_field

    def login(self, username: str, password: str) -> None:
        login_url = self._abs_url(settings.login_path)
        response = self.session.get(login_url, timeout=settings.request_timeout_sec)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "lxml")
        form = soup.find("form")
        if form is None:
            raise RuntimeError("Giris formu bulunamadi. login_path degerini kontrol edin.")

        payload: dict[str, str] = {}
        for hidden_input in form.select("input[name]"):
            field_name = hidden_input.get("name")
            if not field_name:
                continue
            payload[field_name] = hidden_input.get("value", "")

        user_field, pass_field = self._guess_form_fields(form)
        if not user_field or not pass_field:
            raise RuntimeError(
                "Kullanici/sifre alanlari otomatik tespit edilemedi. "
                "Form alan isimlerini sabitlemek icin kodu guncelleyin."
            )

        payload[user_field] = username
        payload[pass_field] = password

        action = form.get("action") or settings.login_path
        submit_url = self._abs_url(action)
        post_resp = self.session.post(
            submit_url,
            data=payload,
            timeout=settings.request_timeout_sec,
            allow_redirects=True,
        )
        post_resp.raise_for_status()

        if "giris yap" in post_resp.text.lower() and "cikis" not in post_resp.text.lower():
            raise RuntimeError("Giris islemi basarisiz gozukuyor. Kimlik bilgilerini kontrol edin.")

    def fetch_tender_html(self, query_params: dict[str, str] | None = None) -> str:
        list_url = self._abs_url(settings.list_path)
        response = self.session.get(
            list_url,
            params=query_params or {},
            timeout=settings.request_timeout_sec,
        )
        response.raise_for_status()
        return response.text

    def parse_tender_list(self, html: str) -> list[TenderItem]:
        soup = BeautifulSoup(html, "lxml")
        lines = [text.strip() for text in soup.stripped_strings if text and text.strip()]

        blocks: list[list[str]] = []
        current_block: list[str] = []
        for line in lines:
            if ANNOUNCEMENT_RE.search(line):
                if current_block:
                    blocks.append(current_block)
                current_block = [line]
                continue
            if current_block:
                current_block.append(line)
        if current_block:
            blocks.append(current_block)

        results: list[TenderItem] = []
        for block in blocks:
            announcement_number: str | None = None
            title: str | None = None
            unit: str | None = None
            deadline: str | None = None
            status: str | None = None

            first_line = block[0]
            if ":" in first_line:
                announcement_number = first_line.split(":", 1)[1].strip()
            else:
                announcement_number = first_line.strip()

            for entry in block[1:]:
                low = entry.lower()
                if "son başvuru" in low or "son basvuru" in low:
                    deadline = entry
                    continue
                if "iptal" in low:
                    status = entry
                    continue
                if unit is None and ("/" in entry or "başkanlığ" in low or "baskanlig" in low):
                    unit = entry
                    continue
                if title is None:
                    title = entry

            results.append(
                TenderItem(
                    announcement_number=announcement_number,
                    title=title,
                    unit=unit,
                    deadline=deadline,
                    status=status,
                )
            )

        return results
