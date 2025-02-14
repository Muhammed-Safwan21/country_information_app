import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Row, Space, Spin, Statistic } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.scss';
import API from '../../../config/api';

const CountryDetails = () => {
  const {code} = useParams();

  const navigate = useNavigate();
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);

        let url = API.BASE_URL + API.COUNTRIES + `${code}`
        const response = await axios.get(url);
        setCountry(response.data);
      } catch (err) {
        setError('Failed to load country details');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !country) {
    return (
      <Container className="mt-4">
        <Alert
          message="Error"
          description={error || 'Country not found'}
          type="error"
          showIcon
        />
      </Container>
    );
  }

  return (
    <Container fluid className="country-details py-4">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to Countries
      </Button>

      <Row gutter={[24, 24]}>
        {/* Left Column - Flag and Basic Info */}
        <Col xs={24} lg={8}>
          <Card 
            className="country-card"
            cover={
              <div className="flag-container">
                <img
                  alt={`Flag of ${country.name}`}
                  src={country.flags.svg}
                  className="flag-image"
                />
              </div>
            }
          >
            <Card.Meta
              title={<h1 className="country-name">{country.name.common}</h1>}
              description={
                <Space direction="vertical" className="w-100">
                  <p className="official-name">{country.name.official}</p>
                  <div className="current-time">
                    <ClockCircleOutlined /> Current Time: {getLocalTime(country.timezones[0])}
                  </div>
                </Space>
              }
            />
          </Card>
        </Col>

        {/* Right Column - Detailed Information */}
        <Col xs={24} lg={16}>
          {/* Key Statistics */}
          <Card className="mb-4">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Population"
                  value={country.population}
                  prefix={<TeamOutlined />}
                  formatter={(value) => value.toLocaleString()}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Region"
                  value={country.region}
                  prefix={<GlobalOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Capital"
                  value={country.capital?.[0] || 'N/A'}
                  prefix={<EnvironmentOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Area"
                  value={`${country.area.toLocaleString()} km²`}
                  prefix={<GlobalOutlined />}
                />
              </Col>
            </Row>
          </Card>

          <Card title="Detailed Information">
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Languages">
                {Object.values(country.languages || {}).join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Currencies">
                {Object.entries(country.currencies || {}).map(([code, currency]:any) => (
                  `${currency.name} (${currency.symbol})`
                )).join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Timezones">
                {country.timezones.join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Subregion">
                {country.subregion || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Native Names */}
          <Card title="Native Names" className="mt-4">
            <Row gutter={[16, 16]}>
              {Object.entries(country.name.nativeName || {}).map(([lang, names]:any) => (
                <Col xs={24} sm={12} key={lang}>
                  <Card size="small">
                    <p className="mb-1"><strong>{lang}:</strong></p>
                    <p className="mb-1">Official: {names.official}</p>
                    <p className="mb-0">Common: {names.common}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CountryDetails;