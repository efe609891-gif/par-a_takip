from app.scraper import IhaleClient


def test_parse_tender_list() -> None:
    html = """
    <html>
      <body>
        <h6>İlan Numarası: 3128 / 2026</h6>
        <h3>UPS GÜÇ KAYNAĞI ALIMI</h3>
        <p>İTFAİYE DAİRESİ BAŞKANLIĞI / İTFAİYE MÜDAHALE ŞUBE MÜDÜRLÜĞÜ</p>
        <span>Son Başvuru 25 Eylül 2026 14:00</span>
        <h6>İlan Numarası: 3127 / 2026</h6>
        <h3>PARK VE BAHÇELER DAİRESİ BAŞKANLIĞI / BAKIM ONARIM ŞUBE MÜDÜRLÜĞÜ</h3>
        <span>Bu İlan İptal Edilmiştir.</span>
        <span>Son Başvuru 24 Eylül 2026 14:00</span>
      </body>
    </html>
    """
    client = IhaleClient()
    items = client.parse_tender_list(html)
    assert len(items) == 2
    assert items[0].announcement_number == "3128 / 2026"
    assert items[0].title == "UPS GÜÇ KAYNAĞI ALIMI"
    assert "Son Başvuru" in (items[0].deadline or "")
    assert items[1].status == "Bu İlan İptal Edilmiştir."
