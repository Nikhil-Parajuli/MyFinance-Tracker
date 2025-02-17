import { Transaction } from '../types';

// Array of Discord webhook URLs
const WEBHOOK_URLS = [
  'https://discord.com/api/webhooks/1333076336939630707/8r2BKEKBcEVI8xeeDXZtyphIxON5O-RUfl1PIscFeQh7mN7D7Ocplpt2niD68kiINlrg',
  'https://discord.com/api/webhooks/1333126219897638992/nRZc5YYTDFJOWdxjWm-2JLqCQs-Yn4Cwm-G1LtJcsoCbXSN-g5d8oHSZWsEKrCvRe_MV',
];

// Store transactions in memory and localStorage as a backup
const STORAGE_KEY = 'discord_transactions';

const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const storeTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

// Helper to format transaction for Discord message
const formatTransaction = (
  transaction: Transaction,
  action: 'added' | 'updated' | 'deleted'
): string => {
  const emoji = action === 'added' ? '🆕' : action === 'updated' ? '📝' : '🗑️';
  
  // Color based on type and action
  const color =
    action === 'deleted'
      ? 0x808080 // Gray for deleted
      : transaction.type.toLowerCase() === 'income'
      ? 0x00ff00 // Green for income
      : 0xff4500; // Red for expenses

  const actionTitle =
    action === 'deleted'
      ? 'Deleted'
      : transaction.type.toLowerCase() === 'income'
      ? 'Income Recorded'
      : 'Expense Recorded';

  return JSON.stringify({
    embeds: [
      {
        title: `${emoji} **Transaction ${actionTitle}**`,
        description: `A transaction has been **${action}**. Here are the details:`,
        color: color,
        fields: [
          {
            name: '💳 **Transaction ID**',
            value: `\`${transaction.id}\``,
            inline: false,
          },
          {
            name: '🔖 **Category**',
            value: `• **Type:** ${transaction.type}\n• **Category:** ${transaction.category}\n• **Sub-Category:** ${
              transaction.subCategory || 'N/A'
            }`,
            inline: true,
          },
          {
            name: '💰 **Amount**',
            value: `${transaction.currency} **${transaction.amount.toFixed(2)}**`,
            inline: true,
          },
          {
            name: '🗓️ **Date**',
            value: `📅 ${transaction.date}`,
            inline: true,
          },
          {
            name: '👤 **Personal**',
            value: transaction.isPersonal ? '✔️ Yes' : '❌ No',
            inline: true,
          },
          {
            name: '📝 **Description**',
            value: transaction.description || 'No description provided.',
            inline: false,
          },
        ],
        footer: {
          text: `Recorded on ${new Date().toLocaleString()}`,
          icon_url: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png', // A relevant icon URL
        },
        timestamp: new Date().toISOString(),
      },
    ],
  });
};

// Send message to all Discord webhooks
const sendToDiscord = async (content: string): Promise<boolean> => {
  try {
    const results = await Promise.all(
      WEBHOOK_URLS.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: content,
        })
      )
    );
    return results.every((response) => response.ok);
  } catch (error) {
    console.error('Error sending to Discord:', error);
    return false;
  }
};

export const DiscordService = {
  // Add new transaction
  async addTransaction(transaction: Transaction): Promise<boolean> {
    try {
      const content = formatTransaction(transaction, 'added');
      const success = await sendToDiscord(content);
      if (success) {
        const transactions = getStoredTransactions();
        transactions.unshift(transaction);
        storeTransactions(transactions);
      }
      return success;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  },

  // Update existing transaction
  async updateTransaction(transaction: Transaction): Promise<boolean> {
    try {
      const content = formatTransaction(transaction, 'updated');
      const success = await sendToDiscord(content);
      if (success) {
        const transactions = getStoredTransactions();
        const index = transactions.findIndex((t) => t.id === transaction.id);
        if (index !== -1) {
          transactions[index] = transaction;
          storeTransactions(transactions);
        }
      }
      return success;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  },

  // Delete transaction
  async deleteTransaction(transaction: Transaction): Promise<boolean> {
    try {
      const content = formatTransaction(transaction, 'deleted');
      const success = await sendToDiscord(content);
      if (success) {
        const transactions = getStoredTransactions();
        const filtered = transactions.filter((t) => t.id !== transaction.id);
        storeTransactions(filtered);
      }
      return success;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  },

  // Fetch all transactions
  async fetchTransactions(): Promise<Transaction[]> {
    return getStoredTransactions();
  },
};
