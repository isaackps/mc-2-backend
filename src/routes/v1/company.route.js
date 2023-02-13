const express = require('express');
const { Company, Stocks } = require('../../models');

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  try {
    const company = new Company({
      companyCode: req.body.companyCode,
      name: req.body.name,
      CEO: req.body.CEO,
      turnover: req.body.turnover,
      website: req.body.website,
      stockExchange: req.body.stockExchange,
    });
    const stocks = new Stocks({
      companyCode: req.body.companyCode,
      stockPrices: [],
    });
    await company.save();
    await stocks.save();

    res.send({ company, stocks });
  } catch (err) {
    res.status(400);
    const { message, error } = err;
    res.send({
      message,
      error: error || err,
    });
  }
});

// get all
router.get('/getall', async (req, res) => {
  const allCompany = await Company.find();
  const allStocks = await Stocks.find();
  const combined = allCompany.map((company) => {
    const stocks = allStocks.filter((stock) => stock.companyCode === company.companyCode);
    return { company, stocks: stocks[0] };
  });
  res.send(combined);
});

// get specific company info
router.get('/info/:companyCode', async (req, res) => {
  const company = await Company.findOne({
    companyCode: req.params.companyCode,
  });

  const stocks = await Stocks.findOne({
    companyCode: req.params.companyCode,
  });

  if (company && stocks) {
    res.send({ company, stocks });
  } else {
    res.status(404);
    res.send({ message: 'The company does not exist.' });
  }
});

// delete a company
router.delete('/delete/:companyCode', async (req, res) => {
  const company = await Company.deleteOne({
    companyCode: req.params.companyCode,
  });
  const stocks = await Stocks.deleteOne({
    companyCode: req.params.companyCode,
  });

  if (company.deletedCount && stocks.deletedCount) {
    res.status(200);
    res.send({ message: 'Company deleted successfully.' });
  } else {
    res.status(404);
    res.send({ message: 'The company does not exist.' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company register, delete and retrieval
 */

/**
 * @swagger
 * /company/register:
 *   post:
 *     summary: Create a company
 *     description: Create a company.
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyCode
 *               - name
 *               - CEO
 *               - turnover
 *               - website
 *               - stockExchange
 *             properties:
 *               companyCode:
 *                 type: number
 *                 description: must be unique
 *               name:
 *                 type: string
 *               CEO:
 *                 type: string
 *               turnover:
 *                 type: number
 *                 minLength: 9
 *                 description: must be more than 10CR
 *               website:
 *                 type: string
 *               stockExchange:
 *                 type: string
 *             example:
 *               companyCode: 8934
 *               name: My Company
 *               CEO: Gail
 *               turnover: 200000000
 *               website: mycompany.com
 *               stockExchange: MCO
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  company:
 *                    type: object
 *                    properties:
 *                      companyCode:
 *                        type: number
 *                        description: must be unique
 *                      name:
 *                        type: string
 *                      CEO:
 *                        type: string
 *                      turnover:
 *                        type: number
 *                        minLength: 9
 *                        description: must be more than 10CR
 *                      website:
 *                       type: string
 *                      stockExchange:
 *                        type: string
 *                    example:
 *                      companyCode: 8934
 *                      name: My Company
 *                      CEO: Gail
 *                      turnover: 200000000
 *                      website: mycompany.com
 *                      stockExchange: MCO
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
 *       "400":
 *         $ref: '#/components/responses/DuplicateCompany'
 *
 */

/**
 * @swagger
 * /company/getall:
 *   get:
 *     summary: Get all companies
 *     description: retrieve all companies.
 *     tags: [Company]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *
 */

/**
 * @swagger
 * /company/delete/{companyCode}:
 *   delete:
 *     summary: Delete a company
 *     description: Delete a company.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: companyCode
 *         required: true
 *         schema:
 *           type: number
 *         description: Company Code
 *     responses:
 *       "200":
 *         description: Company deleted successfully
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /company/info/{companyCode}:
 *   get:
 *     summary: Get a company's details
 *     description: Fetch details of the company of the company code.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: companyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Company Code
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  company:
 *                    type: object
 *                    properties:
 *                      companyCode:
 *                        type: number
 *                        description: must be unique
 *                      name:
 *                        type: string
 *                      CEO:
 *                        type: string
 *                      turnover:
 *                        type: number
 *                        minLength: 9
 *                        description: must be more than 10CR
 *                      website:
 *                       type: string
 *                      stockExchange:
 *                        type: string
 *                    example:
 *                      companyCode: 8934
 *                      name: My Company
 *                      CEO: Gail
 *                      turnover: 200000000
 *                      website: mycompany.com
 *                      stockExchange: MCO
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
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
