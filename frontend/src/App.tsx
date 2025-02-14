import { Route, Routes } from "react-router-dom";
import "./App.css";
import NotFound from "./components/notFound";
import CountryList from "./screens/country";
import CountryDetails from "./screens/country/components/detailsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/:code/details" element={<CountryDetails />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
