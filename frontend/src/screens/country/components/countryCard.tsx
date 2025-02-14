// CountryCard.tsx
import { ClockCircleOutlined, EnvironmentOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Space } from "antd";
import './styles.scss';
import { useNavigate } from 'react-router-dom';

interface CountryCardProps {
  data: any;
  currentTime: string;
  onCompare: (country: any) => void;
}

const CountryCard = ({ data,
   currentTime ,
   onCompare
  }: CountryCardProps) => {
    const navigate = useNavigate();
  const { Meta } = Card;

  return (
    <Card
      hoverable
      className="country-card"
      cover={
        <div className="flag-container">
          <img
            alt={`Flag of ${data?.name?.common}`}
            src={data?.flags?.svg}
            className="flag-image"
            loading='lazy'
          />
          <div className="time-badge">
            <ClockCircleOutlined /> {currentTime}
          </div>
        </div>
      }
    >
      <Meta
        title={
          <div className="card-title">
            <h3>{data?.name.common}</h3>
          </div>
        }
        description={
          <div className="card-details">
          <p>
            <EnvironmentOutlined /> {data.region}
          </p>
          <Space direction="vertical" className="w-100 d-flex items-center justify-center">
            <Button onClick={() => navigate(`/${data?.cca3}/details`)}>
              View Details
            </Button>
            <Button 
              type="dashed"
              icon={<SwapOutlined />}
              onClick={() => onCompare(data)}
            >
              Compare
            </Button>
          </Space>
        </div>
        }
      />
    </Card>
  );
};

export default CountryCard;