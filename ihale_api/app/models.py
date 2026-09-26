from pydantic import BaseModel, Field


class TenderItem(BaseModel):
    announcement_number: str | None = Field(
        default=None, description="Ilan numarasi (ornek: 3128 / 2026)"
    )
    title: str | None = Field(default=None, description="Ilan basligi")
    unit: str | None = Field(default=None, description="Ilgili birim")
    deadline: str | None = Field(default=None, description="Son basvuru metni")
    status: str | None = Field(default=None, description="Iptal vb durum")


class ListResponse(BaseModel):
    source_url: str
    count: int
    items: list[TenderItem]
