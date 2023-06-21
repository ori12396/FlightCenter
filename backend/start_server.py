from flask import Flask, jsonify, request
from utils import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/users', methods=['GET', 'POST', 'DELETE'])
def my_first_my_second():

    if request.method == 'GET':
        try:
            username = request.args.get('username')
            password = request.args.get('password')
        except:
            return jsonify({"0": "bad - not got username\password in query params"})

        is_exist, user = check_username_password_exist(username, password)
        if is_exist:
            return jsonify({"1": user})
        else:
            return jsonify({"0": "bad - not exist"})

    elif request.method == 'POST':
        try:
            username = request.json.get('username')
            password = request.json.get('password')
            email = request.json.get('email')
            country = request.json.get('country')
            phonenumber = request.json.get('phonenumber')  # Updated parameter name
        except:
            return jsonify({"0": "bad - not got username\password\email\country in the body request"})
        is_exist, user = check_username_password_exist(username, password)
        if is_exist:
            return jsonify({"0": "bad - already exist"})
        else:
            add_user_info(username, password, email, country, phonenumber)
            return jsonify({"1": "good - added successfully"})

    elif request.method == 'DELETE':
        return jsonify({"-1": "to do"})


@app.route('/paypal/initiate-payment', methods=['POST'])
def initiate_paypal_payment():
    try:
        client_id = "AeqyMHi_ZJoeof8Nbud_2REfWLQhyZERgUywd2m-b--x7MPRPp-gWKccDD8ukn3tSNPbFQJ0SQ2fBFW9"
        client_secret = "EHb0VbTHggcAny4eNfIlRLKeGNuDyj3Vy_-QbW0InOnhEIdVUAU9bzSTSwy7Vrt5tQzMVtgkbo9qvBsu"
        send_to = request.json.get('send_to')
        send_to2 = request.json.get('send_to2')
        price = request.json.get('price')

        recipients = [
            {'email': send_to, 'amount': price},
            {'email': send_to2, 'amount': 9}
        ]

        # Perform payment using PayPal
        send_payment(client_id, client_secret, recipients)

        # Return success response
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


@app.route('/delete', methods=['DELETE'])
def delete_sale():
    if request.method == 'DELETE':
        try:
            saleid = request.json.get('saleid')
            
        except:
            return jsonify({"0": "bad - not got saleid in the request body"})

        is_deleted = delete_sale_by_id(saleid)
        if is_deleted:
            return jsonify({"1": "Sale deleted successfully"})
        else:
            return jsonify({"0": "Sale not found"})


@app.route('/sales', methods=['POST'])
def filter_sales_by_city():
    if request.method == 'POST':
        try:
            sales_filter = request.get_json()
            startfrom = request.args.get('startfrom', default=0, type=int)
            howmany = request.args.get('howmany', default=15, type=int)
            orderby = request.args.get('orderby')
            userID = int(request.args.get('userID'))
            
            if orderby == 'None':
                sales_list = filter_sales_oreder_by_none(sales_filter, howmany, startfrom)
            elif orderby == 'Price':
                sales_list = filter_sales_order_by_price(sales_filter, howmany, startfrom)
            elif orderby == 'Close Date':
                sales_list = filter_sales_order_by_close_date(sales_filter, howmany, startfrom)
            elif orderby == 'Our Recommendation':
                sales_list = filter_sales_order_by_special(sales_filter, userID, howmany, startfrom)
            return jsonify({"1": sales_list})
        except:
            return jsonify({"0": "bad - invalid request"})

@app.route('/airlines', methods=['GET'])
def get_arilines():
    if request.method == 'GET':
        aln = get_airline_names()
        airlines_dict = {str(i): airline for i, airline in enumerate(aln)}
       
        return jsonify({"1": aln})
        
@app.route('/findsalesfrom', methods=['GET'])
def find_sales():
    if request.method == 'GET':
        try:
            fromcity = request.args.get('fromcity')
        except:
            return jsonify({"0": "bad - not got city in query params"})
        sales_list = give_sales_from_city(fromcity)
        return jsonify({"1": sales_list})



@app.route('/allcities', methods=['GET'])
def all_cities():
    if request.method == 'GET':
        all_citiess = get_all_cities()
        return jsonify({"1": all_citiess})


