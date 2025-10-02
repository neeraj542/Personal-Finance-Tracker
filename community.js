/* ===========================================
   COMMUNITY PAGE JAVASCRIPT
   Integrates with existing script.js patterns
   =========================================== */

// Community data structure (simulating backend until implementation)
let communityPosts = [];
let currentUser = null; // Will be set when authentication is implemented
let currentFilter = 'all';
let currentSort = 'latest';
let currentPage = 1;
let postsPerPage = 10;

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    title: "Export to Excel Feature Request",
    content: "I would love to see an option to export transaction data to Excel format (.xlsx) in addition to the current PDF and CSV options. This would make it easier to create custom reports and analysis.",
    category: "feature-request",
    author: {
      name: "Sarah Johnson",
      avatar: "SJ",
      id: "user_1"
    },
    created: new Date('2025-10-02T10:00:00Z'),
    updated: new Date('2025-10-02T10:00:00Z'),
    votes: 15,
    comments: 5,
    isUrgent: false,
    isSolved: false,
    tags: ["export", "excel", "enhancement"]
  },
  {
    id: 2,
    title: "How to backup my transaction data?",
    content: "I've been using the finance tracker for months and have accumulated a lot of important data. What's the best way to backup all my transactions? I'm worried about losing everything if something happens to my browser.",
    category: "help",
    author: {
      name: "Mike Chen",
      avatar: "MC",
      id: "user_2"
    },
    created: new Date('2025-10-02T06:00:00Z'),
    updated: new Date('2025-10-02T06:00:00Z'),
    votes: 8,
    comments: 3,
    isUrgent: false,
    isSolved: true,
    tags: ["backup", "data", "help"]
  },
  {
    id: 3,
    title: "Budget planning integration ideas",
    content: "Has anyone thought about integrating budget planning features? It would be amazing to set monthly budgets for different categories and get alerts when approaching limits. What do you all think?",
    category: "general",
    author: {
      name: "Alex Rivera",
      avatar: "AR",
      id: "user_3"
    },
    created: new Date('2025-10-01T15:30:00Z'),
    updated: new Date('2025-10-01T15:30:00Z'),
    votes: 23,
    comments: 8,
    isUrgent: false,
    isSolved: false,
    tags: ["budget", "planning", "features"]
  },
  {
    id: 4,
    title: "Currency conversion not working correctly",
    content: "I noticed that when I switch between currencies, the conversion doesn't seem accurate. For example, when I change from USD to EUR, the amounts don't reflect current exchange rates. Is this a known issue?",
    category: "bug",
    author: {
      name: "Emma Thompson",
      avatar: "ET",
      id: "user_4"
    },
    created: new Date('2025-10-01T09:15:00Z'),
    updated: new Date('2025-10-01T09:15:00Z'),
    votes: 12,
    comments: 4,
    isUrgent: true,
    isSolved: false,
    tags: ["bug", "currency", "conversion"]
  },
  {
    id: 5,
    title: "Dark mode support request",
    content: "Would it be possible to add dark mode support? I often use the tracker in the evening and a dark theme would be much easier on the eyes. Many users would appreciate this feature!",
    category: "feature-request",
    author: {
      name: "David Park",
      avatar: "DP",
      id: "user_5"
    },
    created: new Date('2025-09-30T20:45:00Z'),
    updated: new Date('2025-09-30T20:45:00Z'),
    votes: 31,
    comments: 12,
    isUrgent: false,
    isSolved: false,
    tags: ["dark-mode", "ui", "accessibility"]
  }
];

// Initialize community page
function initializeCommunity() {
  // Load mock data (in real implementation, this would fetch from backend)
  communityPosts = [...mockPosts];
  
  // Check user authentication status
  checkAuthenticationStatus();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initial render
  renderPosts();
  updateStats();
  
  // Handle URL hash for deep linking
  handleUrlHash();
}

// Check if user is authenticated (placeholder for real auth system)
function checkAuthenticationStatus() {
  // In real implementation, this would check JWT token or session
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI();
  }
}

// Set up event listeners
function setupEventListeners() {
  // Search input with debouncing
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterPosts();
      }, 300);
    });
  }
  
  // Character count for form inputs
  const titleInput = document.getElementById('post-title');
  const contentTextarea = document.getElementById('post-content');
  
  if (titleInput) {
    titleInput.addEventListener('input', () => updateCharCount(titleInput, 100));
  }
  
  if (contentTextarea) {
    contentTextarea.addEventListener('input', () => updateCharCount(contentTextarea, 2000));
  }
}

