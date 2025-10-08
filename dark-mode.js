// Dark Mode Functionality - Clean Implementation
// This script only handles dark mode toggle without modifying existing functionality

document.addEventListener('DOMContentLoaded', function() {
  const root = document.documentElement;
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('ft-theme');

  // Function to apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      if (body) body.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
      if (body) body.classList.remove('theme-dark');
    }
    
    // Update icon
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  // Apply stored theme or system preference
  if (storedTheme === 'dark' || storedTheme === 'light') {
    applyTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  // Theme toggle event listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const currentlyDark = root.classList.contains('theme-dark') || body.classList.contains('theme-dark');
      const theme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('ft-theme', theme);
      applyTheme(theme);
    });
  }
});
