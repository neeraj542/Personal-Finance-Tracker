// Active Navigation Highlighting
document.addEventListener('DOMContentLoaded', function() {
  // Get current page path
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  // Remove active class from all nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class based on current page
  if (currentPage === 'index.html' || currentPage === '') {
    // For index page, highlight Home
    const homeLink = document.querySelector('.nav-links a[href="#"], .nav-links a[href="./index.html"]');
    if (homeLink) homeLink.classList.add('active');
  } else if (currentPage === 'support.html') {
    // For support page, highlight Support
    const supportLink = document.querySelector('.nav-links a[href="./support.html"]');
    if (supportLink) supportLink.classList.add('active');
  } else if (currentPage === 'login.html') {
    // For login page, highlight Home (since it's part of main site)
    const homeLink = document.querySelector('.nav-links a[href="./index.html"]');
    if (homeLink) homeLink.classList.add('active');
  } else if (currentPage === 'sign-up.html') {
    // For sign-up page, highlight Home (since it's part of main site)
    const homeLink = document.querySelector('.nav-links a[href="./index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
  
  // Initialize keyboard navigation
  initKeyboardNavigation();
  initKeyboardShortcuts();
  
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
      link.addEventListener('click', function() {
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
});

// const arrow = document.querySelector('.arrow');

// arrow.addEventListener('click', (event) => {
//   event.preventDefault();
//   const targetElement = document.querySelector(event.target.getAttribute('#tracker'));
//   targetElement.scrollIntoView({ behavior: 'smooth' });
// });

// Get the table-part element and the transaction-table
const tablePart = document.querySelector(".table-part");
const transactionTable = document.getElementById("transaction-table");

// Function to check the number of entries and apply scrollbar if needed
function checkTableScroll() {
  const rowCount = transactionTable.rows.length - 1; // Exclude the header row
  const maxRowCount = 10; // Set the desired maximum number of entries

  if (rowCount > maxRowCount) {
    tablePart.classList.add("scrollable");
  } else {
    tablePart.classList.remove("scrollable");
  }
}

// Call the function initially and whenever there is a change in the table
checkTableScroll();

// Add an event listener for changes in the table
const observer = new MutationObserver(checkTableScroll);
observer.observe(transactionTable, {
  childList: true,
  subtree: true,
});

// Initialize an empty array to store the transactions
let transactions = [];

// Variable to store the current transaction being edited
let editedTransaction = null;

// Function to add a new transaction
function addTransaction() {
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const chosenDate = new Date(dateInput.value);

  // Clear the input fields
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Validate the input
  if (description.trim() === "" || isNaN(amount) || isNaN(chosenDate)) {
    return;
  }

  // Create a new transaction object
  const transaction = {
    primeId: chosenDate.getTime(),
    description: description,
    amount: amount,
    type: type,
  };

  // Add the transaction to the array
  transactions.push(transaction);

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();
}

// Function to delete a transaction
function deleteTransaction(primeId) {
  // Find the index of the transaction with the given primeId
  const index = transactions.findIndex(
    (transaction) => transaction.primeId === primeId
  );

  // Remove the transaction from the array
  if (index > -1) {
    transactions.splice(index, 1);
  }

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();
}

// Function to edit a transaction
function editTransaction(primeId) {
  // Find the transaction with the given primeId
  const transaction = transactions.find(
    (transaction) => transaction.primeId === primeId
  );

  // Populate the input fields with the transaction details for editing
  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("type").value = transaction.type;

  // Store the current transaction being edited
  editedTransaction = transaction;

  // Show the Save button and hide the Add Transaction button
  document.getElementById("add-transaction-btn").style.display = "none";
  document.getElementById("save-transaction-btn").style.display =
    "inline-block";

  // Set the date input value to the chosen date
  const dateInput = document.getElementById("date");
  const chosenDate = new Date(transaction.primeId);
  const formattedDate = formatDate(chosenDate);
  dateInput.value = formattedDate;
}

// Function to save the edited transaction
function saveTransaction() {
  if (!editedTransaction) {
    return;
  }
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const chosenDate = new Date(dateInput.value);

  // Validate the input
  if (description.trim() === "" || isNaN(amount) || isNaN(chosenDate)) {
    return;
  }

  // Update the transaction details
  editedTransaction.description = description;
  editedTransaction.amount = amount;
  editedTransaction.type = type;
  editedTransaction.primeId = chosenDate.getTime();

  // Clear the input fields
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Clear the edited transaction
  editedTransaction = null;

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();

  // Show the Add Transaction button and hide the Save button
  document.getElementById("add-transaction-btn").style.display = "inline-block";
  document.getElementById("save-transaction-btn").style.display = "none";
}

// Function to update the balance
function updateBalance() {
  const balanceElement = document.getElementById("balance");
  let balance = 0.0;

  // Calculate the total balance
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      balance += transaction.amount;
    } else if (transaction.type === "expense") {
      balance -= transaction.amount;
    }
  });

  // Format the balance with currency symbol
  const currencySelect = document.getElementById("currency");
  const currencyCode = currencySelect.value;
  const formattedBalance = formatCurrency(balance, currencyCode);

  // Update the balance display
  balanceElement.textContent = formattedBalance;

  // Check if the balance is negative or positive
  if (balance < 0) {
    balanceElement.classList.remove("positive-balance");
    balanceElement.classList.add("negative-balance");
  } else {
    balanceElement.classList.remove("negative-balance");
    balanceElement.classList.add("positive-balance");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Set initial balance value
  let balance = 0.0;
  updateBalance(balance); // Update the balance display

  // Other code for adding transactions, updating balance, etc.

  // Function to update the balance display
  function updateBalance(balance) {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = balance.toFixed(2); // Format balance with 2 decimal places
  }
});
// Function to format currency based on the selected currency code
function formatCurrency(amount, currencyCode) {
  // Define currency symbols and decimal separators for different currency codes
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹",
  };

  const decimalSeparators = {
    USD: ".",
    EUR: ",",
    INR: ".",
  };

  // Get the currency symbol and decimal separator based on the currency code
  const symbol = currencySymbols[currencyCode] || "";
  const decimalSeparator = decimalSeparators[currencyCode] || ".";

  // Format the amount with currency symbol and decimal separator
  const formattedAmount =
    symbol + amount.toFixed(2).replace(".", decimalSeparator);
  return formattedAmount;
}

