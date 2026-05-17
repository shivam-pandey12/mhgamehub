import { useCallback, useEffect, useState } from "react";

function normalizePath(value) {
  const trimmed = String(value || "").trim();
  const normalized = trimmed ? (trimmed.startsWith("/") ? trimmed : `/${trimmed}`) : "/";
  return normalized.replace(/\/{2,}/g, "/") || "/";
}

function getCurrentPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const hashPath = window.location.hash ? window.location.hash.replace(/^#/, "") : "";
  return normalizePath(hashPath || "/");
}

export function usePathRouter() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const syncPath = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("popstate", syncPath);
    window.addEventListener("hashchange", syncPath);
    return () => {
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("hashchange", syncPath);
    };
  }, []);

  const navigate = useCallback(
    (nextPath, { replace = false } = {}) => {
      if (typeof window === "undefined") {
        return;
      }

      const normalized = normalizePath(nextPath || "/");
      if (normalized === path && !replace) {
        return;
      }

      const targetUrl = `${window.location.pathname}${window.location.search}#${normalized}`;

      if (replace) {
        window.history.replaceState({}, "", targetUrl);
      } else {
        window.history.pushState({}, "", targetUrl);
      }

      setPath(normalized);
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    },
    [path]
  );

  return {
    path,
    navigate
  };
}
