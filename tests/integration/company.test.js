const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Company } = require('../../src/models');

setupTestDB();

describe('Company routes', () => {
  describe('POST /api/v1.0/market/company/register', () => {
    let newCompany;

    beforeEach(() => {
      newCompany = {
        companyCode: 7485,
        name: 'NFC Company',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'nfc.com',
        stockExchange: 'NFC',
      };
    });

    test('should return 200 and successfully create a company if data is ok', async () => {
      const res = await request(app).post('/api/v1.0/market/company/register').send(newCompany).expect(httpStatus.OK);

      expect(res.body).toEqual({
        company: {
          _id: expect.anything(),
          __v: expect.anything(),
          companyCode: newCompany.companyCode,
          name: newCompany.name,
          CEO: newCompany.CEO,
          turnover: newCompany.turnover,
          website: newCompany.website,
          stockExchange: newCompany.stockExchange,
        },
        stocks: {
          _id: expect.anything(),
          __v: expect.anything(),
          companyCode: newCompany.companyCode,
          stockPrices: [],
        },
      });

      const dbCompany = await Company.findOne({ companyCode: newCompany.companyCode });
      expect(dbCompany).toBeDefined();
      expect(dbCompany).toMatchObject({
        companyCode: newCompany.companyCode,
        name: newCompany.name,
        CEO: newCompany.CEO,
        turnover: newCompany.turnover,
        website: newCompany.website,
        stockExchange: newCompany.stockExchange,
      });
    });

    test('should return 400 error if company detail is missing any field', async () => {
      delete newCompany.CEO;
      await request(app).post('/api/v1.0/market/company/register').send(newCompany).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if turnover is less than 100000000', async () => {
      newCompany.turnover = 100000;
      await request(app).post('/api/v1.0/market/company/register').send(newCompany).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/v1.0/market/company/getall', () => {
    let newCompany;

    beforeEach(() => {
      newCompany = {
        companyCode: 7485,
        name: 'NFC Company',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'nfc.com',
        stockExchange: 'NFC',
      };
    });

    test('should return 200 and get all companies details', async () => {
      await request(app).post('/api/v1.0/market/company/register').send(newCompany).expect(httpStatus.OK);

      const res = await request(app).get('/api/v1.0/market/company/getall').send().expect(httpStatus.OK);

      expect(res.body).toEqual([
        {
          company: {
            _id: expect.anything(),
            __v: expect.anything(),
            companyCode: newCompany.companyCode,
            name: newCompany.name,
            CEO: newCompany.CEO,
            turnover: newCompany.turnover,
            website: newCompany.website,
            stockExchange: newCompany.stockExchange,
          },
          stocks: {
            _id: expect.anything(),
            __v: expect.anything(),
            companyCode: newCompany.companyCode,
            stockPrices: [],
          },
        },
      ]);

      expect(res.body).toHaveLength(1);
    });

    test('should return 200 and empty array if database is empty', async () => {
      const res = await request(app).get('/api/v1.0/market/company/getall').send().expect(httpStatus.OK);
      expect(res.body).toEqual([]);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/v1.0/market/company/info/:companyCode', () => {
    let newCompany;

    beforeEach(async () => {
      newCompany = {
        companyCode: 7485,
        name: 'NFC Company',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'nfc.com',
        stockExchange: 'NFC',
      };
      await request(app).post('/api/v1.0/market/company/register').send(newCompany);
    });

    test('should return 200 and the company object if data is ok', async () => {
      const res = await request(app)
        .get(`/api/v1.0/market/company/info/${newCompany.companyCode}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        company: {
          _id: expect.anything(),
          __v: expect.anything(),
          companyCode: newCompany.companyCode,
          name: newCompany.name,
          CEO: newCompany.CEO,
          turnover: newCompany.turnover,
          website: newCompany.website,
          stockExchange: newCompany.stockExchange,
        },
        stocks: {
          _id: expect.anything(),
          __v: expect.anything(),
          companyCode: newCompany.companyCode,
          stockPrices: [],
        },
      });
    });

    test('should return 404 if company code is not found in DB', async () => {
      await request(app).get(`/api/v1.0/market/company/info/1234`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /api/v1.0/market/company/delete/:companyCode', () => {
    let newCompany;

    beforeEach(async () => {
      newCompany = {
        companyCode: 7485,
        name: 'NFC Company',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'nfc.com',
        stockExchange: 'NFC',
      };
    });

    test('should return 200 if data is ok', async () => {
      await request(app).post('/api/v1.0/market/company/register').send(newCompany);
      await request(app).delete(`/api/v1.0/market/company/delete/${newCompany.companyCode}`).send().expect(httpStatus.OK);

      const dbCompany = await Company.findOne({ companyCode: newCompany.companyCode });
      expect(dbCompany).toBeNull();
    });

    test('should return 404 error if company already is not found', async () => {
      await request(app)
        .delete(`/api/v1.0/market/company/delete/${newCompany.companyCode}`)
        .send()
        .expect(httpStatus.NOT_FOUND);

      const dbCompany = await Company.findOne({ companyCode: newCompany.companyCode });
      expect(dbCompany).toBeNull();
    });
  });
});
