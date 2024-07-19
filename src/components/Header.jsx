import { Input } from "@/components/ui/input";
import { useCallback, useContext, useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { appContext } from "@/contexts/Context";
import { Button } from "./ui/button";
import { saveToLocalStorage } from "@/utlils/SaveLocalStorage";
import { Card, CardHeader } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PriceTag from "./headerComponent/priceTag/PriceTag";
import AreaTag from "./headerComponent/areaTag/AreaTag";
import BedsTag from "./headerComponent/beds/BedsTag";
import PropertyTag from "./headerComponent/property_type/PropertyTag";
import Spinner from "./spinner/Spinner";
import {
  fetchAvailableCities,
  fetchSearchSuggestions,
  searchCityData,
} from "../utlils/fetchApi";
import PropTypes from "prop-types";

const Header = ({ propertyCategory }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("islamabad");
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const simpleContext = useContext(appContext);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const cities = await fetchAvailableCities();
      setData(cities);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    simpleContext.setAppState((s) => ({
      ...s,
      searchTerm: searchTerm,
    }));
  }, [searchTerm]);

  const cleanValue = (value) => (value ? value.replace(/,/g, "") : "");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      simpleContext.setAppState((s) => ({
        ...s,
        loading: true,
      }));

      const {
        selectedAmountMin,
        selectedAmountMax,
        selectedAreaMin,
        selectedAreaMax,
        selectBeds,
        propertyState,
      } = simpleContext.appState;

      const filters = {
        price_min: cleanValue(selectedAmountMin),
        price_max: cleanValue(selectedAmountMax),
        area_min: selectedAreaMin,
        area_max: selectedAreaMax,
        bedrooms: selectBeds,
        property_type:
          propertyState.selectedSubProperty ??
          propertyState.selectedPropertyType,
      };

      const data = await searchCityData(
        selectedCity,
        searchTerm,
        1,
        "id",
        "ASC",
        filters,
        propertyCategory
      );

      simpleContext.setAppState((s) => ({
        ...s,
        cardData: data.properties,
        pageData: {
          total_count: Number(data.total_count),
          page_number: 1,
        },
        totalPages: Math.ceil(
          Number(data.total_count) / Number(data.page_size)
        ),
        currentPage: data.page_number,
        isApiCall: true,
      }));

      navigate("/search-results", {
        state: {
          cardData: data.properties,
          totalCount: data.total_count,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      simpleContext.setAppState((s) => ({
        ...s,
        loading: false,
      }));
    }
  };
  const handleChange = async (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    simpleContext.setAppState((s) => ({
      ...s,
      searchTerm: newValue,
    }));
    saveToLocalStorage("searchTerm", newValue);
    if (newValue.length >= 2) {
      try {
        const suggestions = await fetchSearchSuggestions(newValue);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Property Search</div>
        <div>
          <Button
            className="text-lg"
            variant="link"
            onClick={isVisible || toggleVisibility}
          >
            Advance Search
          </Button>
        </div>
      </div>
      <br />
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="w-[100%] p-2">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                  <div className=" text-4xl font-bold">
                    <Select onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Islamabad" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid col-span-2">
                    <Input
                      value={searchTerm}
                      onChange={handleChange}
                      onClick={isVisible || toggleVisibility}
                      placeholder="Location"
                    />
                    <div className="absolute z-10 mt-10 w-[42%] text-black">
                      {suggestions.length > 0 && (
                        <ul className="bg-white border border-gray-200 w-full rounded">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className="p-2 cursor-pointer hover:bg-gray-200 text-sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                    <Button onClick={handleSearch}>Search</Button>
                  </div>
                </div>
                <div>
                  <div>
                    <div
                      className={`transition-all duration-500 ${
                        isVisible
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      {/* <p className="text-sm">Location</p>
                        <Input
                          value={searchTerm}
                          onChange={handleChange}
                          // onClick={isVisible || toggleVisibility}
                          placeholder="Enter Location"
                        />
                      </div> */}
                      <br />
                      <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm">Price Range</p>
                          <PriceTag />
                        </div>
                        <div>
                          <p className="text-sm">Property Type</p>
                          <PropertyTag />
                        </div>
                        <div>
                          <p className="text-sm">Area</p>
                          <AreaTag />
                        </div>
                        <div>
                          <p className="text-sm">Bedrooms</p>
                          <BedsTag />
                        </div>
                      </div>
                    </div>
                    {/* <div>
                      <Button onClick={handleSearch} className="w-[24%]">
                        Search
                      </Button>
                    </div> */}

                    <Button
                      variant="primary"
                      onClick={toggleVisibility}
                      className="flex items-center px-1 py-1 bg-inherit hover:bg-inherit text-xs"
                    >
                      {isVisible ? (
                        <FaAngleDown className="mr-2" />
                      ) : (
                        <FaAngleUp className="mr-2" />
                      )}
                      {isVisible ? "Less Options" : "More Options"}
                    </Button>
                  </div>
                </div>
              </form>
              {simpleContext.appState.loading && <Spinner />}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
Header.propTypes = {
  propertyCategory: PropTypes.string.isRequired,
};

export default Header;
