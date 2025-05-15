# afas-filter-builder

A TypeScript library for building filters and query parameters for AFAS GetConnectors. This library provides a fluent API to construct filters, sorting, and pagination for AFAS API requests.

## Features

- **Fluent API**: Easily chain methods to build complex filters.
- **Type-Safe**: Leverages TypeScript generics to ensure type safety.
- **Flexible Filtering**: Add filters with various operators like `EqualTo`, `Contains`, `NotEqualTo`, etc.
- **Sorting**: Add sorting with ascending or descending order.
- **Pagination**: Support for `skip` and `take` parameters.

## Installation

Install the library using npm:

```bash
npm i @cerios/afas-filter-builder
```

Dev

```bash
npm i -D @cerios/afas-filter-builder
```

## Usage

### Basic Example

```typescript
import { AfasFilter } from "afas-filter-builder";
import { Operator } from "afas-filter-builder/src/operator";
import { OrderBy } from "afas-filter-builder/src/order-by";

type ExampleType = {
	id: number;
	name: string | null;
	isActive: boolean;
};

const filter = AfasFilter.create<ExampleType>()
	.skip(10)
	.take(20)
	.addFilter("id", 123, Operator.EqualTo)
	.addFilter("name", "test", Operator.Contains)
	.addOrderBy("id", OrderBy.Ascending)
	.buildURLSearchParams();

console.log(filter.toString());
// Output: skip=10&take=20&filterfieldids=id,name&filtervalues=123,test&operatortypes=1,6&orderbyfieldids=id
```

### API Reference

#### `AfasFilter.create<T>()`

Creates a new instance of `AfasFilter` for the specified type `T`.

#### `.skip(skip: number): this`

Sets the number of records to skip.

#### `.take(take: number): this`

Sets the number of records to take.

#### `.addFilter<K extends keyof T>(field: K, value: T[K], operator: Operator = Operator.EqualTo): this`

Adds a filter for the specified field, value, and operator.

- `field`: The field to filter on.
- `value`: The value to filter by.
- `operator`: The operator to use (default is `EqualTo`).

#### `.addOrderBy<K extends keyof T>(field: K, order: OrderBy): this`

Adds a sorting order for the specified field.

- `field`: The field to sort by.
- `order`: The sorting order (`OrderBy.Ascending` or `OrderBy.Descending`).

#### `.buildURLSearchParams(): URLSearchParams`

Builds and returns the query parameters as a `URLSearchParams` object.

### Operators

The following operators are available in the `Operator` enum:

- `EqualTo`
- `GreaterThanOrEqualTo`
- `LessThanOrEqualTo`
- `GreaterThen`
- `LessThen`
- `Contains`
- `NotEqualTo`
- `IsEmpty`
- `IsNotEmpty`
- `StartsWith`
- `DoesntContain`
- `DoesntStartWith`
- `EndsWith`
- `DoesntEndWith`
- `QuickFilter`

### Sorting

The `OrderBy` enum provides the following options:

- `OrderBy.Ascending`
- `OrderBy.Descending`

### Advanced Example

```typescript
const filter = AfasFilter.create<ExampleType>()
	.addFilter("isActive", true, Operator.EqualTo)
	.addFilter("name", null, Operator.IsEmpty)
	.addOrderBy("name", OrderBy.Descending)
	.buildURLSearchParams();

console.log(filter.toString());
// Output: filterfieldids=isActive,name&filtervalues=true,null&operatortypes=1,8&orderbyfieldids=-name
```

## Running Tests

This project uses Jest for testing. To run the tests, use:

```bash
npm test
```

## License

This project is licensed under the [MIT License](LICENSE).
