import { Button, Empty } from "antd";
import { TbError404 } from "react-icons/tb";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Empty
      image={<TbError404 color="grey" size={120} />}
      description={
        <div>
          <div className="notFoundText">Oops! Page not Found</div>
          <div>Sorry,we couldn't find the page you where looking for</div>
        </div>
      }
    >
      <Button
        type="primary"
        onClick={() => navigate("/", { replace: true })}
      >
        go Home
      </Button>
    </Empty>
  );
}