@app.route('/cityimage', methods=['GET'])
def city_image():
    if request.method == 'GET':
        try:
            cityname = request.args.get('cityname')
        except:
            return jsonify({"0": "bad - not got cityname in query params"})
        cityimg = give_city_img(cityname.lower())
        return jsonify({"1": cityimg})


@app.route('/finduser', methods=['GET'])
def find_user():
    if request.method == 'GET':
        try:
            userid = request.args.get('userid')
        except:
            return jsonify({"0": "bad - not got userid in query params"})
        user = give_user_from_userid(userid)
        return jsonify({"1": user})


@app.route('/finduserbyname', methods=['GET'])
def find_user_by_name():
    if request.method == 'GET':
        try:
            username = request.args.get('username')
        except:
            return jsonify({"0": "bad - not got username in query params"})
        user = give_user_from_username(username)
        return jsonify({"1": user})

@app.route('/getallusersale', methods=['GET'])
def get_all_user_sales():
    if request.method == 'GET':
        try:
            usersale = request.args.get('usersale')
        except:
            return jsonify({"0": "bad - not got usersale in query params"})
        sales_list = get_sales_by_usersale(usersale)
        return jsonify({"1": sales_list})



@app.route('/getsales', methods=['GET'])
def get_sales():
    if request.method == 'GET':
        try:
            how_many = request.args.get('howmany')
            start_from = request.args.get('startfrom')
        except:
            return jsonify({"0": "bad - not got howmany\ startfrom in the body request"})
        the_sales = give_me_sales(how_many, start_from)
        return jsonify({"1": the_sales})


@app.route('/getairlineidbyname', methods=['GET'])
def get_airline_id_by_name():
    if request.method == 'GET':
        try:
            airline_name = request.args.get('airlinename')
        except:
            return jsonify({"0": "bad - not got howmany\ startfrom in the body request"})
        airline_id = give_airline_id(airline_name.lower())
        return jsonify({"1": airline_id})


@app.route('/getairlinelogobyname', methods=['GET'])
def get_airline_logo_by_name():
    if request.method == 'GET':
        try:
            airline_name = request.args.get('airlinename')
        except:
            return jsonify({"0": "bad - not got howmany\ startfrom in the body request"})
        airline_logo = give_airline_logo(airline_name.lower())
        return jsonify({"1": airline_logo})


@app.route('/addnewsale', methods=['POST'])
def add_new_sale():
    if request.method == 'POST':
        try:
            usersale = request.json.get('usersale')
            fromcity= request.json.get('fromcity')
            fromcountry = request.json.get('fromcountry')
            tocity = request.json.get('tocity')
            tocityimg= request.json.get('tocityimg')
            tocountry= request.json.get('tocountry')
            flightdate= request.json.get('flightdate')
            airlineid= request.json.get('airlineid')
            airlinename= request.json.get('airlinename')
            logo= request.json.get('logo')
            price= request.json.get('price')
            flightnumber= request.json.get('flightnumber')
            starthour = request.json.get('starthour')
            endhour = request.json.get('endhour')
        except:
            return jsonify({"0": "bad - not got the data in the body request"})
        issucceed = add_sale(usersale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour)
        return jsonify({"1": issucceed})


@app.route('/payforsale', methods=['POST'])
def pay_for_sale():
    if request.method == 'POST':
        try:
            saleid = request.json.get('saleid')
            usersale = request.json.get('usersale')
            salenumber = request.json.get('salenumber')
            print("salenumber")
            print(salenumber)
            buynumber = request.json.get('buynumber')
            userbuy = request.json.get('userbuy')
            passportbuyname = request.json.get('passportbuyname')
            buymail = request.json.get('buymail')
            fromcity= request.json.get('fromcity')
            fromcountry = request.json.get('fromcountry')
            tocity = request.json.get('tocity')
            tocountry= request.json.get('tocountry')
            flightdate= request.json.get('flightdate')
            airlinename= request.json.get('airlinename')
            price= request.json.get('price')
            flightnumber= request.json.get('flightnumber')
            starthour = request.json.get('starthour')
            endhour = request.json.get('endhour')
            userID = request.json.get('userID')
        except:
            return jsonify({"0": "bad - not got the data in the body request"})
        issucceed = pay_sale(saleid, usersale, salenumber, buynumber, userbuy, passportbuyname, buymail, fromcity, fromcountry, tocity, tocountry, flightdate, airlinename, price, flightnumber, starthour, endhour, userID)
        return jsonify({"1": issucceed})


