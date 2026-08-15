"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_MENUS, type NavLinkItem, type NavMenu } from "@/components/landing/navData";

type SiteNavProps = {
  scrollTo: (href: string) => void;
};

const CLOSE_DELAY_MS = 120;

export default function SiteNav({ scrollTo }: SiteNavProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobilePanelId = useId();

  const isMegaOpen = openMenuId !== null;
  const activeMenu = NAV_MENUS.find((menu) => menu.id === openMenuId) ?? null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMegaMenu = useCallback(() => {
    clearCloseTimer();
    setOpenMenuId(null);
  }, [clearCloseTimer]);

  const closeAll = useCallback(() => {
    closeMegaMenu();
    setMobileOpen(false);
    setMobileAccordion(null);
  }, [closeMegaMenu]);

  const openMegaMenu = useCallback(
    (menuId: string) => {
      clearCloseTimer();
      setOpenMenuId(menuId);
    },
    [clearCloseTimer],
  );

  const scheduleCloseMegaMenu = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const toggleMegaMenu = useCallback(
    (menuId: string) => {
      setOpenMenuId((current) => (current === menuId ? null : menuId));
    },
    [],
  );

  const handleNavLink = useCallback(
    (item: NavLinkItem, closeAfter = true) => {
      if (item.href.startsWith("mailto:")) return;
      if (item.isRoute) return;
      if (item.href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (item.href.startsWith("#")) {
        scrollTo(item.href);
      }
      if (closeAfter) closeAll();
    },
    [closeAll, scrollTo],
  );

  useEffect(() => {
    if (!isMegaOpen && !mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAll, isMegaOpen, mobileOpen]);

  useEffect(() => {
    if (!isMegaOpen) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        closeMegaMenu();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closeMegaMenu, isMegaOpen]);

  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", isMegaOpen || mobileOpen);
    return () => document.body.classList.remove("nav-menu-open");
  }, [isMegaOpen, mobileOpen]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  return (
    <>
      {isMegaOpen && (
        <div
          className="nav-backdrop hidden lg:block"
          aria-hidden="true"
          onMouseEnter={scheduleCloseMegaMenu}
        />
      )}

      <header
        ref={navRef}
        className={`site-nav sticky top-0 z-40 border-b ${isMegaOpen || mobileOpen ? "is-menu-active" : ""}`}
      >
        <nav
          className="site-nav-inner mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-6 sm:py-4"
          aria-label="Main"
        >
          <div className="flex min-w-0 flex-1 items-center lg:flex-none">
            <a
              href="#"
              className="wordmark text-[0.9375rem] text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              onClick={(e) => {
                e.preventDefault();
                closeAll();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              IndisStack
            </a>
          </div>

          <div
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            onMouseLeave={scheduleCloseMegaMenu}
          >
            {NAV_MENUS.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  type="button"
                  className={`nav-trigger px-4 py-2 text-sm tracking-[-0.01em] transition ${
                    openMenuId === menu.id
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                  aria-expanded={openMenuId === menu.id}
                  aria-haspopup="true"
                  aria-controls={`mega-menu-${menu.id}`}
                  onMouseEnter={() => openMegaMenu(menu.id)}
                  onFocus={() => openMegaMenu(menu.id)}
                  onClick={() => toggleMegaMenu(menu.id)}
                >
                  {menu.label}
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none">
            <Link
              href="/inbox"
              className="hidden text-sm tracking-[-0.01em] text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] lg:inline"
            >
              View Demo
            </Link>
            <button
              type="button"
              onClick={() => {
                closeAll();
                scrollTo("#start-building");
              }}
              className="btn-primary hidden rounded-lg border border-[var(--foreground)] bg-[var(--foreground)] px-3.5 py-2 text-sm tracking-[-0.01em] text-[var(--background)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:px-4 lg:inline-flex"
            >
              Start Building
            </button>

            <button
              type="button"
              className="nav-mobile-toggle inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground)] transition hover:border-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls={mobilePanelId}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                setMobileOpen((open) => !open);
                setMobileAccordion(null);
                closeMegaMenu();
              }}
            >
              <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </nav>

        {activeMenu && (
          <MegaMenuPanel
            menu={activeMenu}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleCloseMegaMenu}
            onNavigate={handleNavLink}
            onClose={closeMegaMenu}
          />
        )}
      </header>

      <MobileNavPanel
        id={mobilePanelId}
        open={mobileOpen}
        accordion={mobileAccordion}
        onAccordionChange={setMobileAccordion}
        onClose={closeAll}
        onNavigate={handleNavLink}
        scrollTo={scrollTo}
      />
    </>
  );
}

function MegaMenuPanel({
  menu,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  onClose,
}: {
  menu: NavMenu;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (item: NavLinkItem) => void;
  onClose: () => void;
}) {
  return (
    <div
      id={`mega-menu-${menu.id}`}
      className="mega-menu hidden lg:block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label={`${menu.label} menu`}
    >
      <div className="mega-menu-panel mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mega-menu-grid">
          <div className="mega-menu-links">
            <p className="mega-menu-category">{menu.category}</p>
            <ul className="mega-menu-list">
              {menu.items.map((item) => (
                <li key={item.label}>
                  <NavMenuLink
                    item={item}
                    className="mega-menu-link"
                    onActivate={() => {
                      onNavigate(item);
                      onClose();
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <aside className="mega-menu-featured" aria-label="Featured">
            <p className="mega-menu-featured-eyebrow">Featured</p>
            <h3 className="font-display mt-3 text-[1.35rem] leading-[1.2] tracking-[-0.02em] text-[var(--foreground)]">
              See IndisStack in action
            </h3>
            <p className="mt-3 text-sm leading-[1.65] text-[var(--muted)]">
              Explore the support inbox and see how conversations become decisions.
            </p>
            <Link
              href="/inbox"
              className="mega-menu-featured-cta mt-6 inline-flex items-center gap-1.5 text-sm font-medium tracking-[-0.01em] text-[var(--accent)] transition hover:gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              onClick={onClose}
            >
              Open Demo
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MobileNavPanel({
  id,
  open,
  accordion,
  onAccordionChange,
  onClose,
  onNavigate,
  scrollTo,
}: {
  id: string;
  open: boolean;
  accordion: string | null;
  onAccordionChange: (value: string | null) => void;
  onClose: () => void;
  onNavigate: (item: NavLinkItem) => void;
  scrollTo: (href: string) => void;
}) {
  return (
    <>
      <div
        className={`mobile-nav-backdrop lg:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={onClose}
      />

      <div
        id={id}
        className={`mobile-nav-panel lg:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-actions">
          <button
            type="button"
            onClick={() => {
              onClose();
              scrollTo("#start-building");
            }}
            className="btn-primary w-full rounded-lg border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-3 text-sm tracking-[-0.01em] text-[var(--background)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            Start Building
          </button>
          <Link
            href="/inbox"
            className="btn-secondary mt-2 flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm tracking-[-0.01em] text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            onClick={onClose}
          >
            View Demo
          </Link>
        </div>

        <div className="mobile-nav-sections">
          {NAV_MENUS.map((menu) => {
            const expanded = accordion === menu.id;
            return (
              <div key={menu.id} className="mobile-nav-section">
                <button
                  type="button"
                  className="mobile-nav-accordion-trigger"
                  aria-expanded={expanded}
                  onClick={() => onAccordionChange(expanded ? null : menu.id)}
                >
                  <span>{menu.label}</span>
                  <span className={`mobile-nav-chevron ${expanded ? "is-open" : ""}`} aria-hidden>
                    <IconChevron />
                  </span>
                </button>
                <div
                  className={`mobile-nav-accordion-panel ${expanded ? "is-open" : ""}`}
                  hidden={!expanded}
                >
                  <p className="mobile-nav-category">{menu.category}</p>
                  <ul>
                    {menu.items.map((item) => (
                      <li key={item.label}>
                        <NavMenuLink
                          item={item}
                          className="mobile-nav-link"
                          onActivate={() => onNavigate(item)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function NavMenuLink({
  item,
  className,
  onActivate,
}: {
  item: NavLinkItem;
  className: string;
  onActivate: () => void;
}) {
  const content = (
    <>
      <span className="nav-link-icon" aria-hidden>
        {item.icon}
      </span>
      <span className="nav-link-copy">
        <span className="nav-link-label">{item.label}</span>
        {item.description ? (
          <span className="nav-link-description">{item.description}</span>
        ) : null}
      </span>
    </>
  );

  if (item.isRoute) {
    return (
      <Link href={item.href} className={className} onClick={onActivate}>
        {content}
      </Link>
    );
  }

  if (item.href.startsWith("mailto:")) {
    return (
      <a href={item.href} className={className} onClick={onActivate}>
        {content}
      </a>
    );
  }

  return (
    <a
      href={item.href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onActivate();
      }}
    >
      {content}
    </a>
  );
}

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3.5 5h11M3.5 9h11M3.5 13h11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
