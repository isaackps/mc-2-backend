const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Stocks routes', () => {
  describe('POST /api/v1.0/market/stock/add/:companyCode', () => {
    let newCompany;
    let newStocks;

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
      newStocks = {
        price: 12.2,
      };
    });

    test('should return 200 and successfully added a stock price if data is ok', async () => {
      const res = await request(app)
        .post(`/api/v1.0/market/stock/add/${newCompany.companyCode}`)
        .send(newStocks)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        _id: expect.anything(),
        __v: expect.anything(),
        companyCode: newCompany.companyCode,
        stockPrices: [
          {
            _id: expect.anything(),
            createdAt: expect.anything(),
            price: newStocks.price,
            updatedAt: expect.anything(),
          },
        ],
      });
    });

    test('should return 404 error when company is missing', async () => {
      await request(app).post(`/api/v1.0/market/stock/add/1234`).send(newStocks).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/v1.0/market/stock/get/:companyCode/:startDate/:endDate', () => {
    let newCompany;
    let newStocks;

    beforeEach(async () => {
      newCompany = {
        companyCode: 7486,
        name: 'NFC Company',
        CEO: faker.name.findName(),
        turnover: 200000000,
        website: 'nfc.com',
        stockExchange: 'NFC',
      };
      await request(app).post('/api/v1.0/market/company/register').send(newCompany);
      newStocks = {
        price: 12.2,
      };
      await request(app).post(`/api/v1.0/market/stock/add/${newCompany.companyCode}`).send(newStocks);
    });
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    const queryDate = `${year}-${month + 1}-${date}`;

    test('should return 200 if data is ok', async () => {
      const res = await request(app).get(`/api/v1.0/market/stock/get/${newCompany.companyCode}/${queryDate}/${queryDate}`);

      expect(res.body).toEqual({
        companyCode: 7486,
        stockPrices: [
          {
            _id: expect.anything(),
            createdAt: expect.anything(),
            price: newStocks.price,
            updatedAt: expect.anything(),
          },
        ],
      });
    });

    test('should return 404 error when company is missing', async () => {
      await request(app).get(`/api/v1.0/market/stock/get/${123}/${queryDate}/${queryDate}`).expect(httpStatus.NOT_FOUND);
    });
  });
});
