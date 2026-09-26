from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass
class Settings:
    base_url: str = os.getenv("IHALE_BASE_URL", "https://ihale.van.bel.tr")
    login_path: str = os.getenv("IHALE_LOGIN_PATH", "/giris-yap")
    list_path: str = os.getenv("IHALE_LIST_PATH", "/")
    username: str | None = os.getenv("IHALE_USERNAME")
    password: str | None = os.getenv("IHALE_PASSWORD")
    user_agent: str = os.getenv(
        "IHALE_USER_AGENT",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    )
    request_timeout_sec: int = int(os.getenv("IHALE_TIMEOUT", "30"))


settings = Settings()
