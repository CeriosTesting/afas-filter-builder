import { Operator } from "./operator";
import { OrderBy } from "./order-by";

/**
 * A utility class for building filters and query parameters for AFAS API requests.
 *
 * @template T - The type representing the entity being filtered.
 */
export class AfasFilter<T> {
	private _skip?: number;
	private _take?: number;
	private _fields: string[] = [];
	private _values: (string | null)[] = [];
	private _operators: Operator[] = [];
	private _orderBys: string[] = [];

	/**
	 * Private constructor to enforce the use of the static `create` method.
	 */
	private constructor() {}

	/**
	 * Creates a new instance of the `AfasFilter` class.
	 *
	 * @template T - The type representing the entity being filtered.
	 * @returns A new `AfasFilter` instance.
	 */
	static create<T>(): AfasFilter<T> {
		return new AfasFilter<T>();
	}

	/**
	 * Sets the number of records to skip in the query.
	 *
	 * @param skip - The number of records to skip.
	 * @returns The current `AfasFilter` instance for method chaining.
	 */
	skip(skip: number): this {
		this._skip = skip;
		return this;
	}

	/**
	 * Sets the maximum number of records to take in the query.
	 *
	 * @param take - The maximum number of records to take.
	 * @returns The current `AfasFilter` instance for method chaining.
	 */
	take(take: number): this {
		this._take = take;
		return this;
	}

	/**
	 * Adds a filter condition to the query.
	 *
	 * @param field - The field to filter on.
	 * @param value - The value to filter by.
	 * @param operator - The operator to use for the filter (default is `Operator.EqualTo`).
	 * @returns The current `AfasFilter` instance for method chaining.
	 */
	addFilter<K extends keyof T>(field: K, value: T[K], operator: Operator = Operator.EqualTo): this {
		const fieldName = this.getFieldName(field);
		let filterValue = value !== null && value !== undefined ? value.toString() : "";

		if (typeof value === "string" && value === "") {
			filterValue = '""';
		}

		if (value === null) {
			filterValue = "null";
		}

		this._fields.push(fieldName);
		this._values.push(filterValue);
		this._operators.push(operator);

		return this;
	}

	/**
	 * Adds an order-by condition to the query.
	 *
	 * @param field - The field to order by.
	 * @param order - The order direction (`OrderBy.Ascending` or `OrderBy.Descending`).
	 * @returns The current `AfasFilter` instance for method chaining.
	 */
	addOrderBy<K extends keyof T>(field: K, order: OrderBy): this {
		let fieldName = this.getFieldName(field);
		if (order === OrderBy.Descending) {
			fieldName = `-${fieldName}`;
		}
		this._orderBys.push(fieldName);
		return this;
	}

	/**
	 * Builds the query parameters as a `URLSearchParams` object.
	 *
	 * @returns A `URLSearchParams` object containing the query parameters.
	 */
	buildURLSearchParams(): URLSearchParams {
		const params = new URLSearchParams();

		const mappings: [string, any][] = [
			["skip", this._skip],
			["take", this._take],
			["filterfieldids", this._fields.join(",")],
			["filtervalues", this._values.join(",")],
			["operatortypes", this._operators.join(",")],
			["orderbyfieldids", this._orderBys.join(",")],
		];

		mappings.forEach(([key, value]) => {
			if (value !== undefined && value !== "") {
				params.append(key, value.toString());
			}
		});

		return params;
	}

	/**
	 * Converts a field name to a string representation.
	 *
	 * @param field - The field to convert.
	 * @returns The string representation of the field.
	 */
	private getFieldName(field: keyof T): string {
		return field as string;
	}
}
