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
    alert('Invalid export format. Please enter either "PDF" or "CSV".');
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
    alert('Please enter an email address');
    return;
  }
  
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
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