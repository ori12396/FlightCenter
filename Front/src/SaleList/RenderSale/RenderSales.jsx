import RenderSale from "./RenderSale";
import { useState, useEffect } from "react";


export default function RenderSales({ sales, userID ,user,toDelete}) {
  console.log(sales)
  console.log(userID)
  
  const [saleData, setSaleData] = useState([]);
  useEffect(() => {
    if (sales) {
      const salelist = sales[1];
      const data = [];
      for (let s in salelist) {
        data.push({
          "saleid": salelist[s][0],
          "usernamesale": salelist[s][1],
          "fromcity": salelist[s][2],
          "fromcountry": salelist[s][3],
          "tocity": salelist[s][4],
          "tocityimg": salelist[s][5],
          "tocountry": salelist[s][6],
          "flightdate": salelist[s][7],
          "airlineid": salelist[s][8],
          "airlinename": salelist[s][9],
          "logo": salelist[s][10],
          "price": salelist[s][11],
          "flightnumber": salelist[s][12],
          "starthour": salelist[s][13],
          "endhour": salelist[s][14]
        })
      }
      setSaleData(data);
    }
  }, [sales]);
  var renderedSales = saleData.map((currentsaledata, key) => {
    return (
      <RenderSale
        key={key}
        saleid={currentsaledata.saleid}
        usernamesale={currentsaledata.usernamesale}
        fromcity={currentsaledata.fromcity}
        fromcountry={currentsaledata.fromcountry}
        tocity={currentsaledata.tocity}
        tocityimg={currentsaledata.tocityimg}
        tocountry={currentsaledata.tocountry}
        flightdate={currentsaledata.flightdate}
        airlineid={currentsaledata.airlineid}
        airlinename={currentsaledata.airlinename}
        logo={currentsaledata.logo}
        price={currentsaledata.price}
        flightnumber={currentsaledata.flightnumber}
        starthour={currentsaledata.starthour}
        endhour={currentsaledata.endhour}
        userID={userID}
        user={user}
      />
    );
  });
  return renderedSales;
}
