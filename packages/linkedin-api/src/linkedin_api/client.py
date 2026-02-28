from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from urllib.parse import quote

from curl_cffi import requests as curl_requests

from .auth import DEFAULT_COOKIES_PATH, LinkedInAuth

BASE_URL = "https://www.linkedin.com/voyager/api"
DEFAULT_CACHE_PATH = Path.home() / ".linkedin-mcp" / "profile_cache.json"


class LinkedInClient:
    """LinkedIn Voyager API client using curl_cffi for Chrome TLS impersonation."""

    def __init__(self, cookies_path: str | Path = DEFAULT_COOKIES_PATH):
        self._auth = LinkedInAuth(cookies_path)
        self._session = curl_requests.Session(impersonate="chrome")
        self._session.headers.update(self._auth.get_headers())
        self._profile_urn: str | None = None

    def _get(self, endpoint: str, params: dict[str, Any] | None = None) -> Any:
        resp = self._session.get(
            f"{BASE_URL}{endpoint}",
            params=params,
            allow_redirects=False,
        )
        if resp.status_code in (302, 401, 403):
            raise PermissionError(
                f"LinkedIn API returned {resp.status_code}. "
                "Cookies may be expired — refresh via linkedin-scraper-mcp."
            )
        resp.raise_for_status()
        return resp.json()

    def _post(self, endpoint: str, payload: dict[str, Any]) -> Any:
        resp = self._session.post(
            f"{BASE_URL}{endpoint}",
            json=payload,
            allow_redirects=False,
        )
        if resp.status_code in (302, 401, 403):
            raise PermissionError(
                f"LinkedIn API returned {resp.status_code}. "
                "Cookies may be expired — refresh via linkedin-scraper-mcp."
            )
        resp.raise_for_status()
        if resp.content:
            return resp.json()
        return None

    def _partial_update(
        self, endpoint: str, key: str, payload: dict[str, Any]
    ) -> Any:
        """REST-li PARTIAL_UPDATE: POST with X-RestLi-Method header."""
        url = f"{BASE_URL}{endpoint}/{quote(key, safe='')}"
        resp = self._session.post(
            url,
            json=payload,
            headers={"X-RestLi-Method": "PARTIAL_UPDATE"},
            allow_redirects=False,
        )
        if resp.status_code in (302, 401, 403):
            raise PermissionError(
                f"LinkedIn API returned {resp.status_code}. "
                "Cookies may be expired — refresh via linkedin-scraper-mcp."
            )
        resp.raise_for_status()
        if resp.content:
            return resp.json()
        return None

    def _delete(self, endpoint: str, key: str) -> None:
        """REST-li DELETE on a keyed resource."""
        url = f"{BASE_URL}{endpoint}/{quote(key, safe='')}"
        resp = self._session.delete(url, allow_redirects=False)
        if resp.status_code in (302, 401, 403):
            raise PermissionError(
                f"LinkedIn API returned {resp.status_code}. "
                "Cookies may be expired — refresh via linkedin-scraper-mcp."
            )
        resp.raise_for_status()

    def me(self) -> dict[str, Any]:
        data = self._get("/me")
        self._profile_urn = data["miniProfile"]["dashEntityUrn"]
        _save_cache({"profile_urn": self._profile_urn})
        return data

    def get_profile_urn(self) -> str:
        """Return profile URN from memory, disk cache, or /me API call."""
        if self._profile_urn is None:
            cached = _load_cache()
            if cached and "profile_urn" in cached:
                self._profile_urn = cached["profile_urn"]
            else:
                self.me()
        return self._profile_urn  # type: ignore[return-value]

    def close(self) -> None:
        self._session.close()

    def __enter__(self) -> LinkedInClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()


def _load_cache() -> dict[str, Any] | None:
    try:
        return json.loads(DEFAULT_CACHE_PATH.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def _save_cache(data: dict[str, Any]) -> None:
    DEFAULT_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    DEFAULT_CACHE_PATH.write_text(json.dumps(data))