// Update character count display
function updateCharCount(element, maxLength) {
  const count = element.value.length;
  const display = element.parentNode.querySelector('.char-count');
  if (display) {
    display.textContent = `${count}/${maxLength}`;
    display.style.color = count > maxLength * 0.9 ? '#dc3545' : '#666';
  }
}

// Filter posts by category
function filterByCategory(category) {
  currentFilter = category;
  currentPage = 1;
  
  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-filter="${category}"]`).classList.add('active');
  
  renderPosts();
}

// Filter posts by search term
function filterPosts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const clearBtn = document.querySelector('.clear-search');
  
  if (searchTerm) {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }
  
  currentPage = 1;
  renderPosts();
}

// Clear search
function clearSearch() {
  document.getElementById('search-input').value = '';
  document.querySelector('.clear-search').style.display = 'none';
  renderPosts();
}

// Sort posts
function sortPosts() {
  currentSort = document.getElementById('sort-select').value;
  currentPage = 1;
  renderPosts();
}

// Get filtered and sorted posts
function getFilteredPosts() {
  let filtered = [...communityPosts];
  const searchTerm = document.getElementById('search-input')?.value?.toLowerCase() || '';
  
  // Apply category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(post => post.category === currentFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (currentSort) {
      case 'popular':
        return b.votes - a.votes;
      case 'most-commented':
        return b.comments - a.comments;
      case 'solved':
        return (b.isSolved ? 1 : 0) - (a.isSolved ? 1 : 0);
      case 'latest':
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });
  
  return filtered;
}

// Render posts
function renderPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  const filtered = getFilteredPosts();
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filtered.slice(startIndex, endIndex);
  
  if (paginatedPosts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #666;">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <h3>No discussions found</h3>
        <p>Try adjusting your search terms or filters</p>
        <button onclick="clearSearch(); filterByCategory('all');" class="btn-primary" style="margin-top: 1rem;">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = paginatedPosts.map(post => createPostCard(post)).join('');
  
  // Update load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    if (endIndex >= filtered.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
      loadMoreBtn.innerHTML = `
        <i class="fas fa-chevron-down"></i> 
        Load More (${filtered.length - endIndex} remaining)
      `;
    }
  }
}

// Create post card HTML
function createPostCard(post) {
  const timeAgo = getTimeAgo(post.created);
  const isUserPost = currentUser && currentUser.id === post.author.id;
  
  return `
    <div class="post-card ${post.category} ${post.isUrgent ? 'urgent' : ''}" data-post-id="${post.id}">
      <div class="post-header">
        <div>
          <h3 class="post-title">${post.title}</h3>
          <div class="post-meta">
            <div class="post-author">
              <div class="author-avatar">${post.author.avatar}</div>
              <span>${post.author.name}</span>
            </div>
            <span>•</span>
            <span>${timeAgo}</span>
            ${post.updated > post.created ? `<span>• Updated ${getTimeAgo(post.updated)}</span>` : ''}
          </div>
        </div>
        <div class="post-badges">
          ${post.isUrgent ? '<span class="post-badge urgent">Urgent</span>' : ''}
          ${post.isSolved ? '<span class="post-badge solved">Solved</span>' : ''}
          <span class="post-badge ${post.category}">${getCategoryLabel(post.category)}</span>
        </div>
      </div>
      
      <div class="post-content">
        <div class="post-excerpt">
          ${post.content}
        </div>
      </div>
      
      <div class="post-footer">
        <div class="post-stats">
          <div class="post-stat">
            <i class="fas fa-thumbs-up"></i>
            <span>${post.votes}</span>
          </div>
          <div class="post-stat">
            <i class="fas fa-comments"></i>
            <span>${post.comments}</span>
          </div>
          <div class="post-stat">
            <i class="fas fa-eye"></i>
            <span>${Math.floor(Math.random() * 100) + 50}</span>
          </div>
        </div>
        
        <div class="post-actions">
          <button class="action-btn" onclick="votePost(${post.id}, 'up')">
            <i class="fas fa-thumbs-up"></i>
            Vote
          </button>
          <button class="action-btn" onclick="viewPost(${post.id})">
            <i class="fas fa-comment"></i>
            Reply
          </button>
          ${isUserPost ? `
            <button class="action-btn" onclick="editPost(${post.id})">
              <i class="fas fa-edit"></i>
              Edit
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Get category label
function getCategoryLabel(category) {
  const labels = {
    'feature-request': 'Feature Request',
    'bug': 'Bug Report', 
    'general': 'General',
    'help': 'Help & Support'
  };
  return labels[category] || category;
}

// Get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Load more posts
function loadMorePosts() {
  currentPage++;
  renderPosts();
}

// Update community stats
function updateStats() {
  const totalPosts = communityPosts.length;
  const totalMembers = '2.4k'; // Mock data
  const solvedPercentage = Math.round((communityPosts.filter(p => p.isSolved).length / totalPosts) * 100);
  
  // Update hero stats
  const totalPostsElement = document.getElementById('total-posts');
  const totalMembersElement = document.getElementById('total-members');
  const solvedTopicsElement = document.getElementById('solved-topics');
  
  if (totalPostsElement) totalPostsElement.textContent = totalPosts;
  if (totalMembersElement) totalMembersElement.textContent = totalMembers;
  if (solvedTopicsElement) solvedTopicsElement.textContent = `${solvedPercentage}%`;
}

// Show new post modal
function showNewPostModal() {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  
  const modal = document.getElementById('new-post-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on title input
    setTimeout(() => {
      const titleInput = document.getElementById('post-title');
      if (titleInput) titleInput.focus();
    }, 100);
  }
}

// Hide new post modal
function hideNewPostModal() {
  const modal = document.getElementById('new-post-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('new-post-form');
    if (form) form.reset();
    
    // Reset character counts
    updateCharCount(document.getElementById('post-title'), 100);
    updateCharCount(document.getElementById('post-content'), 2000);
  }
}

// Show authentication modal
function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Hide authentication modal
function hideAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Submit new post
function submitNewPost(event) {
  event.preventDefault();
  
  if (!currentUser) {
    showAuthModal();
    return;
  }
  
  const title = document.getElementById('post-title').value.trim();
  const category = document.getElementById('post-category').value;
  const content = document.getElementById('post-content').value.trim();
  const isUrgent = document.getElementById('urgent-checkbox').checked;
  
  // Validation
  if (!title || !category || !content) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  if (title.length > 100) {
    showToast('Title must be 100 characters or less', 'error');
    return;
  }
  
  if (content.length > 2000) {
    showToast('Content must be 2000 characters or less', 'error');
    return;
  }
  
  // Create new post
  const newPost = {
    id: Date.now(), // In real app, this would be generated by backend
    title,
    content,
    category,
    author: currentUser,
    created: new Date(),
    updated: new Date(),
    votes: 0,
    comments: 0,
    isUrgent,
    isSolved: false,
    tags: extractTags(content)
  };
  
  // Add to posts array (in real app, this would be an API call)
  communityPosts.unshift(newPost);
  
  // Refresh display
  renderPosts();
  updateStats();
  hideNewPostModal();
  
  showToast('Discussion posted successfully!', 'success');
  
  // Scroll to top to show new post
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Extract tags from content (simple implementation)
function extractTags(content) {
  const words = content.toLowerCase().split(/\W+/);
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'];
  return words
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 3);
}

// Vote on a post
function votePost(postId, direction) {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  
  const post = communityPosts.find(p => p.id === postId);
  if (post) {
    if (direction === 'up') {
      post.votes++;
      showToast('Vote recorded!', 'success');
    }
    renderPosts(); // Re-render to show updated vote count
  }
}

// View post details (placeholder)
function viewPost(postId) {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  
  // In real implementation, this would navigate to a detailed post view
  showToast('Post details view coming soon!', 'info');
}

// Edit post (placeholder)
function editPost(postId) {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  
  // In real implementation, this would open an edit modal
  showToast('Edit functionality coming soon!', 'info');
}

// Show toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-${getToastIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 4000);
}

// Get toast icon based on type
function getToastIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// Handle URL hash for deep linking
function handleUrlHash() {
  const hash = window.location.hash;
  if (hash === '#new-post') {
    showNewPostModal();
  }
}

// Update authentication UI
function updateAuthUI() {
  // This would update the UI based on authentication status
  // For now, just a placeholder
}

// Mock authentication functions (for demonstration)
function mockLogin(username) {
  currentUser = {
    id: `user_${Date.now()}`,
    name: username,
    avatar: username.substring(0, 2).toUpperCase()
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateAuthUI();
  showToast(`Welcome back, ${username}!`, 'success');
}

function mockLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  showToast('Logged out successfully', 'info');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-overlay')) {
    if (event.target.id === 'new-post-modal') {
      hideNewPostModal();
    } else if (event.target.id === 'auth-modal') {
      hideAuthModal();
    }
  }
});

// Handle ESC key to close modals
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    hideNewPostModal();
    hideAuthModal();
  }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we're on the community page
  if (document.getElementById('posts-container')) {
    initializeCommunity();
  }
});