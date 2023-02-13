const faker = require('faker');
const { Company } = require('../../../src/models');

describe('Company model', () => {
  describe('Company validation', () => {
    let newCompany;
    beforeEach(() => {
      newCompany = {
        companyCode: 4321,
        name: 'Company 1',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'Company1.com',
        stockExchange: 'C1',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new Company(newCompany).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if turnover is less than 100000000', async () => {
      newCompany.turnover = 10000;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if companyCode field is missing', async () => {
      delete newCompany.companyCode;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if name field is missing', async () => {
      delete newCompany.name;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if CEO field is missing', async () => {
      delete newCompany.CEO;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if turnover field is missing', async () => {
      delete newCompany.turnover;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if website field is missing', async () => {
      delete newCompany.website;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });

    test('should throw a validation error if stockExchange field is missing', async () => {
      delete newCompany.stockExchange;
      await expect(new Company(newCompany).validate()).rejects.toThrow();
    });
  });
});
