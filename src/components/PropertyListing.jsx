import { useEffect, useState } from "react";
import PropertyDetails from "./PropertyDetails";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import SkeletonCard from "./skeleton/Skeleton";
import { fetchPropertyCount } from "../utlils/fetchApi";
import PropTypes from "prop-types";

const PropertyListing = ({ conversionFunction, propertyCategory }) => {
  const [propertyListingData, setPropertyListingData] = useState({});
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPropertyCount(propertyCategory);
        setPropertyListingData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyCategory]);

  const toggleView = () => setViewAll((prev) => !prev);

  const propertyListingKeys = Object.keys(propertyListingData);
  const displayedData = viewAll
    ? propertyListingKeys
    : propertyListingKeys.slice(0, 4);

  if (loading) {
    return <SkeletonCard />;
  }
  return (
    <main>
      <PropertyDetails
        propertyListingData={propertyListingData}
        conversionFunction={conversionFunction}
        propertyCategory={propertyCategory}
      />
      <div className="flex justify-between items-center text-2xl font-bold">
        <div>Property Listings</div>
        <div>
          <Button className="text-lg" variant="link" onClick={toggleView}>
            {viewAll ? "View Less" : "View All"}
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-6 py-5">
        {displayedData
          .map((item, index) => ({
            id: index,
            title: item,
            amount: propertyListingData[item],
          }))
          .map((item) => (
            <div key={item.id}>
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <br />
                  <div>
                    <CardDescription className="text-3xl font-bold">
                      {conversionFunction(item.amount)}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
      </div>
    </main>
  );
};
PropertyListing.propTypes = {
  conversionFunction: PropTypes.func.isRequired,
  propertyCategory: PropTypes.string.isRequired,
};
export default PropertyListing;
