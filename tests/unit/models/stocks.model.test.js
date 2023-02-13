const { Stocks } = require('../../../src/models');

describe('Stocks model', () => {
  describe('Stocks validation', () => {
    let newStocks;
    beforeEach(() => {
      newStocks = {
        companyCode: 1234,
        stockPrices: [{ price: 12.2 }],
      };
    });

    test('should correctly validate a valid stocks', async () => {
      await expect(new Stocks(newStocks).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if companyCode field is missing', async () => {
      delete newStocks.companyCode;
      await expect(new Stocks(newStocks).validate()).rejects.toThrow();
    });
  });
});
