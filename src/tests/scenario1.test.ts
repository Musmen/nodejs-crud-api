describe('simple tests', () => {
  let a: number, b: number;

  test('should add two numbers', () => {
    a = 3;
    b = 5;

    expect(a + b).toEqual(8);
  });
});
