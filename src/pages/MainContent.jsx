// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const MainContent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/_data/tableData.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <main>
      <div className="">
        {/* <div className="w-[100%]">
          <Graphs />
        </div> */}
        <br />
        {/* <div className="w-[50%]">
          <Card>
            {data.map((item) => (
              <CardHeader key={item.id}>
                <CardTitle className="text-lg font-bold">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div>
                      <Avatar>
                        <AvatarImage
                          src={`/img/${item.image}`}
                          alt="item img"
                        />
                      </Avatar>
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div>
                        <CardDescription>{item.email}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{item.amount}</div>
                </div>
              </CardHeader>
            ))}
          </Card>
        </div> */}
      </div>
    </main>
  );
};

export default MainContent;
