"use client";


import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CommandCategory = "navigation" | "action" | "external";

interface Command {
  id: string;
  label: string;
  description?: string;
  shortcut?: string; // display only
  category: CommandCategory;
  icon: string;
  action: () => void;
  keywords?: string[];
}

interface SearchResult {
  command: Command;
  score: number;
}

type PaletteState = {
  open: boolean;
  query: string;
  selectedIndex: number;
  results: SearchResult[];
  recentIds: string[];
};

type PaletteAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_QUERY"; query: string; results: SearchResult[] }
  | { type: "MOVE"; direction: 1 | -1 }
  | { type: "SELECT_INDEX"; index: number }
  | { type: "ADD_RECENT"; id: string };

// ─── Bitap Fuzzy Search (O(m * text.length), m = pattern length ≤ 31) ────────

function bitapSearch(text: string, pattern: string): number {
  if (!pattern) return 1;
  if (pattern.length > 31) pattern = pattern.slice(0, 31);

  const m = pattern.length;
  const n = text.length;

  if (m === 0) return 1;
  if (n === 0) return 0;

  // Build character bitmask
  const mask: Record<string, number> = {};
  for (let i = 0; i < m; i++) {
    mask[pattern[i]] = (mask[pattern[i]] || 0) | (1 << i);
  }

  let R = ~1; // state register
  for (let j = 0; j < n; j++) {
    R |= ~(mask[text[j]] || 0);
    R |= (R << 1);
    if ((R & (1 << m)) === 0) {
      // Exact match found; score = proximity to start
      const matchPos = j - m + 1;
      return 0.9 - (matchPos / n) * 0.3;
    }
  }

  // No exact bitap match — fallback to character coverage score
  let matched = 0;
  let pi = 0;
  for (let i = 0; i < n && pi < m; i++) {
    if (text[i] === pattern[pi]) { matched++; pi++; }
  }
  return pi === m ? (0.5 * matched) / m : 0;
}

function scoreCommand(cmd: Command, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = cmd.label.toLowerCase();
  const desc = (cmd.description || "").toLowerCase();
  const keys = (cmd.keywords || []).join(" ").toLowerCase();
  const corpus = `${label} ${desc} ${keys}`;

  // Exact match
  if (label === q) return 2;
  // Prefix match
  if (label.startsWith(q)) return 1.8;
  // Contains
  if (label.includes(q)) return 1.5;
  // Bitap on full corpus
  const s = bitapSearch(corpus, q);
  return s;
}

// ─── Trie-based Shortcut Engine ───────────────────────────────────────────────

interface TrieNode {
  children: Map<string, TrieNode>;
  action?: () => void;
}

class ShortcutTrie {
  private root: TrieNode = { children: new Map() };
  private pendingKeys: string[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly TIMEOUT = 1000; // ms between key presses in a sequence

  register(sequence: string[], action: () => void) {
    let node = this.root;
    for (const key of sequence) {
      if (!node.children.has(key)) node.children.set(key, { children: new Map() });
      node = node.children.get(key)!;
    }
    node.action = action;
  }

  feed(key: string): boolean {
    if (this.timer) clearTimeout(this.timer);

    this.pendingKeys.push(key);

    let node = this.root;
    for (const k of this.pendingKeys) {
      if (!node.children.has(k)) {
        // Dead end — reset
        this.pendingKeys = [];
        return false;
      }
      node = node.children.get(k)!;
    }

    if (node.action) {
      node.action();
      this.pendingKeys = [];
      return true;
    }

    // Partial match — wait for more keys
    this.timer = setTimeout(() => { this.pendingKeys = []; }, this.TIMEOUT);
    return false;
  }

  reset() {
    this.pendingKeys = [];
    if (this.timer) clearTimeout(this.timer);
  }
}

// ─── MRU Cache ────────────────────────────────────────────────────────────────

const MRU_KEY = "kb_recent_commands";
const MRU_MAX = 5;

function loadMRU(): string[] {
  try { return JSON.parse(localStorage.getItem(MRU_KEY) || "[]"); }
  catch { return []; }
}

function saveMRU(ids: string[]) {
  try { localStorage.setItem(MRU_KEY, JSON.stringify(ids)); }
  catch {}
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function paletteReducer(state: PaletteState, action: PaletteAction): PaletteState {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true, query: "", selectedIndex: 0 };
    case "CLOSE":
      return { ...state, open: false, query: "", selectedIndex: 0 };
    case "SET_QUERY":
      return {
        ...state,
        query: action.query,
        results: action.results,
        selectedIndex: 0,
      };
    case "MOVE": {
      const len = state.results.length;
      if (!len) return state;
      const next = (state.selectedIndex + action.direction + len) % len;
      return { ...state, selectedIndex: next };
    }
    case "SELECT_INDEX":
      return { ...state, selectedIndex: action.index };
    case "ADD_RECENT": {
      const updated = [action.id, ...state.recentIds.filter((id) => id !== action.id)].slice(0, MRU_MAX);
      saveMRU(updated);
      return { ...state, recentIds: updated };
    }
    default:
      return state;
  }
}

