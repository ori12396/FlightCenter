export default class APIService {
  static async initiatePayPalPayment(sendTo, sendTo2, price) {
    try {
      const url = 'http://localhost:8000/paypal/initiate-payment';
      console.log("finish middle inititate")
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          send_to: sendTo,
          send_to2: sendTo2,
          price: price
        })
      });

      if (!response.ok) {
        throw new Error('Error initiating PayPal payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error initiating PayPal payment:', error);
    }
  }


  static async InsertUser(obj) {
    let url = 'http://localhost:8000/users';
    let data = JSON.stringify({
      username: obj.userName,
      password: obj.password,
      country: obj.country,
      email: obj.email,
      phonenumber: obj.phonenumber
    });

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static async DeleteSale(saleid) {
    let url = 'http://localhost:8000/delete';
    let data = JSON.stringify({ saleid: saleid });
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static async FetchSales(obj, howmany, startfrom, orderby, userID) {
    let url = `http://localhost:8000/sales?howmany=${howmany}&startfrom=${startfrom}&orderby=${orderby}&userID=${userID}`;
    let data = JSON.stringify({
      date: obj.fromDate,
      fromcountry: obj.fromCountry,
      tocountry: obj.toCountry,
      maxprice: obj.maxPrice
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static GetLogin(obj) {
    let begin = `http://localhost:8000/users?username=`
    let query = begin.concat(obj.userName, "&password=", obj.password)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
  static async GetAirlines() {
    let url = 'http://localhost:8000/airlines';
    return fetch(url, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }


  /*static GetAllGames() {
    let query = `http://localhost:8000/allgames`
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }*/

  static GetAllCities() {
    let query = `http://localhost:8000/allcities`
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static FindUserByID(ID) {
    let begin = `http://localhost:8000/finduser?userid=`
    let query = begin.concat(ID)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static FindUserByName(username) {
    let begin = `http://localhost:8000/finduserbyname?username=`
    let query = begin.concat(username)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static async getFlightById(id) {
    let url = `http://localhost:8000/flights?id`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }


  static GetSalesFromCity(fromcity) {
    let begin = `http://localhost:8000/findsalesfrom?fromcity=`
    let query = begin.concat(fromcity)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static GetImageBycity(cityname) {
    let begin = `http://localhost:8000/cityimage?cityname=`
    let query = begin.concat(cityname)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }


  static GetNsales(start, count) {
    let begin = 'http://localhost:8000/getsales?howmany='
    let query = begin.concat(count, "&startfrom=", start)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static GetCityImage(cityname) {
    let begin = 'http://localhost:8000/cityimage?cityname='
    let query = begin.concat(cityname)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static GetAirlineIdByName(airlinename) {
    let begin = 'http://localhost:8000/getairlineidbyname?airlinename='
    let query = begin.concat(airlinename)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
  static async GetAllUserSales(usersale) {
    let url = `http://localhost:8000/getallusersale?usersale=${usersale}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }


  static GetAirlineLogoByName(airlinename) {
    let begin = 'http://localhost:8000/getairlinelogobyname?airlinename='
    let query = begin.concat(airlinename)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static async InsertSale(obj) {
    let url = 'http://localhost:8000/addnewsale';
    let data = JSON.stringify({ usersale: obj.usersale, fromcity: obj.fromcity, fromcountry: obj.fromcountry, tocity: obj.tocity, tocityimg: obj.tocityimg, tocountry: obj.tocountry, flightdate: obj.flightdate, airlineid: obj.airlineid, airlinename: obj.airlinename, logo: obj.logo, price: obj.price, flightnumber: obj.flightnumber, starthour: obj.starthour, endhour: obj.endhour });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static async PayForSale(obj) {
    let url = 'http://localhost:8000/payforsale';
    let data = JSON.stringify({ saleid: obj.saleid, usersale: obj.usersale, salenumber: obj.salenumber, buynumber: obj.buynumber, userbuy: obj.userbuy, passportbuyname: obj.passportbuyname, buymail: obj.buymail, fromcity: obj.fromcity, fromcountry: obj.fromcountry, tocity: obj.tocity, tocountry: obj.tocountry, flightdate: obj.flightdate, airlinename: obj.airlinename, price: obj.price, flightnumber: obj.flightnumber, starthour: obj.starthour, endhour: obj.endhour, userID: obj.userID });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static async BuyyerGotTicket(obj) {
    let url = 'http://localhost:8000/buyyergotticket';
    let data = JSON.stringify({ saleid: obj.saleid, usersale: obj.usersale, salenumber: obj.salenumber, buynumber: obj.buynumber, userbuy: obj.userbuy, passportbuyname: obj.passportbuyname, buymail: obj.buymail, fromcity: obj.fromcity, fromcountry: obj.fromcountry, tocity: obj.tocity, tocountry: obj.tocountry, flightdate: obj.flightdate, airlinename: obj.airlinename, price: obj.price, flightnumber: obj.flightnumber, starthour: obj.starthour, endhour: obj.endhour, userID: obj.userID });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }


  static async AddSaleToMiddle(obj) {
    let url = 'http://localhost:8000/addsaletomiddle';
    let data = JSON.stringify({ saleid: obj.saleid, userID: obj.userID, flightnumber: obj.flightnumber, saleusername: obj.saleusername, fromcountry: obj.fromcountry, tocountry: obj.tocountry });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }
  static async UpdateSaleToDone(obj) {
    let url = 'http://localhost:8000/updatesaletodone';
    let data = JSON.stringify({ saleid: obj.saleid, userID: obj.userID, flightnumber: obj.flightnumber });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    });
  }

  static IsSaleInMiddleWithMe(saleid, userID, flightnumber) {
    let begin = 'http://localhost:8000/issaleinmiddlewithme?saleid='
    let query = begin.concat(saleid, "&userID=", userID.toString(), "&flightnumber=", flightnumber)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static IsSaleInMiddleWithSomeone(saleid, flightnumber) {
    let begin = 'http://localhost:8000/issaleinmiddlewithsomeone?saleid='
    let query = begin.concat(saleid, "&flightnumber=", flightnumber)
    return fetch(query, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}