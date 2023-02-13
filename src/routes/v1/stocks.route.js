const express = require('express');
const Stocks = require('../../models/stocks.model');

const router = express.Router();

// add stock price
router.post('/add/:companyCode', async (req, res) => {
  const stocks = await Stocks.findOne({ companyCode: req.params.companyCode });
  if (stocks) {
    stocks.stockPrices.unshift({ price: req.body.price });
    await stocks.save();
    res.send(stocks);
  } else {
    res.status(404);
    res.send({ message: 'The company with the company code does not exist. Therefore could not add stock price.' });
  }
});

// fetch stock price list
router.get('/get/:companyCode/:startDate/:endDate', async (req, res) => {
  const stocks = await Stocks.findOne({ companyCode: req.params.companyCode });
  const startDate = new Date(req.params.startDate);
  const endDate = new Date(req.params.endDate);
  endDate.setDate(endDate.getDate() + 1);

  if (stocks) {
    const filteredPrices = stocks.stockPrices.filter((price) => {
      const createdAt = new Date(price.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    const filteredStocks = {
      companyCode: stocks.companyCode,
      stockPrices: filteredPrices,
    };
    res.send(filteredStocks);
  } else {
    res.status(404);
    res.send({ message: ' The company does not exist.' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: add Stocks and get stocks detail
 */

/**
 * @swagger
 *  /stock/get/{companyCode}/{startDate}/{endDate}:
 *    get:
 *      summary: Get stock prices of company within the start date and end date
 *      description: Get stock prices of company within the start date and end date
 *      tags: [Stocks]
 *      parameters:
 *        - in: path
 *          name: companyCode
 *          required: true
 *          schema:
 *            type: number
 *          description: Company Code
 *        - in: path
 *          name: startDate
 *          required: true
 *          schema:
 *            type: string
 *          description: Start Date
 *        - in: path
 *          name: endDate
 *          required: true
 *          schema:
 *            type: string
 *          description: End Date
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  companyCode:
 *                    type: number
 *                    description: must be unique
 *                  stockPrices:
 *                    type: array
 *                    items:
 *                      price:
 *                        type: number
 *                example:
 *                  companyCode: 8394
 *                  stockPrice: [{ price: 12.2 }]
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 *  /stock/add/{companyCode}:
 *    post:
 *      summary: Add stock price to company
 *      description: Add stock price to company
 *      tags: [Stocks]
 *      parameters:
 *        - in: path
 *          name: companyCode
 *          required: true
 *          schema:
 *            type: number
 *          description: Company Code
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - price
 *              properties:
 *                price:
 *                  type: number
 *              example:
 *                price: 12.3
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  stocks:
 *                    type: object
 *                    properties:
 *                      companyCode:
 *                        type: number
 *                      stockPrices:
 *                        type: array
 *                        items:
 *                          price:
 *                            type: number
 *                    example:
 *                      companyCode: 8394
 *                      stockPrice: [{ price: 12.2 }]
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
