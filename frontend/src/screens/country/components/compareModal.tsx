import { GlobalOutlined, SwapOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Modal, Row, Select, Statistic } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import API from '../../../config/api';

interface CompareModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedCountry: any;
  onCompareCountrySelect: (countryId: string) => void;
  compareWith: any | null;
}

const CompareModal = ({
  isVisible,
  onClose,
  selectedCountry,
  onCompareCountrySelect,
  compareWith
}: CompareModalProps) => {
    const [countries, setCountries] = useState<any>([])


  const renderCountryCard = (country: any) => {
    if (!country) return null;

    return (
      <Card className="comparison-card">
        <div className="flag-container mb-3">
          <img
            src={country.flags?.svg}
            alt={`Flag of ${country.name.common}`}
            className="w-100"
          />
        </div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Statistic 
              title="Country"
              value={country.name.common }
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="Region"
              value={country.region}
              prefix={<GlobalOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="Population"
              value={country.population}
              prefix={<TeamOutlined />}
              formatter={(value) => value.toLocaleString()}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const fetchCountries = async() =>{
    try {
        let url = `${API.BASE_URL}countries/list/all`
        const response = await axios.get(url);
        setCountries(response.data)
    } catch (error) {
        console.log(error)
        setCountries([])
    }
  }

  useEffect(()=>{
    fetchCountries()
  },[])

  return (
    <Modal
      title="Compare Countries"
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="compare-container">
        <Row gutter={24} align="middle">
          <Col span={11}>
            {renderCountryCard(selectedCountry)}
          </Col>
          <Col span={2} className="text-center">
            <SwapOutlined style={{ fontSize: '24px' }} />
          </Col>
          <Col span={11}>
            {compareWith ? (
              renderCountryCard(compareWith)
            ) : (
              <Select
                placeholder="Select a country to compare"
                style={{ width: '100%' }}
                onChange={onCompareCountrySelect}
                showSearch
                filterOption={(input, option) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {countries
                  ?.filter((c:any) => c.cca3 !== selectedCountry?.cca3)
                  ?.map((country:any) => (
                    <Select.Option key={country.cca3} value={country.cca3}>
                      {country.name.common}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default CompareModal;