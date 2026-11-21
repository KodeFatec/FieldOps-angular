export function closeMobileMenu(): void {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  try {
    const bootstrapApi = (window as unknown as {
      bootstrap?: {
        Offcanvas?: {
          getInstance: (element: HTMLElement) => { hide: () => void } | null;
        };
      };
    }).bootstrap;
    const instance = bootstrapApi?.Offcanvas?.getInstance(sidebar);
    if (instance) {
      instance.hide();
      return;
    }
  } catch {
    // Usa o fallback visual abaixo quando a API do Bootstrap nao estiver disponivel.
  }

  sidebar.classList.remove('show');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebar.removeAttribute('aria-modal');
  sidebar.removeAttribute('role');
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
  document.querySelectorAll('.offcanvas-backdrop').forEach((backdrop) => backdrop.remove());
}

export function initializeMenuBase(): void {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  const card = document.getElementById('sbCard');
  const toggle = document.getElementById('sbToggle');
  if (!card) return;

  document.querySelectorAll<HTMLAnchorElement>('#sidebar a.sb-item').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  if (!toggle) return;

  const setCollapsed = (collapsed: boolean): void => {
    card.classList.toggle('is-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
    try { localStorage.setItem('sbCollapsed', collapsed ? '1' : '0'); } catch { /* armazenamento opcional */ }
  };

  toggle.addEventListener('click', () => setCollapsed(!card.classList.contains('is-collapsed')));
  try {
    if (localStorage.getItem('sbCollapsed') === '1') setCollapsed(true);
  } catch { /* armazenamento opcional */ }
}
