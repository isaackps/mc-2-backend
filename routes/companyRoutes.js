const express = require("express");
const Company = require("../models/company");
const router = express.Router();

// get all
router.get("/getall", async (req, res) => {
  const allCompany = await Company.find();
  res.send(allCompany);
});

// register
router.post("/register", async (req, res) => {
  try {
    const company = new Company({
      companyCode: req.body.companyCode,
      name: req.body.name,
      CEO: req.body.CEO,
      turnover: req.body.turnover,
      website: req.body.website,
      stockExchange: req.body.stockExchange,
    });
    await company.save();
    res.send(company);
  } catch (err) {
    res.status(400);
    const error = err.errors;
    const message = err.message;
    res.send({
      message: message,
      error: error || err,
    });
  }
});

// get specific company info
router.get("/info/:companyCode", async (req, res) => {
  console.log(req.params.companyCode);
  const company = await Company.findOne({
    companyCode: req.params.companyCode,
  });

  if (company) {
    res.send(company);
  } else {
    res.status(404);
    res.send({ message: "The company does not exist." });
  }
});

// delete a company
router.delete("/delete/:companyCode", async (req, res) => {
  const company = await Company.deleteOne({
    companyCode: req.params.companyCode,
  });

  if (company.deletedCount) {
    res.status(200);
    res.send({ message: "Company deleted successfully." });
  } else {
    res.status(404);
    res.send({ message: "The company does not exist." });
  }
});

module.exports = router;