// Function to format date as DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to update the transaction table
function updateTransactionTable() {
  const transactionTable = document.getElementById("transaction-table");

  // Clear the existing table rows
  while (transactionTable.rows.length > 1) {
    transactionTable.deleteRow(1);
  }

  // Add new rows to the table
  transactions.forEach((transaction) => {
    const newRow = transactionTable.insertRow();

    const dateCell = newRow.insertCell();
    const date = new Date(transaction.primeId);
    dateCell.textContent = formatDate(date);

    const descriptionCell = newRow.insertCell();
    descriptionCell.textContent = transaction.description;

    const amountCell = newRow.insertCell();
    const currencySelect = document.getElementById("currency");
    const currencyCode = currencySelect.value;
    const formattedAmount = formatCurrency(transaction.amount, currencyCode);
    amountCell.textContent = formattedAmount;

    const typeCell = newRow.insertCell();
    typeCell.textContent = transaction.type;

    const actionCell = newRow.insertCell();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () =>
      editTransaction(transaction.primeId)
    );
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () =>
      deleteTransaction(transaction.primeId)
    );
    actionCell.appendChild(deleteButton);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", () =>
      saveTransaction(transaction.primeId)
    );
    actionCell.appendChild(saveButton);
  });
}

// Event listener for the Add Transaction button
document
  .getElementById("add-transaction-btn")
  .addEventListener("click", addTransaction);

// Event listener for the Save Transaction button
document
  .getElementById("save-transaction-btn")
  .addEventListener("click", saveTransaction);

// Initial update of the balance and transaction table
updateBalance();
updateTransactionTable();

