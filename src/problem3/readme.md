# Code Analysis: Performance Issues and Anti-patterns

## 1. List of Issues Found

### A. Syntax and Logic Errors

1. **Undefined variable**:

   - `lhsPriority` is used but not declared, should be `balancePriority`

2. **Incorrect filter logic**:

   - The condition `if (balance.amount <= 0) return true` will keep balances with amount <= 0, which is counterintuitive
   - Logic should filter out balances with amount > 0 and priority > -99

3. **Missing return statement in sort function**:

   - Missing return value for the case when `leftPriority === rightPriority`

4. **Type mismatch**:
   - `rows` maps over `sortedBalances` (type WalletBalance) but casts to `FormattedWalletBalance`
   - Interface `WalletBalance` is missing the `blockchain` field

### B. Performance Issues

5. **Unnecessary dependency array**:

   - `prices` is included in the dependency array of `useMemo` but not used in `sortedBalances`

6. **Redundant calculations**:

   - `formattedBalances` is calculated but never used
   - `sortedBalances` is mapped again in `rows` instead of using `formattedBalances`

7. **Missing memoization**:

   - `formattedBalances` is not memoized, will be recalculated on every re-render
   - `rows` is also not memoized

8. **Using index as key**:

   - `key={index}` instead of unique identifier can cause performance issues and bugs

9. **Unnecessary double mapping**:

   - `formattedBalances` and `rows` could be merged into a single map operation to avoid iterating twice over the same data

10. **Inefficient sorting with redundant function calls**:

    - `getPriority()` is called multiple times for the same blockchain during sorting, should cache priorities to avoid redundant calculations

11. **Magic number usage**:
    - `-99`, `0`, and priority values (`100`, `50`, `30`, `20`) are used as magic numbers, should be defined as named constants for better maintainability

### C. Anti-patterns

12. **Using `any` type and should use enum**:

    - `blockchain: any` instead of using specific enum type like `Blockchain`
    - Should create enum `Blockchain` for better type safety, maintainability, and auto-completion

13. **Missing error handling**:

    - No check if `prices[balance.currency]` exists

14. **Empty interface**:
    - `interface Props extends BoxProps {}` serves no clear purpose and creates unnecessary indirection

## 2. Refactored Version

```typescript
enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

const INVALID_BLOCKCHAIN_PRIORITY = -99;
const MIN_BALANCE_AMOUNT = 0;

const OSMOSIS_PRIORITY = 100;
const ETHEREUM_PRIORITY = 50;
const ARBITRUM_PRIORITY = 30;
const ZILLIQA_PRIORITY = 20;
const NEO_PRIORITY = 20;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

type Props = BoxProps;

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback((blockchain: Blockchain): number => {
    switch (blockchain) {
      case Blockchain.Osmosis:
        return OSMOSIS_PRIORITY;
      case Blockchain.Ethereum:
        return ETHEREUM_PRIORITY;
      case Blockchain.Arbitrum:
        return ARBITRUM_PRIORITY;
      case Blockchain.Zilliqa:
        return ZILLIQA_PRIORITY;
      case Blockchain.Neo:
        return NEO_PRIORITY;
      default:
        return INVALID_BLOCKCHAIN_PRIORITY;
    }
  }, []);

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => ({
        balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter(
        ({ balance, priority }) =>
          priority > INVALID_BLOCKCHAIN_PRIORITY &&
          balance.amount > MIN_BALANCE_AMOUNT
      )
      .sort((a, b) => b.priority - a.priority)
      .map(({ balance }) => balance);
  }, [balances, getPriority]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      const formattedAmount = balance.amount.toFixed();

      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
```

## 3. Explanation of Improvements

### A. Fixed Syntax and Logic Errors

- Changed `lhsPriority` to `balancePriority`
- Fixed filter logic to only keep balances with amount > MIN_BALANCE_AMOUNT and priority > INVALID_BLOCKCHAIN_PRIORITY
- Added return 0 for equal sort cases
- Added `blockchain` field to `WalletBalance` interface
- Created enum `Blockchain` instead of using `any` type for better type safety and maintainability
- Removed unnecessary `FormattedWalletBalance` interface by merging formatting logic
- Optimized sorting algorithm to cache priorities and avoid redundant function calls
- Replaced all magic numbers (`-99`, `0`, `100`, `50`, `30`, `20`) with named constants for better code maintainability
- Replaced empty interface with type alias to avoid unnecessary indirection

### B. Performance Improvements

- Removed `prices` from dependency array of `sortedBalances`
- Memoized `getPriority` function with `useCallback`
- Optimized `sortedBalances` by caching priorities to avoid redundant `getPriority` calls during sorting
- Merged `formattedBalances` into `rows` to avoid double mapping and improve performance
- Memoized `rows` to prevent unnecessary re-renders
- Used `currency` as key instead of index
- Replaced all magic numbers with named constants for better code maintainability

### C. Fixed Anti-patterns

- Created enum `Blockchain` instead of using `any` type for better type safety, maintainability, and auto-completion
- Added error handling with `|| 0` for undefined `prices[balance.currency]`
- Merged formatting logic into single mapping operation to avoid redundant iterations
- Replaced all magic numbers with descriptive constants (priority values, invalid priority, minimum balance)
- Replaced empty interface with type alias to eliminate unnecessary indirection

### D. Benefits of Refactored Version

- **Type safety**: Uses specific TypeScript enum instead of any type for better compile-time checking and auto-completion
- **Performance**: Avoids unnecessary re-calculations, redundant function calls, and double mapping iterations
- **Maintainability**: Code is more readable and maintainable with cleaner logic flow and named constants
- **Error handling**: Handles edge cases properly with fallback values
- **Consistency**: Clear and consistent logic with single responsibility for each operation
- **Efficiency**: Optimized sorting with cached priorities and reduced mapping operations
- **Code clarity**: Replaced all magic numbers with descriptive named constants for better readability and maintainability
- **Configuration management**: Priority values are now centralized and easy to modify without searching through code
- **Better IntelliSense**: Enum provides auto-completion and compile-time validation for blockchain values
- **Type efficiency**: Uses type alias instead of empty interface to reduce unnecessary type indirection