// ─── Category Labels ──────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<CommandCategory, string> = {
  navigation: "Navigation",
  action: "Actions",
  external: "Links",
};

const CATEGORY_ORDER: CommandCategory[] = ["navigation", "action", "external"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KeyboardControls() {
  const [state, dispatch] = useReducer(paletteReducer, {
    open: false,
    query: "",
    selectedIndex: 0,
    results: [],
    recentIds: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const trie = useRef(new ShortcutTrie());
  const [hint, setHint] = useState<string | null>(null);
  const [visible, setVisible] = useState(false); // mount animation gate

  // ── Build commands list ──────────────────────────────────────────────────

  const commands = useMemo<Command[]>(() => [
    {
      id: "nav-home",
      label: "Go Home",
      description: "Navigate to homepage",
      shortcut: "G H",
      category: "navigation",
      icon: "⌂",
      action: () => { window.location.href = "/"; },
      keywords: ["home", "start", "index"],
    },
    {
      id: "nav-resume",
      label: "View Resume",
      description: "Open resume page",
      shortcut: "G R",
      category: "navigation",
      icon: "📄",
      action: () => { window.location.href = "/resume"; },
      keywords: ["cv", "resume", "hire", "work"],
    },
    {
      id: "nav-favorites",
      label: "Favorites",
      description: "Go to inspiration / favorites",
      shortcut: "G F",
      category: "navigation",
      icon: "★",
      action: () => { window.location.href = "/inspiration"; },
      keywords: ["inspiration", "favorites", "bookmarks"],
    },
    {
      id: "nav-contact",
      label: "Contact",
      description: "Get in touch",
      shortcut: "G C",
      category: "navigation",
      icon: "✉",
      action: () => { window.location.href = "/contact"; },
      keywords: ["contact", "email", "message", "reach"],
    },
    {
      id: "action-theme",
      label: "Toggle Theme",
      description: "Switch dark / light mode",
      shortcut: "T",
      category: "action",
      icon: "◑",
      action: () => {
        // Works with next-themes and manual class toggles
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
          html.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          html.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
        window.dispatchEvent(new Event("theme-toggle"));
        setHint("Theme toggled");
      },
      keywords: ["dark", "light", "theme", "mode", "color"],
    },
    {
      id: "action-scroll-top",
      label: "Scroll to Top",
      shortcut: "S T",
      category: "action",
      icon: "↑",
      action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); },
      keywords: ["scroll", "top", "beginning", "up"],
    },
    {
      id: "action-copy-url",
      label: "Copy Page URL",
      shortcut: "C U",
      category: "action",
      icon: "⎘",
      action: async () => {
        await navigator.clipboard.writeText(window.location.href);
        setHint("URL copied!");
      },
      keywords: ["copy", "url", "link", "share", "clipboard"],
    },
    {
      id: "ext-twitter",
      label: "Open X / Twitter",
      description: "@sect_55",
      category: "external",
      icon: "𝕏",
      action: () => { window.open("https://x.com/sect_55", "_blank", "noopener"); },
      keywords: ["twitter", "x", "social", "tweet"],
    },
    {
      id: "ext-linkedin",
      label: "Open LinkedIn",
      description: "in/sect55",
      category: "external",
      icon: "in",
      action: () => { window.open("https://www.linkedin.com/in/sect55/", "_blank", "noopener"); },
      keywords: ["linkedin", "job", "hire", "connect"],
    },
    {
      id: "ext-github",
      label: "Open GitHub",
      description: "sect-55",
      category: "external",
      icon: "⌥",
      action: () => { window.open("https://github.com/sect-55/sect-55", "_blank", "noopener"); },
      keywords: ["github", "code", "repos", "source"],
    },
    {
      id: "ext-stack-privacy",
      label: "Stack Privacy Project",
      category: "external",
      icon: "⎔",
      action: () => { window.open("https://stack-viewer-eight.vercel.app/", "_blank", "noopener"); },
      keywords: ["project", "stack", "technology", "detect"],
    },
    {
      id: "ext-decurl",
      label: "DecURL Project",
      category: "external",
      icon: "⛓",
      action: () => { window.open("https://d-url.vercel.app/", "_blank", "noopener"); },
      keywords: ["project", "url", "shortener", "web3", "blockchain"],
    },
  ], []);

  // ── Computed results ──────────────────────────────────────────────────────

  const getResults = useCallback((query: string): SearchResult[] => {
    const recentIds = loadMRU();
    let pool: SearchResult[];

    if (!query.trim()) {
      // No query: show recent first, then rest ordered by category
      pool = commands.map((cmd) => ({
        command: cmd,
        score: recentIds.includes(cmd.id) ? 10 - recentIds.indexOf(cmd.id) : 0,
      }));
      pool.sort((a, b) => b.score - a.score);
    } else {
      pool = commands
        .map((cmd) => ({ command: cmd, score: scoreCommand(cmd, query) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score);
    }

    return pool;
  }, [commands]);

  // ── Register trie shortcuts ───────────────────────────────────────────────

  useEffect(() => {
    const t = trie.current;
    // Sequence shortcuts (two-key vim-style)
    t.register(["g", "h"], () => { window.location.href = "/"; });
    t.register(["g", "r"], () => { window.location.href = "/resume"; });
    t.register(["g", "f"], () => { window.location.href = "/inspiration"; });
    t.register(["g", "c"], () => { window.location.href = "/contact"; });
    t.register(["s", "t"], () => { window.scrollTo({ top: 0, behavior: "smooth" }); setHint("Scrolled to top"); });
    t.register(["c", "u"], async () => {
      await navigator.clipboard.writeText(window.location.href);
      setHint("URL copied!");
    });
  }, []);

  // ── Hint auto-dismiss ────────────────────────────────────────────────────

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2000);
    return () => clearTimeout(t);
  }, [hint]);

  // ── Open palette ─────────────────────────────────────────────────────────

  const openPalette = useCallback(() => {
    const initial = getResults("");
    dispatch({ type: "SET_QUERY", query: "", results: initial });
    dispatch({ type: "OPEN" });
    setVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, [getResults]);

  const closePalette = useCallback(() => {
    setVisible(false);
    setTimeout(() => dispatch({ type: "CLOSE" }), 150);
  }, []);

  // ── Execute command ───────────────────────────────────────────────────────

  const executeCommand = useCallback((cmd: Command) => {
    dispatch({ type: "ADD_RECENT", id: cmd.id });
    closePalette();
    requestAnimationFrame(() => cmd.action());
  }, [closePalette]);

  // ── Global keyboard handler ───────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;

      // Cmd/Ctrl+K → open palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        state.open ? closePalette() : openPalette();
        return;
      }

      // While palette open
      if (state.open) {
        if (e.key === "Escape") { e.preventDefault(); closePalette(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); dispatch({ type: "MOVE", direction: 1 }); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); dispatch({ type: "MOVE", direction: -1 }); return; }
        if (e.key === "Enter") {
          e.preventDefault();
          const selected = state.results[state.selectedIndex];
          if (selected) executeCommand(selected.command);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault();
          dispatch({ type: "MOVE", direction: e.shiftKey ? -1 : 1 });
          return;
        }
        return; // Don't feed trie while palette open
      }

      // Single key shortcut: T = toggle theme
      if (!isInput && e.key === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const apply = () => {
          const html = document.documentElement;
          if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
          } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
          }
          window.dispatchEvent(new Event("theme-toggle"));
          setHint("Theme toggled");
        };
        if (!document.startViewTransition) { apply(); return; }
        document.startViewTransition(apply);
        return;
      }

      // Feed trie for multi-key sequences
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.length === 1) {
        trie.current.feed(e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [state.open, state.results, state.selectedIndex, openPalette, closePalette, executeCommand]);

  // ── Auto-focus input when palette opens ──────────────────────────────────

  useEffect(() => {
    if (state.open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [state.open]);

  // ── Scroll selected item into view ───────────────────────────────────────

  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector("[data-selected='true']") as HTMLElement | null;
    item?.scrollIntoView({ block: "nearest" });
  }, [state.selectedIndex]);

  // ── Query change with RAF debounce ────────────────────────────────────────

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const results = getResults(q);
      dispatch({ type: "SET_QUERY", query: q, results });
    });
  }, [getResults]);

  // ── Group results by category ─────────────────────────────────────────────

  const grouped = useMemo(() => {
    const map: Partial<Record<CommandCategory, SearchResult[]>> = {};
    for (const r of state.results) {
      if (!map[r.command.category]) map[r.command.category] = [];
      map[r.command.category]!.push(r);
    }
    return map;
  }, [state.results]);

  // Flat index map for selectedIndex
  const flatResults = state.results;

  // ─── Render ───────────────────────────────────────────────────────────────

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────────────────── */}
      <button
        onClick={openPalette}
        aria-label="Open keyboard command palette"
        title={`Keyboard shortcuts (${modKey}K)`}
        className="kb-trigger"
      >
        <span className="kb-trigger-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="3" y="6" width="2" height="1.5" rx="0.4" fill="currentColor"/>
            <rect x="7" y="6" width="2" height="1.5" rx="0.4" fill="currentColor"/>
            <rect x="11" y="6" width="2" height="1.5" rx="0.4" fill="currentColor"/>
            <rect x="3" y="9" width="10" height="1.5" rx="0.4" fill="currentColor"/>
          </svg>
        </span>
        <kbd className="kb-trigger-kbd">{isMac ? "⌘" : "Ctrl"}+K</kbd>
      </button>

      {/* ── Hint Toast ──────────────────────────────────────────────────── */}
      {hint && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="kb-hint"
        >
          {hint}
        </div>
      )}

      {/* ── Palette Portal ──────────────────────────────────────────────── */}
      {state.open && (
        <div
          ref={overlayRef}
          className={`kb-overlay ${visible ? "kb-overlay--visible" : ""}`}
          onClick={(e) => { if (e.target === overlayRef.current) closePalette(); }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className={`kb-palette ${visible ? "kb-palette--visible" : ""}`}
          >
            {/* Search input */}
            <div className="kb-search-row">
              <svg className="kb-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <line x1="9.8" y1="9.8" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="kb-results"
                aria-activedescendant={flatResults[state.selectedIndex] ? `kb-item-${state.selectedIndex}` : undefined}
                value={state.query}
                onChange={handleQueryChange}
                placeholder="Type a command or search…"
                className="kb-input"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="kb-esc-hint" onClick={closePalette}>ESC</kbd>
            </div>

            <div className="kb-divider" />

            {/* Results */}
            <ul
              ref={listRef}
              id="kb-results"
              role="listbox"
              aria-label="Commands"
              className="kb-results"
            >
              {flatResults.length === 0 && (
                <li className="kb-empty" role="option" aria-selected="false">
                  No commands match &ldquo;{state.query}&rdquo;
                </li>
              )}

              {CATEGORY_ORDER.map((cat) => {
                const items = grouped[cat];
                if (!items?.length) return null;
                const catStartIndex = flatResults.findIndex((r) => r.command.id === items[0].command.id);

                return (
                  <React.Fragment key={cat}>
                    <li className="kb-category-label" role="presentation" aria-hidden="true">
                      {CATEGORY_LABEL[cat]}
                    </li>
                    {items.map((result) => {
                      const globalIdx = flatResults.findIndex((r) => r.command.id === result.command.id);
                      const isSelected = globalIdx === state.selectedIndex;
                      return (
                        <li
                          key={result.command.id}
                          id={`kb-item-${globalIdx}`}
                          role="option"
                          aria-selected={isSelected}
                          data-selected={isSelected}
                          className={`kb-item ${isSelected ? "kb-item--selected" : ""}`}
                          onMouseEnter={() => dispatch({ type: "SELECT_INDEX", index: globalIdx })}
                          onClick={() => executeCommand(result.command)}
                        >
                          <span className="kb-item-icon" aria-hidden="true">{result.command.icon}</span>
                          <span className="kb-item-body">
                            <span className="kb-item-label">{result.command.label}</span>
                            {result.command.description && (
                              <span className="kb-item-desc">{result.command.description}</span>
                            )}
                          </span>
                          {result.command.shortcut && (
                            <span className="kb-item-shortcut" aria-label={`shortcut: ${result.command.shortcut}`}>
                              {result.command.shortcut.split(" ").map((k, i) => (
                                <kbd key={i}>{k}</kbd>
                              ))}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="kb-footer" aria-hidden="true">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> run</span>
              <span><kbd>ESC</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Scoped Styles ────────────────────────────────────────────────── */}
      <style>{`
        /* ── Trigger ─────────────────────────────────────────────────────── */
        .kb-trigger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(128,128,128,0.25);
          background: transparent;
          color: inherit;
          font-size: 13px;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          vertical-align: middle;
          outline: none;
        }
        .kb-trigger:hover {
          border-color: rgba(128,128,128,0.5);
          background: rgba(128,128,128,0.07);
          transform: scale(1.03);
        }
        .kb-trigger:focus-visible {
          box-shadow: 0 0 0 2px currentColor;
        }
        .kb-trigger-icon {
          display: flex;
          align-items: center;
          opacity: 1;
        }
        .kb-trigger-kbd {
          font-family: ui-monospace, monospace;
          font-size: 11px;
          color: inherit;
          opacity: 1;
          background: transparent;
          border: none;
          padding: 0;
          pointer-events: none;
        }

        /* ── Hint toast ─────────────────────────────────────────────────── */
        .kb-hint {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 8px;
          z-index: 9999;
          pointer-events: none;
          animation: kb-fade-up 0.2s ease forwards;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
          font-family: ui-monospace, monospace;
          letter-spacing: 0.02em;
        }
        .dark .kb-hint {
          background: #f3f3f3;
          color: #111;
        }
        @keyframes kb-fade-up {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Overlay ─────────────────────────────────────────────────────── */
        .kb-overlay {
          position: fixed;
          inset: 0;
          z-index: 9000;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          transition: background 0.15s;
        }
        .kb-overlay--visible {
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(3px);
        }
        .dark .kb-overlay--visible {
          background: rgba(0,0,0,0.6);
        }

        /* ── Palette ─────────────────────────────────────────────────────── */
        .kb-palette {
          width: min(600px, calc(100vw - 32px));
          border-radius: 14px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: scale(0.97) translateY(-8px);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .kb-palette--visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .dark .kb-palette {
          background: #0f0f0f;
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3);
        }

        /* ── Search Row ──────────────────────────────────────────────────── */
        .kb-search-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
        }
        .kb-search-icon {
          flex-shrink: 0;
          color: rgba(128,128,128,0.6);
        }
        .kb-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 15px;
          color: inherit;
          font-family: inherit;
          min-width: 0;
        }
        .kb-input::placeholder { color: rgba(128,128,128,0.45); }
        .kb-esc-hint {
          font-family: ui-monospace, monospace;
          font-size: 10px;
          padding: 3px 6px;
          border-radius: 5px;
          background: rgba(128,128,128,0.1);
          border: 1px solid rgba(128,128,128,0.2);
          color: rgba(128,128,128,0.7);
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
          transition: background 0.1s;
        }
        .kb-esc-hint:hover { background: rgba(128,128,128,0.18); }

        /* ── Divider ─────────────────────────────────────────────────────── */
        .kb-divider {
          height: 1px;
          background: rgba(128,128,128,0.12);
          margin: 0;
        }

        /* ── Results ─────────────────────────────────────────────────────── */
        .kb-results {
          list-style: none;
          margin: 0;
          padding: 6px 0;
          overflow-y: auto;
          max-height: 340px;
          overscroll-behavior: contain;
        }
        .kb-results::-webkit-scrollbar { width: 4px; }
        .kb-results::-webkit-scrollbar-track { background: transparent; }
        .kb-results::-webkit-scrollbar-thumb {
          background: rgba(128,128,128,0.2);
          border-radius: 4px;
        }

        .kb-category-label {
          padding: 8px 16px 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(128,128,128,0.5);
          user-select: none;
        }

        .kb-empty {
          padding: 24px 16px;
          text-align: center;
          color: rgba(128,128,128,0.5);
          font-size: 13px;
        }

        .kb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 16px;
          cursor: pointer;
          border-radius: 0;
          transition: background 0.07s;
          outline: none;
        }
        .kb-item:hover,
        .kb-item--selected {
          background: rgba(128,128,128,0.08);
        }
        .dark .kb-item:hover,
        .dark .kb-item--selected {
          background: rgba(255,255,255,0.06);
        }
        .kb-item--selected {
          background: rgba(0,0,0,0.06);
        }

        .kb-item-icon {
          font-size: 15px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
          opacity: 0.75;
          line-height: 1;
        }

        .kb-item-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .kb-item-label {
          font-size: 13.5px;
          font-weight: 500;
          color: inherit;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kb-item-desc {
          font-size: 11.5px;
          color: rgba(128,128,128,0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kb-item-shortcut {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
          align-items: center;
        }
        .kb-item-shortcut kbd {
          font-family: ui-monospace, monospace;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 4px;
          background: rgba(128,128,128,0.1);
          border: 1px solid rgba(128,128,128,0.2);
          color: rgba(128,128,128,0.7);
          min-width: 18px;
          text-align: center;
        }

        /* ── Footer ──────────────────────────────────────────────────────── */
        .kb-footer {
          display: flex;
          gap: 16px;
          padding: 10px 16px;
          border-top: 1px solid rgba(128,128,128,0.1);
          font-size: 11px;
          color: rgba(128,128,128,0.45);
          user-select: none;
        }
        .kb-footer kbd {
          font-family: ui-monospace, monospace;
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 3px;
          background: rgba(128,128,128,0.1);
          border: 1px solid rgba(128,128,128,0.18);
          margin-right: 3px;
        }

        /* ── Reduced motion ──────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .kb-palette, .kb-overlay, .kb-hint {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