// Function to handle the download of data in PDF and CSV formats
function handleDownload() {
  // Prompt the user to select the export format
  const exportFormat = prompt("Select export format: PDF or CSV").toLowerCase();

  if (exportFormat === "pdf") {
    // Call a function to export data to PDF
    exportToPDF();
  } else if (exportFormat === "csv") {
    // Call a function to export data to CSV
    exportToCSV();
  } else {
    showNotification('Invalid export format. Please enter either "PDF" or "CSV".', 'error');
  }
}

// Function to export data to PDF
function exportToPDF() {
  // Define the document content using pdfMake syntax
  const docDefinition = {
    content: [
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto"],
          body: [
            [
              { text: "Date", style: "header" },
              { text: "Description", style: "header" },
              { text: "Amount", style: "header" },
              { text: "Type", style: "header" },
            ],
            // Add transaction data to the table body
            ...transactions.map((transaction) => {
              const date = formatDate(new Date(transaction.primeId));
              const description = transaction.description;
              const amount = transaction.amount;
              const type = transaction.type;

              return [date, description, amount.toString(), type];
            }),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 5],
      },
    },
  };

  // Create the PDF document
  pdfMake.createPdf(docDefinition).download("transactions.pdf");
}

// Function to export data to CSV
function exportToCSV() {
  // Generate CSV content
  const csvContent =
    "Date,Description,Amount,Type\n" +
    transactions
      .map((transaction) => {
        const date = formatDate(new Date(transaction.primeId));
        const description = transaction.description;
        const amount = transaction.amount;
        const type = transaction.type;

        return `${date},${description},${amount},${type}`;
      })
      .join("\n");
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element and trigger a click to download the CSV file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";
  link.click();
}

// Invite Section Functions
function sendEmailInvite() {
  const emailInput = document.getElementById('invite-email');
  const email = emailInput.value.trim();
  
  if (!email) {
    showNotification('Please enter an email address', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Create mailto link with pre-filled subject and body
  const subject = 'Join our Personal Finance Tracker community!';
  const body = `Hi! I've been using this amazing Personal Finance Tracker app to manage my finances and I thought you might find it useful too. It helps you track income, expenses, and manage your budget effectively. Check it out: ${window.location.href}`;
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open the default email client
  window.location.href = mailtoLink;
  
  // Clear the input
  emailInput.value = '';
  
  // Show success message
  showNotification('Community invite sent!', 'success');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Join our Personal Finance Tracker community! Track your finances effortlessly.');
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  
  // Open LinkedIn share dialog in a new window
  window.open(linkedinUrl, 'linkedin-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  
  showNotification('LinkedIn share opened!', 'success');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Join our Personal Finance Tracker community! Track your finances effortlessly.');
  const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  
  // Open Twitter share dialog in a new window
  window.open(twitterUrl, 'twitter-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  
  showNotification('Community share opened!', 'success');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : '#17a2b8'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add event listener for Enter key on email input
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('invite-email');
  if (emailInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendEmailInvite();
      }
    });
  }
});

// Search Bar Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    // Focus search bar on Cmd+K, Ctrl+K, or Ctrl+Shift+K
    document.addEventListener('keydown', function(e) {
      // Check for Cmd+K (Mac), Ctrl+K, or Ctrl+Shift+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Focus the search input
        searchInput.focus();
        searchInput.select(); // Select all text for easy replacement
        
        // Show a brief visual feedback
        searchInput.style.borderColor = '#0b0081';
        setTimeout(() => {
          searchInput.style.borderColor = '';
        }, 1000);
        
        return false;
      }
      
      // Alternative: Ctrl+Shift+K (won't conflict with browser)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Focus the search input
        searchInput.focus();
        searchInput.select();
        
        // Show a brief visual feedback
        searchInput.style.borderColor = '#0b0081';
        setTimeout(() => {
          searchInput.style.borderColor = '';
        }, 1000);
        
        return false;
      }
    }, true); // Use capture phase to intercept before browser default
    
    // Handle search functionality
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length > 2) { // Only search if at least 3 characters
        performSearch(query);
      } else if (query.length === 0) {
        // Clear highlights when search is empty
        const previousHighlights = document.querySelectorAll('.search-highlight');
        previousHighlights.forEach(el => {
          el.classList.remove('search-highlight');
        });
      }
    });
    
    // Handle Enter key in search
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 0) {
          performSearch(query);
        }
      }
    });
  }
});

