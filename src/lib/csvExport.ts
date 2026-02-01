// CSV Export Utility for Admin Panel

export const exportToCSV = (data: any[], filename: string, columns?: { key: string; label: string }[]) => {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get column headers
  const headers = columns
    ? columns.map(c => c.label)
    : Object.keys(data[0]);

  const keys = columns
    ? columns.map(c => c.key)
    : Object.keys(data[0]);

  // Convert data to CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(row =>
      keys.map(key => {
        const value = getNestedValue(row, key);
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value ?? "");
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    )
  ];

  // Create blob and download
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Helper to get nested object values (e.g., "profile.full_name")
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// Predefined column configurations for different tables
export const csvColumns = {
  agents: [
    { key: "referral_code", label: "Agent ID" },
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "purchased_plan", label: "Plan" },
    { key: "wallet", label: "Wallet Balance" },
    { key: "created_at", label: "Joined Date" },
  ],
  walletHistory: [
    { key: "user_name", label: "Agent Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Type" },
    { key: "description", label: "Description" },
    { key: "created_at", label: "Date" },
  ],
  withdrawals: [
    { key: "profile.full_name", label: "Agent Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Request Date" },
    { key: "processed_at", label: "Processed Date" },
  ],
  deposits: [
    { key: "profile.full_name", label: "Agent Name" },
    { key: "amount", label: "Amount" },
    { key: "transaction_id", label: "Transaction ID" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Date" },
  ],
  tasks: [
    { key: "user_name", label: "Agent Name" },
    { key: "task_title", label: "Task" },
    { key: "task_amount", label: "Amount" },
    { key: "payment_status", label: "Status" },
    { key: "created_at", label: "Submitted Date" },
  ],
  bankDetails: [
    { key: "profile.full_name", label: "Name" },
    { key: "account_holder", label: "Account Holder" },
    { key: "bank_name", label: "Bank Name" },
    { key: "account_number", label: "Account Number" },
    { key: "ifsc_code", label: "IFSC Code" },
    { key: "upi_id", label: "UPI ID" },
    { key: "usdt_address", label: "USDT Address" },
  ],
  courses: [
    { key: "course_name", label: "Course Name" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
    { key: "level", label: "Level" },
    { key: "duration", label: "Duration" },
    { key: "package", label: "Package" },
  ],
  products: [
    { key: "name", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "mrp", label: "MRP" },
    { key: "is_active", label: "Active" },
  ],
  packageRequests: [
    { key: "profile.full_name", label: "Agent Name" },
    { key: "package_name", label: "Package" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Request Date" },
    { key: "processed_at", label: "Processed Date" },
  ],
};
