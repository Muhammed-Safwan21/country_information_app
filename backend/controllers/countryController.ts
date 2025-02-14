import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const REST_COUNTRIES_API = process.env.REST_COUNTRIES_API;

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const response = await axios.get(`${REST_COUNTRIES_API}/all`);


    // Calculate pagination
    const totalCountries = response.data.length;
    const totalPages = Math.ceil(totalCountries / limit);
    const paginatedCountries = response.data.slice(skip, skip + limit);

    res.json({
      countries: paginatedCountries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCountries,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(500).json({ message: "Error fetching countries" });
  }
};

export const getAllCountriesWithoutPagination = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const response = await axios.get(`${REST_COUNTRIES_API}/all`);

    res.json(response.data);
  } catch (error) {
    console.log("error==>", error);
    res.status(500).json({ message: "Error fetching countries" });
  }
};



//  country by code
export const getCountryByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const response = await axios.get(`${REST_COUNTRIES_API}/alpha/${code}`);
    const country = response.data[0];

    res.json(country);
  } catch (error) {
    res.status(404).json({ message: "Country not found" });
  }
};

export const getCountriesByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const response = await axios.get(`${REST_COUNTRIES_API}/region/${region}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching region data" });
  }
};


export const searchCountries = async (req: Request, res: Response) => {
  try {
    const { name, region, timezone } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const response = await axios.get(`${process.env.REST_COUNTRIES_API}/all`);
    
    let filteredCountries = response.data;

    if (name) {
      filteredCountries = response.data.filter((country: any) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase())
      );
    }

    if (region) {
      filteredCountries = response.data.filter((country: any) =>
        country.region.toLowerCase() === (region as string).toLowerCase()
      );
    }

    if (timezone) {
      filteredCountries = response.data.filter((country: any) =>
        country.timezones.includes(timezone)
      );
    }

    if (name && region) {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase()) &&
        country.region.toLowerCase() === (region as string).toLowerCase()
      );
    }
    
    if (region && timezone) {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.region.toLowerCase() === (region as string).toLowerCase() &&
        country.timezones.includes(timezone)
      );
    }
    
    if (name && timezone) {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase()) &&
        country.timezones.includes(timezone)
      );
    }
    
    if (name && timezone && region) {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase()) &&
        country.region.toLowerCase() === (region as string).toLowerCase() &&
        country.timezones.includes(timezone)
      );
    }

    const totalCountries = filteredCountries.length;
    const totalPages = Math.ceil(totalCountries / limit);
    const skip = (page - 1) * limit;
    const paginatedCountries = filteredCountries.slice(skip, skip + limit);

    res.json({
      countries: paginatedCountries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCountries,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error("Error searching countries:", error);
    res.status(500).json({ message: "Error searching countries" });
  }
};
