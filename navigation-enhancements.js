// Enhanced Navigation Features
document.addEventListener('DOMContentLoaded', function() {
  // Active Navigation Highlighting
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Remove active class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class to current page
  if (currentPage === 'index.html' || currentPage === '') {
    const homeLink = document.querySelector('.nav-links a[href="#"], .nav-links a[href="./index.html"]');
    if (homeLink) homeLink.classList.add('active');
  } else if (currentPage === 'support.html') {
    const supportLink = document.querySelector('.nav-links a[href="./support.html"]');
    if (supportLink) supportLink.classList.add('active');
  } else if (currentPage === 'login.html' || currentPage === 'sign-up.html') {
    const homeLink = document.querySelector('.nav-links a[href="./index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function() {
      navLinksContainer.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!menuToggle.contains(event.target) && !navLinksContainer.contains(event.target)) {
        navLinksContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Smooth Scroll for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    });
  });

  // Enhanced Search Functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        searchInput.focus();
        searchInput.select();
      }
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length > 2) {
        performSearch(query);
      } else if (query.length === 0) {
        // Clear highlights when search is empty
        const previousHighlights = document.querySelectorAll('.search-highlight');
        previousHighlights.forEach(el => {
          el.classList.remove('search-highlight');
        });
      }
    });
  }

  // Page Transition Effects
  const links = document.querySelectorAll('a[href$=".html"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Add loading state
      document.body.classList.add('page-transition');
      
      // Remove loading state after navigation
      setTimeout(() => {
        document.body.classList.remove('page-transition');
      }, 300);
    });
  });
});

// Search functionality
function performSearch(query) {
  // Clear previous highlights
  const previousHighlights = document.querySelectorAll('.search-highlight');
  previousHighlights.forEach(el => {
    el.classList.remove('search-highlight');
  });

  const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, li, td, th, button, input[placeholder]');
  let foundResults = false;
  let resultCount = 0;
  let firstResult = null;
  const searchResults = [];

  searchableElements.forEach(element => {
    const text = element.textContent.toLowerCase();
    const placeholder = element.placeholder ? element.placeholder.toLowerCase() : '';
    
    if (text.includes(query) || placeholder.includes(query)) {
      element.classList.add('search-highlight');
      foundResults = true;
      resultCount++;
      searchResults.push({
        element: element,
        text: element.textContent.trim(),
        tagName: element.tagName.toLowerCase(),
        type: element.placeholder ? 'input' : element.tagName.toLowerCase()
      });
      
      if (!firstResult) {
        firstResult = element;
      }
    }
  });

  if (foundResults) {
    showEnhancedSearchNotification(searchResults, query, 'success');
    
    // Scroll to first result with enhanced animation
    if (firstResult) {
      setTimeout(() => {
        firstResult.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center', 
          inline: 'nearest' 
        });
        firstResult.classList.add('search-focus');
        setTimeout(() => firstResult.classList.remove('search-focus'), 2000);
      }, 300);
    }
  } else {
    showEnhancedSearchNotification([], query, 'error');
  }
}

// Enhanced search notification function
function showEnhancedSearchNotification(results, query, type) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.search-notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `search-notification ${type}`;
  
  if (type === 'success') {
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-search"></i>
        <span>Found ${results.length} results for "${query}"</span>
        <button class="close-notification">&times;</button>
      </div>
    `;
  } else {
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>No results found for "${query}"</span>
        <button class="close-notification">&times;</button>
      </div>
    `;
  }

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);

  // Close button functionality
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
}

// Keyboard Navigation Support
function initKeyboardNavigation() {
  // Tab navigation enhancement
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  // Remove keyboard navigation class on mouse use
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // Escape key to close modals/menus
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close mobile menu
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
          const icon = menuToggle.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Clear search
      const searchInput = document.getElementById('search-input');
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
      }
    }
  });
}

// Initialize keyboard navigation
initKeyboardNavigation();
