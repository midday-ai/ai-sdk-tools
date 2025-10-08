# Utilities

Shared utility functions used across the agents system.

## 📁 Files

### `date-helpers.ts`
Date and time utilities for financial operations:
- `getStartOfMonth()` / `getEndOfMonth()`
- `getStartOfYear()` / `getEndOfYear()`
- `getDaysAgo(days)` - Get date N days ago
- `formatDateRange(from, to)` - Format display
- `isValidISODate(dateString)` - Validation

### `filter-builders.ts`
Helper functions for building filter descriptions:
- `buildFilterDescription(filters)` - Human-readable filter text
- `cleanFilters(filters)` - Remove undefined/null values

### `fake-data.ts` ✨
Realistic fake data generators using `@faker-js/faker`:

#### Financial Reports
- `generateRevenueMetrics(params)` - Revenue analysis
- `generateProfitLossMetrics(params)` - P&L statements
- `generateRunwayMetrics(params)` - Runway calculations
- `generateBurnRateMetrics(params)` - Burn rate tracking
- `generateSpendingMetrics(params)` - Spending breakdown

#### Transactions
- `generateTransactions(params)` - List of transactions
- `generateTransaction(id)` - Single transaction details

#### Invoices
- `generateInvoices(params)` - List of invoices
- `generateInvoice(id)` - Single invoice details

## 🎲 Fake Data Features

### Realistic Financial Data
- **Proper calculations:** Revenue = profit + expenses
- **Realistic ranges:** Amounts between $50-$500K
- **Trends:** Growth percentages, burn rate efficiency
- **Breakdowns:** Categories, merchants, tags

### Smart Defaults
- Currency defaults to USD
- Dates respect provided ranges
- Page sizes honor limits
- Status distribution matches reality

### Consistent Structures
All fake data matches expected schemas:
- Proper date formats (ISO 8601)
- Complete customer objects
- Detailed line items
- Realistic metadata

## 💡 Usage Examples

### Generate Revenue Metrics
```typescript
import { generateRevenueMetrics } from './fake-data';

const data = generateRevenueMetrics({
  from: '2024-01-01',
  to: '2024-03-31',
  currency: 'USD'
});
// Returns: { period, currency, total, breakdown, growth }
```

### Generate Transactions
```typescript
import { generateTransactions } from './fake-data';

const data = generateTransactions({
  pageSize: 20,
  start: '2024-01-01',
  end: '2024-12-31',
  type: 'expense'
});
// Returns: { data: [...], pagination: {...} }
```

### Generate Invoice
```typescript
import { generateInvoice } from './fake-data';

const invoice = generateInvoice('INV-1234');
// Returns complete invoice with customer, line items, totals
```

## 🔄 Replacing with Real Data

When you're ready to use real database data, simply replace the fake data generators in the tool files:

```typescript
// Before (fake data):
import { generateRevenueMetrics } from '../../utils/fake-data';
execute: async ({ from, to, currency }) => {
  return generateRevenueMetrics({ from, to, currency });
}

// After (real data):
import { db } from '@/lib/database';
execute: async ({ from, to, currency }) => {
  return await db.getRevenueMetrics({ from, to, currency });
}
```

## 🎨 Customizing Fake Data

To customize the fake data:

1. **Edit generators** in `fake-data.ts`
2. **Adjust ranges** - Change min/max values
3. **Add fields** - Include additional data
4. **Change distributions** - Modify status/type probabilities

Example:
```typescript
// Increase revenue range
const totalRevenue = faker.number.float({
  min: 100000,  // was 50000
  max: 1000000, // was 500000
  fractionDigits: 2,
});
```

## 🧪 Testing

Fake data is perfect for:
- ✅ Development without database
- ✅ Testing agent behavior
- ✅ Demos and presentations
- ✅ Integration tests
- ✅ UI component development

## 📦 Dependencies

- `@faker-js/faker` (v10+) - Fake data generation
- No other external dependencies

---

**Status:** ✅ Complete  
**Generators:** 9 financial data generators  
**Coverage:** Reports, Transactions, Invoices

