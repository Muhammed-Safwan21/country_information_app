import express from "express";
import {
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountries,
  getAllCountriesWithoutPagination,
} from "../controllers/countryController";

const router = express.Router();

router.get("/countries/search", searchCountries);
router.get("/countries/list/all", getAllCountriesWithoutPagination);
router.get("/countries/:code", getCountryByCode);
router.get("/countries/region/:region", getCountriesByRegion);
router.get("/countries", getAllCountries);


export default router;
