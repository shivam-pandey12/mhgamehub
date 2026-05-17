const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Rules", path: "/rules" },
  { label: "Practice", path: "/practice" },
  { label: "Online", path: "/online" }
];

function isActivePath(currentPath, targetPath) {
  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

export default function SiteNav({ currentPath, onNavigate, onToggleTheme, theme }) {
  return (
    <header className="site-nav panel">
      <button className="site-brand" onClick={() => onNavigate("/")} type="button">
        <span className="site-brand__eyebrow">powered by MH HORIZON</span>
        <span className="site-brand__title">Chopsticks 3D Arena</span>
      </button>

      <nav className="site-nav__links" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            className={`site-nav__link ${isActivePath(currentPath, item.path) ? "site-nav__link--active" : ""}`}
            key={item.path}
            onClick={() => onNavigate(item.path)}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <button className="site-nav__link" onClick={onToggleTheme} type="button">
          Theme: {theme === "light" ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}
