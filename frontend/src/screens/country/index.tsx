import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Pagination, Select, Space, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import API from "../../config/api";
import CountryCard from "./components/countryCard";
import "./styles.scss";
import CompareModal from "./components/compareModal";

interface Country {
  name: string;
  flag: string;
  region: string;
  cca3: string;
  capital?: string[];
  timezones?: string[];
  population: number;
  currency?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}


const { Option } = Select;

const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [timezones, setTimezones] = useState<any[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [compareWithCountry, setCompareWithCountry] = useState<Country | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });


  const handleCompare = (country: Country) => {
    setSelectedCountry(country);
    setCompareWithCountry(null);
    setCompareModalVisible(true);
  };

  const fetchCountryDetails = async (code:string) => {
    try {
      let url = API.BASE_URL + API.COUNTRIES + `${code}`
      const response = await axios.get(url);
      return  response.data;
    } catch (err) {
      return null
    } 
  };


  const handleCompareCountrySelect = async(countryId: string) => {
    const data = await fetchCountryDetails(countryId)
    setCompareWithCountry(data || null);
  };

  const fetchCountries = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.itemsPerPage.toString()
      });

      if (searchTerm) queryParams.append("name", searchTerm);
      if (selectedRegion) queryParams.append("region", selectedRegion);
      if (selectedTimezone) queryParams.append("timezone", selectedTimezone);

      const endpoint = (searchTerm || selectedRegion || selectedTimezone) 
        ? `${API.BASE_URL}countries/search` 
        : `${API.BASE_URL}countries`;

      const response = await axios.get(`${endpoint}?${queryParams}`);
      
      setCountries(response.data.countries);
      setPagination(response.data.pagination);

      if (page === 1 && !searchTerm && !selectedRegion && !selectedTimezone) {
        const allTimezones = response.data.countries
          .flatMap((country: any) => country.timezones || [])
          .filter((timezone: string) => timezone && timezone !== "UTC");
        setTimezones([...new Set(allTimezones)].sort());
        setAllCountries(response.data.countries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries(1); 
  }, [searchTerm, selectedRegion, selectedTimezone]);

  const handlePageChange = (page: number) => {
    fetchCountries(page);
  };

  const searchCountries = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.itemsPerPage.toString()
      });

      if (searchTerm) queryParams.append("name", searchTerm);
      if (selectedRegion) queryParams.append("region", selectedRegion);
      if (selectedTimezone) queryParams.append("timezone", selectedTimezone);

      const response = await axios.get(
        `${API.BASE_URL}countries/search?${queryParams}`
      );
      setCountries(response.data.countries);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error searching countries:", error);
      setError("Failed to search countries. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const getLocalTime = (timezone: string): string => {
    try {
      const now = new Date();
      const offsetStr = timezone.replace("UTC", "");
      const [hours, minutes] = offsetStr.split(":").map(Number);
      const offsetInMinutes = hours * 60 + (minutes || 0);

      const localTime = new Date(
        now.getTime() + (offsetInMinutes + now.getTimezoneOffset()) * 60000
      );

      return localTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return "12:00 PM";
    }
  };

  useEffect(() => {
    if (searchTerm || selectedRegion || selectedTimezone) {
      searchCountries();
    } else {
      fetchCountries(1);
    }
  }, [searchTerm, selectedRegion, selectedTimezone]);

  const regions = [
    ...new Set(allCountries.map((country) => country.region)),
  ].filter(Boolean);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("");
    setSelectedTimezone("");
  };

  return (
    <Container fluid className="countryListContainer">
      <header className="country-header">
        <h1>Countries of the World</h1>
        <p>Explore countries and their details</p>
      </header>

      <Card className="filter-section mb-4">
        <Space direction="vertical" size="middle" className="w-100">
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Input
                placeholder="Search by country name"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Select Region"
                style={{ width: "100%" }}
                value={selectedRegion}
                onChange={handleRegionChange}
                size="large"
                allowClear
              >
                {regions.map((region) => (
                  <Option key={region} value={region}>
                    {region}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Select Timezone"
                style={{ width: "100%" }}
                value={selectedTimezone}
                onChange={handleTimezoneChange}
                size="large"
                allowClear
              >
                {timezones.map((timezone) => (
                  <Option key={timezone} value={timezone}>
                    {timezone}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {(searchTerm || selectedRegion || selectedTimezone) && (
            <div className="active-filters">
              <Space
                wrap
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  {searchTerm && (
                    <span className="filter-tag">Search: {searchTerm}</span>
                  )}
                  {selectedRegion && (
                    <span className="filter-tag">Region: {selectedRegion}</span>
                  )}
                  {selectedTimezone && (
                    <span className="filter-tag">
                      Timezone: {selectedTimezone}
                    </span>
                  )}
                </div>
                {(searchTerm || selectedRegion || selectedTimezone) && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                )}
              </Space>
            </div>
          )}
        </Space>
      </Card>

      {isLoading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      ) : (
        <>
          {countries.length > 0 ? (
            <>
              <Row className="g-4">
                {countries?.map((country: Country, index) => (
                  <Col key={index} xs={12} sm={6} md={3} lg={3} xl={3}>
                    <CountryCard
                      data={country}
                      currentTime={getLocalTime(country?.timezones[0])}
                      onCompare={handleCompare}
                    />
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-center mt-4 mb-4">
                <Pagination
                  current={pagination.currentPage}
                  total={pagination.totalItems}
                  pageSize={pagination.itemsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total:number) => `Total ${total} countries`}
                />
              </div>
            </>
          ) : (
            <div className="no-data">
              <i className="bi bi-search"></i>
              <p>No Countries Found</p>
            </div>
          )}
        </>
      )}

      <CompareModal
        isVisible={compareModalVisible}
        onClose={() => {
          setCompareModalVisible(false);
          setSelectedCountry(null);
          setCompareWithCountry(null);
        }}
        selectedCountry={selectedCountry}
        onCompareCountrySelect={handleCompareCountrySelect}
        compareWith={compareWithCountry}
      />
    </Container>
  );
};

export default CountryList;
