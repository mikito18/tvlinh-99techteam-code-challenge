const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./index');

describe('Sum to N Functions', () => {
  test('test-1-case-0', () => {
    // Test case: n = 0, expected: 0
    expect(sum_to_n_a(0)).toBe(0);
    expect(sum_to_n_b(0)).toBe(0);
    expect(sum_to_n_c(0)).toBe(0);
  });

  test('test-2-case-1', () => {
    expect(sum_to_n_a(1)).toBe(1);
    expect(sum_to_n_b(1)).toBe(1);
    expect(sum_to_n_c(1)).toBe(1);
  });

  test('test-3-case-5', () => {
    expect(sum_to_n_a(5)).toBe(15);
    expect(sum_to_n_b(5)).toBe(15);
    expect(sum_to_n_c(5)).toBe(15);
  });

  test('test-4-case-100', () => {
    expect(sum_to_n_a(100)).toBe(5050);
    expect(sum_to_n_b(100)).toBe(5050);
    expect(sum_to_n_c(100)).toBe(5050);
  });

  test('test-5-case-1000', () => {
    expect(sum_to_n_a(1000)).toBe(500500);
    expect(sum_to_n_b(1000)).toBe(500500);
    expect(sum_to_n_c(1000)).toBe(500500);
  });
}); 