// Search functionality
function performSearch(query) {
  
  // Clear previous highlights
  const previousHighlights = document.querySelectorAll('.search-highlight');
  previousHighlights.forEach(el => {
    el.classList.remove('search-highlight');
  });
  
  // Get all text elements that can be searched
  const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, li, td, th, button, input[placeholder]');
  let foundResults = false;
  let resultCount = 0;
  let firstResult = null;
  const searchResults = [];
  
  searchableElements.forEach(element => {
    const text = element.textContent.toLowerCase();
    const placeholder = element.placeholder ? element.placeholder.toLowerCase() : '';
    
    if (text.includes(query) || placeholder.includes(query)) {
      // Highlight the element
      element.classList.add('search-highlight');
      foundResults = true;
      resultCount++;
      
      // Store result info for enhanced display
      searchResults.push({
        element: element,
        text: element.textContent.trim(),
        tagName: element.tagName.toLowerCase(),
        type: element.placeholder ? 'input' : element.tagName.toLowerCase()
      });
      
      // Store the first result for scrolling
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
        // Add focus effect
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
  // Remove existing notification
  const existingNotification = document.getElementById('search-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'search-notification';
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #0b0081 0%, #1a1a8a 100%)' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'};
    color: white;
    padding: 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    max-width: 350px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideInRight 0.3s ease-out;
  `;
  
  if (type === 'success' && results.length > 0) {
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <i class="fas fa-search" style="color: #f4ff61; font-size: 16px;"></i>
        <strong>${results.length} result${results.length > 1 ? 's' : ''} found</strong>
      </div>
      <div style="max-height: 200px; overflow-y: auto;">
        ${results.slice(0, 5).map(result => `
          <div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #f4ff61; font-weight: bold; text-transform: uppercase; font-size: 11px; margin-bottom: 4px;">
              ${result.type === 'input' ? 'INPUT FIELD' : result.tagName}
            </div>
            <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">
              ${result.text.substring(0, 80)}${result.text.length > 80 ? '...' : ''}
            </div>
          </div>
        `).join('')}
        ${results.length > 5 ? `
          <div style="text-align: center; margin-top: 10px; font-size: 12px; opacity: 0.7;">
            +${results.length - 5} more results
          </div>
        ` : ''}
      </div>
    `;
  } else {
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle" style="color: #ffc107; font-size: 16px;"></i>
        <div>
          <strong>No results found</strong>
          <div style="font-size: 12px; margin-top: 4px; opacity: 0.8;">
            Try different keywords or check spelling
          </div>
        </div>
      </div>
    `;
  }
  
  document.body.appendChild(notification);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Loading States and Animations
function showLoadingState(element, type = 'button') {
  if (type === 'button') {
    element.classList.add('btn-loading');
    element.disabled = true;
  } else if (type === 'form') {
    element.classList.add('form-loading');
  } else if (type === 'page') {
    element.classList.add('loading');
  }
}

function hideLoadingState(element, type = 'button') {
  if (type === 'button') {
    element.classList.remove('btn-loading');
    element.disabled = false;
  } else if (type === 'form') {
    element.classList.remove('form-loading');
  } else if (type === 'page') {
    element.classList.remove('loading');
  }
}

// Enhanced form submission with loading states
function handleFormSubmission(form, callback) {
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (submitButton) {
    showLoadingState(submitButton, 'button');
    showLoadingState(form, 'form');
    
    // Simulate processing time
    setTimeout(() => {
      if (callback) callback();
      hideLoadingState(submitButton, 'button');
      hideLoadingState(form, 'form');
    }, 2000);
  }
}

// Enhanced Form Validation and User Feedback
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  const errors = [];
  
  inputs.forEach(input => {
    const value = input.value.trim();
    const fieldName = input.name || input.id || 'field';
    
    // Clear previous errors
    clearFieldError(input);
    
    // Required field validation
    if (!value) {
      showFieldError(input, `${fieldName} is required`);
      errors.push(`${fieldName} is required`);
      isValid = false;
      return;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(input, 'Please enter a valid email address');
        errors.push('Invalid email format');
        isValid = false;
      }
    }
    
    // Password validation
    if (input.type === 'password' && value) {
      if (value.length < 8) {
        showFieldError(input, 'Password must be at least 8 characters long');
        errors.push('Password too short');
        isValid = false;
      }
    }
    
    // Phone validation
    if (input.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError(input, 'Please enter a valid phone number');
        errors.push('Invalid phone number');
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
}

function showFieldError(input, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
    animation: fadeInUp 0.3s ease-out;
  `;
  
  input.classList.add('error');
  input.style.borderColor = '#dc3545';
  
  // Insert error after input
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function clearFieldError(input) {
  input.classList.remove('error');
  input.style.borderColor = '';
  
  const existingError = input.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideInRight 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-check-circle" style="color: #ffffff; font-size: 16px;"></i>
      <strong>${message}</strong>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideInRight 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-exclamation-circle" style="color: #ffc107; font-size: 16px;"></i>
      <strong>${message}</strong>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Keyboard Navigation Support
function initKeyboardNavigation() {
  // Tab navigation enhancement
  document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
      const mainContent = document.querySelector('main, .main-content, .section-box');
      if (mainContent) {
        mainContent.focus();
        e.preventDefault();
      }
    }
    
    // Escape key to close modals/menus
    if (e.key === 'Escape') {
      // Close mobile menu
      const navLinks = document.querySelector('.nav-links');
      const menuToggle = document.getElementById('menu-toggle');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
      
      // Clear search
      const searchInput = document.getElementById('search-input');
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        clearSearchHighlights();
        hideSearchResults();
      }
    }
    
    // Arrow key navigation for lists
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const activeElement = document.activeElement;
      const listItems = Array.from(document.querySelectorAll('li, .nav-links a, .benefit-item'));
      const currentIndex = listItems.indexOf(activeElement);
      
      if (currentIndex !== -1) {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % listItems.length
          : (currentIndex - 1 + listItems.length) % listItems.length;
        
        listItems[nextIndex].focus();
      }
    }
    
    // Enter key to activate focused elements
    if (e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement.tagName === 'A' || activeElement.tagName === 'BUTTON') {
        activeElement.click();
      }
    }
  });
  
  // Focus management for better accessibility
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  // Trap focus in modals
  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];
    
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
  
  // Apply focus trap to mobile menu
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    trapFocus(navLinks);
  }
}

