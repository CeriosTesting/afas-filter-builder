import { Operator } from "../src/operator";
import { AfasFilter } from "../src/afas-filter";
import { OrderBy } from "../src/order-by";

type TestType = {
	id: number;
	name: string | null;
	valid: boolean;
};

const idTestObject = {
	type: "number",
	key: "id" as keyof TestType,
	value: 123,
};

const nameTestObject = {
	type: "string",
	key: "name" as keyof TestType,
	value: "test",
};

const validTestObject = {
	type: "boolean",
	key: "valid" as keyof TestType,
	value: true,
};

test("No setup should return empty filter query", () => {
	const filter = AfasFilter.create<TestType>().buildURLSearchParams();
	expect(filter.toString()).toBe("");
});

test("MOB Filter", () => {
	const filter = AfasFilter.create<TestType>()
		.skip(50)
		.take(25)
		.addFilter(idTestObject.key, idTestObject.value, Operator.EqualTo)
		.addFilter(nameTestObject.key, nameTestObject.value, Operator.Contains)
		.addFilter(validTestObject.key, validTestObject.value, Operator.NotEqualTo)
		.addOrderBy(idTestObject.key, OrderBy.Ascending)
		.addOrderBy(nameTestObject.key, OrderBy.Descending)
		.buildURLSearchParams();

	expect(filter.toString()).toBe(
		`skip=50&take=25&filterfieldids=${idTestObject.key},${nameTestObject.key},${validTestObject.key}&filtervalues=${idTestObject.value},${nameTestObject.value},${validTestObject.value}&operatortypes=${Operator.EqualTo.valueOf()},${Operator.Contains.valueOf()},${Operator.NotEqualTo}&orderbyfieldids=${idTestObject.key},-${nameTestObject.key}`.replace(
			/,/g,
			"%2C"
		)
	);
});

describe("Skip", () => {
	for (const skip of [-1, 0, 1, 99]) {
		test(`Skip ${skip} should be set correctly`, () => {
			const filter = AfasFilter.create<TestType>().skip(skip).buildURLSearchParams();
			expect(filter.get("skip")).toBe(skip.toString());
			expect(filter.toString()).toBe(`skip=${skip}`);
		});
	}
});

describe("Take", () => {
	for (const take of [-1, 0, 1, 99]) {
		test(`Take ${take} should be set correctly`, () => {
			const filter = AfasFilter.create<TestType>().take(take).buildURLSearchParams();
			expect(filter.get("take")).toBe(take.toString());
			expect(filter.toString()).toBe(`take=${take}`);
		});
	}
});

describe("AddFilter", () => {
	for (const testObject of [idTestObject, nameTestObject, validTestObject]) {
		test(`AddFilter with ${testObject.type} should be set correctly`, () => {
			const filter = AfasFilter.create<TestType>()
				.addFilter(testObject.key, testObject.value, Operator.EqualTo)
				.buildURLSearchParams();
			expect(filter.get("filterfieldids")).toBe(testObject.key);
			expect(filter.get("filtervalues")).toBe(testObject.value.toString());
			expect(filter.get("operatortypes")).toBe(Operator.EqualTo.valueOf().toString());
			expect(filter.toString()).toBe(
				`filterfieldids=${testObject.key}&filtervalues=${testObject.value}&operatortypes=${Operator.EqualTo.valueOf()}`
			);
		});
	}

	test("Multiple filters should be set in correct order", () => {
		const filter = AfasFilter.create<TestType>()
			.addFilter(nameTestObject.key, nameTestObject.value, Operator.EqualTo)
			.addFilter(idTestObject.key, idTestObject.value, Operator.Contains)
			.addFilter(validTestObject.key, validTestObject.value, Operator.NotEqualTo)
			.buildURLSearchParams();

		expect(filter.get("filterfieldids")).toBe(`${nameTestObject.key},${idTestObject.key},${validTestObject.key}`);
		expect(filter.get("filtervalues")).toBe(`${nameTestObject.value},${idTestObject.value},${validTestObject.value}`);
		expect(filter.get("operatortypes")).toBe(
			`${Operator.EqualTo.valueOf()},${Operator.Contains.valueOf()},${Operator.NotEqualTo.valueOf()}`
		);
		expect(filter.toString()).toBe(
			`filterfieldids=${nameTestObject.key},${idTestObject.key},${validTestObject.key}&filtervalues=${nameTestObject.value},${idTestObject.value},${validTestObject.value}&operatortypes=${Operator.EqualTo.valueOf()},${Operator.Contains.valueOf()},${Operator.NotEqualTo.valueOf()}`.replace(
				/,/g,
				"%2C"
			)
		);
	});

	test("Empty string filter value should be set correctly", () => {
		const filter = AfasFilter.create<TestType>()
			.addFilter(nameTestObject.key, "", Operator.EqualTo)
			.buildURLSearchParams();
		expect(filter.get("filtervalues")).toBe('""');
		expect(filter.toString()).toBe(
			`filterfieldids=${nameTestObject.key}&filtervalues=%22%22&operatortypes=${Operator.EqualTo.valueOf()}`
		);
	});

	test("Null filter value should be set correctly", () => {
		const filter = AfasFilter.create<TestType>()
			.addFilter(nameTestObject.key, null, Operator.EqualTo)
			.buildURLSearchParams();
		expect(filter.get("filtervalues")).toBe("null");
		expect(filter.toString()).toBe(
			`filterfieldids=${nameTestObject.key}&filtervalues=null&operatortypes=${Operator.EqualTo.valueOf()}`
		);
	});

	test("EqualTo should be default operator", () => {
		const filter = AfasFilter.create<TestType>()
			.addFilter(nameTestObject.key, nameTestObject.value)
			.buildURLSearchParams();
		expect(filter.get("operatortypes")).toBe(Operator.EqualTo.valueOf().toString());
	});
});

describe("AddOrderBy", () => {
	test("AddOrderBy with Descending should be set correctly with '-' before key", () => {
		const key = "id" as keyof TestType;
		const filter = AfasFilter.create<TestType>().addOrderBy(key, OrderBy.Descending).buildURLSearchParams();
		expect(filter.get("orderbyfieldids")).toBe(`-${key}`);
		expect(filter.toString()).toBe(`orderbyfieldids=-${key}`);
	});

	test("AddOrderBy with Ascending should be set correctly without '-' before key", () => {
		const key = "id" as keyof TestType;
		const filter = AfasFilter.create<TestType>().addOrderBy(key, OrderBy.Ascending).buildURLSearchParams();
		expect(filter.get("orderbyfieldids")).toBe(key);
		expect(filter.toString()).toBe(`orderbyfieldids=${key}`);
	});

	test("Multiple order bys should be set in correct order", () => {
		const idKey = "id" as keyof TestType;
		const nameKey = "name" as keyof TestType;

		const filter = AfasFilter.create<TestType>()
			.addOrderBy(idKey, OrderBy.Ascending)
			.addOrderBy(nameKey, OrderBy.Descending)
			.buildURLSearchParams();

		expect(filter.get("orderbyfieldids")).toBe(`${idKey},-${nameKey}`);
		expect(filter.toString()).toBe(`orderbyfieldids=${idKey},-${nameKey}`.replace(/,/g, "%2C"));
	});
});