@app.route('/buyyergotticket', methods=['POST'])
def buyyer_got_ticket():
    if request.method == 'POST':
        try:
            saleid = request.json.get('saleid')
            usersale = request.json.get('usersale')
            salenumber = request.json.get('salenumber')
            buynumber = request.json.get('buynumber')
            userbuy = request.json.get('userbuy')
            passportbuyname = request.json.get('passportbuyname')
            buymail = request.json.get('buymail')
            fromcity= request.json.get('fromcity')
            fromcountry = request.json.get('fromcountry')
            tocity = request.json.get('tocity')
            tocountry= request.json.get('tocountry')
            flightdate= request.json.get('flightdate')
            airlinename= request.json.get('airlinename')
            price= request.json.get('price')
            flightnumber= request.json.get('flightnumber')
            starthour = request.json.get('starthour')
            endhour = request.json.get('endhour')
            userID = request.json.get('userID')
        except:
            return jsonify({"0": "bad - not got the data in the body request"})
        issucceed = buyyer_got(saleid, usersale, salenumber, buynumber, userbuy, passportbuyname, buymail, fromcity, fromcountry, tocity, tocountry, flightdate, airlinename, price, flightnumber, starthour, endhour, userID)
        return jsonify({"1": issucceed})


@app.route('/addsaletomiddle', methods=['POST'])	
def add_sale_to_middle():	
    if request.method == 'POST':	
        try:	
            saleid = request.json.get('saleid')	
            userID = request.json.get('userID')	
            flightnumber = request.json.get('flightnumber')	
            saleusername = request.json.get('saleusername')	
            fromcountry = request.json.get('fromcountry')	
            tocountry = request.json.get('tocountry')	
        except:	
            return jsonify({"0": "bad - not got saleid, flightnumber, or userID in the request body"})	
        result = sale_to_middle(saleid, userID, flightnumber, 'middle', saleusername, fromcountry, tocountry)	
        if result:	
            return jsonify({"1": "Flight state added successfully"})	
        else:	
            return jsonify({"0": "Failed to add flight state"})


@app.route('/updatesaletodone', methods=['POST'])
def add_sale_to_done():
    if request.method == 'POST':
        try:
            saleid = request.json.get('saleid')
            userID = request.json.get('userID')
            flightnumber = request.json.get('flightnumber')
        except:
            return jsonify({"0": "bad - not got saleid, flightnumber, or userID in the request body"})

        result = sale_to_done(saleid, userID, flightnumber, 'done')
        if result:
            return jsonify({"1": "Flight state updated successfully"})
        else:
            return jsonify({"0": "Failed to update flight state"})


@app.route('/issaleinmiddlewithme', methods=['GET'])
def is_sale_in_middle_with_me():
    if request.method == 'GET':
        try:
            saleid = request.args.get('saleid')
            userID = int(request.args.get('userID'))
            flightnumber = request.args.get('flightnumber')
        except:
            return jsonify({"0": "bad - not got saleid, flightnumber, or userID in the request body"})

        result = is_the_sale_state_found_with_me(saleid, userID, flightnumber, 'middle')
        if result:
            return jsonify({"1": "found"})
        else:
            return jsonify({"0": "not found"})

@app.route('/issaleinmiddlewithsomeone', methods=['GET'])
def is_sale_in_middle_with_someone():
    if request.method == 'GET':
        try:
            saleid = request.args.get('saleid')
            flightnumber = request.args.get('flightnumber')
        except:
            return jsonify({"0": "bad - not got saleid, flightnumber in args"})

        result = is_the_sale_state_found_with_someone(saleid, flightnumber, 'middle')
        if result:
            return jsonify({"1": "found"})
        else:
            return jsonify({"0": "not found"})


@app.route('/issaleindone', methods=['GET'])
def is_sale_in_middle():
    if request.method == 'GET':
        try:
            saleid = request.args.get('saleid')
            userID = int(request.args.get('userID'))
            flightnumber = args.json.get('flightnumber')
        except:
            return jsonify({"0": "bad - not got saleid, flightnumber, or userID in the request body"})

        result = is_the_sale_state_found(saleid, userID, flightnumber, 'done')
        if result:
            return jsonify({"1": "found"})
        else:
            return jsonify({"0": "not found"})



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000)