// Enhanced keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Alt + H for Home
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      const homeLink = document.querySelector('a[href="#"], a[href="./index.html"]');
      if (homeLink) homeLink.click();
    }
    
    // Alt + S for Support
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const supportLink = document.querySelector('a[href="./support.html"]');
      if (supportLink) supportLink.click();
    }
    
    // Alt + L for Login
    if (e.altKey && e.key === 'l') {
      e.preventDefault();
      const loginLink = document.querySelector('a[href="./login.html"]');
      if (loginLink) loginLink.click();
    }
    
    // Alt + U for Sign Up
    if (e.altKey && e.key === 'u') {
      e.preventDefault();
      const signupLink = document.querySelector('a[href="./sign-up.html"]');
      if (signupLink) signupLink.click();
    }
  });
}

// Page transition effects
function addPageTransition() {
  document.body.classList.add('page-enter');
  
  // Remove class after animation
  setTimeout(() => {
    document.body.classList.remove('page-enter');
  }, 500);
}

// Scroll to first search result
function scrollToFirstResult() {
  const firstResult = document.querySelector('.search-highlight');
  if (firstResult) {
    firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Show search notification
function showSearchNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `search-notification search-notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : '#17a2b8'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 500;
    animation: slideInSearch 0.3s ease-out;
    max-width: 300px;
  `;
  
  // Add animation keyframes for search notifications
  if (!document.getElementById('search-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'search-notification-styles';
    style.textContent = `
      @keyframes slideInSearch {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutSearch {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .search-highlight {
        background-color: #f4ff61 !important;
        color: #0b0081 !important;
        padding: 2px 4px;
        border-radius: 3px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutSearch 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}