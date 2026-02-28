from __future__ import annotations

import json
from pathlib import Path

DEFAULT_COOKIES_PATH = Path.home() / ".linkedin-mcp" / "cookies.json"

CHROME_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)


class LinkedInAuth:
    def __init__(self, cookies_path: str | Path = DEFAULT_COOKIES_PATH):
        self._raw_cookies: list[dict] = []
        self._li_at: str = ""
        self._jsessionid: str = ""
        self._load(Path(cookies_path))

    def _load(self, path: Path) -> None:
        self._raw_cookies = json.loads(path.read_text())
        by_name = {c["name"]: c["value"] for c in self._raw_cookies}

        self._li_at = by_name["li_at"]
        # JSESSIONID value is wrapped in quotes: "ajax:123..." → strip them
        self._jsessionid = by_name["JSESSIONID"].strip('"')

    def get_headers(self) -> dict[str, str]:
        cookie_str = "; ".join(f"{c['name']}={c['value']}" for c in self._raw_cookies)
        return {
            "csrf-token": self._jsessionid,
            "x-li-lang": "en_US",
            "x-restli-protocol-version": "2.0.0",
            "User-Agent": CHROME_UA,
            "Cookie": cookie_str,
        }
