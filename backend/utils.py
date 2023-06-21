import csv
import random
import string
import codecs
import pandas as pd
import datetime
import mysql.connector
import paypalrestsdk
import requests
import uuid
from twilio.rest import Client
from datetime import datetime, date
HOST = 'localhost'
USER = 'root'
PASSWORD = 'Ckvckv089'
DATABASE = 'flightsproject'

ACCOUNT_SID = "ACf107772fd48b763042d0d51f00d5319a"
AUTH_TOKEN = "d0bd1d5bb84282af00b9594b6e8874f6"
FROM_NUMBER = "+14155238886"
next_saleid = 0
		
countries_data={}	
contries_similarity = {}

def send_payment(client_id, client_secret, recipients):
    # Set up PayPal API credentials
    auth_url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
    payment_url = 'https://api-m.sandbox.paypal.com/v1/payments/payouts'

    auth_data = {
        'grant_type': 'client_credentials'
    }

    auth_response = requests.post(auth_url, auth=(client_id, client_secret), data=auth_data)
    access_token = auth_response.json()['access_token']

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

    sender_batch_id = str(uuid.uuid4())  # Generate a unique sender_batch_id

    items = []
    for recipient in recipients:
        payee_email = recipient['email']
        amount = recipient['amount']

        item = {
            'recipient_type': 'EMAIL',
            'amount': {
                'value': amount,
                'currency': 'USD'
            },
            'note': 'This is the payment for the flight. Thanks for using us!',
            'receiver': payee_email
        }

        items.append(item)

    payout_data = {
        'sender_batch_header': {
            'sender_batch_id': sender_batch_id,
            'email_subject': 'Payment from My App'
        },
        'items': items
    }

    response = requests.post(payment_url, headers=headers, json=payout_data)

    if response.status_code == 201:
        return "Payments sent successfully."
    else:
        error_message = response.json()['message']
        raise Exception(f"Error sending payments: {error_message}")

    response = requests.post(payment_url, headers=headers, json=payout_data)

    if response.status_code == 201:
        return "Payment sent successfully."
    else:
        error_message = response.json()['message']
        raise Exception(f"Error sending payment: {error_message}")


def send_whatsapp_message(account_sid, auth_token, from_number, to_number, message):
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=message,
        from_=f'whatsapp:{from_number}',
        to=f'whatsapp:{to_number}'
    )

def get_airline_names():
    # Connect to the database
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor to execute the query
    cursor = cnx.cursor()

    # Execute the query
    cursor.execute("SELECT airlinename FROM airlines")

    # Fetch the results and create a list
    results = cursor.fetchall()
    airlines = []
    for row in results:
        airlines.append(row[0])

    # Close the cursor and database connection
    cursor.close()
    cnx.close()

    # Return the list of airline names
    return airlines

def delete_sale_by_id(saleid):
    # Connect to the database
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor to execute the query
    cursor = cnx.cursor()

    # Delete the sale from the database
    delete_query = "DELETE FROM sales WHERE saleid = %s"
    cursor.execute(delete_query, (saleid,))

    # Check if any rows were affected (sale found and deleted)
    is_deleted = cursor.rowcount > 0

    # Commit the transaction and close the cursor and connection
    cnx.commit()
    cursor.close()
    cnx.close()

    return is_deleted  # Return a boolean value indicating the success of the deletion

def check_username_password_exist(username, password):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Prepare the SQL query to check if the given username and password exist in the 'users' table
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    values = (username, password)

    # Execute the query
    cursor.execute(query, values)

    # Fetch the first row of the result set
    row = cursor.fetchone()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # If no row was found, return False and -1
    if row is None:
        return False, -1
    # Otherwise, return True and the row data as a list
    else:
        return True, list(row)


def add_user_info(username, password, email, country,phonenumber):
    # Connect to MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )
    cursor = cnx.cursor()

    # Prepare SQL statement to insert new user data
    add_user = ("INSERT INTO users "
                "(userID, username, password, email, country, phonenumber) "
                "VALUES (%s, %s, %s, %s, %s, %s)")

    # Generate new userID
    cursor.execute("SELECT MAX(userID) FROM users")
    result = cursor.fetchone()
    userID = int(result[0]) + 1 if result[0] is not None else 1
    # Insert new user data into the table
    user_data = (userID, username, password, email, country, phonenumber)
    cursor.execute(add_user, user_data)
    cnx.commit()

    # Close database connection
    cursor.close()
    cnx.close()




def give_sales_from_city(fromcity):
    # Connect to MySQL database
    cnx = mysql.connector.connect(user=USER, password=PASSWORD,
                                  host=HOST, database=DATABASE)
    # Read data from MySQL table using pandas
    fromcity = fromcity.lower()
    df = pd.read_sql(f"SELECT * FROM sales WHERE LOWER(fromcity) = '{fromcity}'", con=cnx)
    # Close database connection
    cnx.close()
    return df.values.tolist()


# def get_all_cities():
#     my_cities_table = pd.read_csv("famous_cities100.csv")
#
#     # Convert the dataframe to a list of lists
#     all_cities = my_cities_table.values.tolist()
#
#     return all_cities
#
#
# def give_city_img(cityname):
#     cityname = cityname.lower()
#     city_img = "notgood-1"
#     df = pd.read_csv('famous_cities100.csv')
#     row = df.loc[df['city'].str.lower() == cityname]
#     if row.empty:
#         city_img = "not found image for this city, maybe you give me wrong city name"
#     else:
#         city_img = row['img'].values[0]
#     return city_img



def give_city_img(cityname):
    db = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )
    cursor = db.cursor()
    query = "SELECT img FROM cities WHERE LOWER(city) = %s"
    cursor.execute(query, (cityname.lower(),))
    result = cursor.fetchone()
    if result is None:
        city_img = "not found image for this city, maybe you give me wrong city name"
    else:
        city_img = result[0]
    cursor.close()
    db.close()
    return city_img



def give_user_from_userid(userid):
    # Connect to MySQL Server
    conn = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Query the users table using the given userid
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE userID = %s"
    cursor.execute(query, (str(userid).strip(),))
    result = cursor.fetchall()

    # Check if a user was found with the given userid
    if len(result) == 0:
        return "User with this ID was not found. Please check the ID and try again."
    else:
        return result


def give_user_from_username(username):
    # Connect to MySQL Server
    conn = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Query the users table using the given userid
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = %s"
    cursor.execute(query, (username.strip(),))
    result = cursor.fetchall()

    # Check if a user was found with the given userid
    if len(result) == 0:
        return "User with this username was not found. Please check the name and try again."
    else:
        return result


def give_me_sales(how_many, start_from):
    if how_many is None:
        how_many = 0
    else:
        how_many = int(how_many)

    if start_from is None:
        start_from = 0
    else:
        start_from = int(start_from)

    # Connect to MySQL server
    cnx = mysql.connector.connect(user=USER, password=PASSWORD,
                                  host=HOST, database=DATABASE)
    cursor = cnx.cursor()

    # Execute the select query
    query = f"SELECT * FROM sales LIMIT {start_from}, {how_many}"
    cursor.execute(query)

    # Retrieve the results and convert to a list of tuples
    rows = cursor.fetchall()
    sales = [list(row) for row in rows]

    # Close the cursor and connection
    cursor.close()
    cnx.close()

    return sales

def filter_sales_oreder_by_none(obj, howmany=15, startfrom=0):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to filter sales data
    query = "SELECT * FROM sales"
    filters = []
    values = []
    if 'date' in obj and obj['date']:
        filters.append("flightdate = %s")
        values.append(obj['date'])
    if 'fromcountry' in obj and obj['fromcountry']:
        filters.append("fromcountry = %s")
        values.append(obj['fromcountry'])
    if 'tocountry' in obj and obj['tocountry']:
        filters.append("tocountry = %s")
        values.append(obj['tocountry'])
    if 'maxprice' in obj and obj['maxprice']:
        filters.append("CAST(price AS DECIMAL(10,2)) <= %s")
        values.append(obj['maxprice'])

    if len(filters) > 0:
        query += " WHERE " + " AND ".join(filters)

    # Add pagination to the query
    query += f" LIMIT {howmany} OFFSET {startfrom}"

    cursor.execute(query, values)
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # Convert the result set to a list of dictionaries
    # Convert the result set to a list of tuples
    sales = [list(row) for row in rows]
    return sales


def filter_sales_order_by_price(obj, howmany=15, startfrom=0):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to filter sales data
    query = "SELECT * FROM sales"
    filters = []
    values = []
    
    if 'date' in obj and obj['date']:
        filters.append("flightdate = %s")
        values.append(obj['date'])
    if 'fromcountry' in obj and obj['fromcountry']:
        filters.append("fromcountry = %s")
        values.append(obj['fromcountry'])
    if 'tocountry' in obj and obj['tocountry']:
        filters.append("tocountry = %s")
        values.append(obj['tocountry'])
    if 'maxprice' in obj and obj['maxprice']:
        filters.append("price <= %s")
        values.append(obj['maxprice'])

    if len(filters) > 0:
        query += " WHERE " + " AND ".join(filters)

    # Add ORDER BY clause to sort by price in ascending order with casting
    query += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC"

    # Add pagination to the query
    query += f" LIMIT {howmany} OFFSET {startfrom}"

    cursor.execute(query, values)
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # Convert the result set to a list of dictionaries
    # Convert the result set to a list of tuples
    sales = [list(row) for row in rows]
    return sales




def filter_sales_order_by_close_date(obj, howmany=15, startfrom=0):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to filter sales data
    query = "SELECT * FROM sales"
    filters = []
    values = []
    
    if 'date' in obj and obj['date']:
        filters.append("flightdate = %s")
        values.append(obj['date'])
    if 'fromcountry' in obj and obj['fromcountry']:
        filters.append("fromcountry = %s")
        values.append(obj['fromcountry'])
    if 'tocountry' in obj and obj['tocountry']:
        filters.append("tocountry = %s")
        values.append(obj['tocountry'])
    if 'maxprice' in obj and obj['maxprice']:
        filters.append("price <= %s")
        values.append(obj['maxprice'])

    if len(filters) > 0:
        query += " WHERE " + " AND ".join(filters)

    # Calculate the current date
    current_date = date.today().strftime("%Y-%m-%d")

    # Add ORDER BY clause to sort by the closest future date
    query += f" ORDER BY ABS(DATEDIFF(flightdate, '{current_date}')) ASC"

    # Add pagination to the query
    query += f" LIMIT {howmany} OFFSET {startfrom}"

    cursor.execute(query, values)
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # Convert the result set to a list of dictionaries
    # Convert the result set to a list of tuples
    sales = [list(row) for row in rows]
    return sales



def get_sales_by_usersale(usersale):
    # Connect to the MySQL database
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to retrieve sales by usersale
    query = "SELECT * FROM sales WHERE usersale = %s"
    values = (usersale,)

    # Execute the query
    cursor.execute(query, values)

    # Fetch all the rows from the result set
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL database
    cursor.close()
    cnx.close()

    # Convert the result set to a list of lists
    sales = [list(row) for row in rows]

    return sales



def give_country_from_username(username):
    # Connect to MySQL database
    cnx = mysql.connector.connect(user=USER, password=PASSWORD,
                                  host=HOST, database=DATABASE)
    # Read data from MySQL table using pandas
    username = str(username).strip()
    user_df = pd.read_sql(f"SELECT * FROM users WHERE username = '{username}'", con=cnx)
    # Close database connection
    cnx.close()
    if user_df.shape[0] == 0:
        return "not found user with this username, maybe you give me wrong username"
    else:
        return user_df['country'].iloc[0]


def get_flights_from_country(country_name):
    # Connect to MySQL database
    cnx = mysql.connector.connect(user=USER, password=PASSWORD, host=HOST, database=DATABASE)

    # Read data from MySQL table using pandas
    flights_df = pd.read_sql(f"SELECT * FROM sales WHERE fromcountry = '{country_name}'", con=cnx)

    # Close database connection
    cnx.close()

    # Check if any flights were found
    if flights_df.empty:
        return f"No flights found departing from {country_name}."
    else:
        return flights_df.values.tolist()


def give_airline_id(airline_name):
    db = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )
    cursor = db.cursor(buffered=True)

    query = "SELECT airlineid FROM airlines WHERE LOWER(airlinename) = %s"
    cursor.execute(query, (airline_name,))
    result = cursor.fetchone()
    if result is None:
        airline_id = "not found airline id for this airline, maybe you give me wrong airline name"
    else:
        airline_id = result[0]
    cursor.close()
    db.close()
    return airline_id




def give_airline_logo(airline_name):
    db = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )
    cursor = db.cursor(buffered=True)
    query = "SELECT logo FROM airlines WHERE LOWER(airlinename) = %s"
    cursor.execute(query, (airline_name,))
    result = cursor.fetchone()
    if result is None:
        airline_logo = "not found airline logo for this airline, maybe you give me wrong airline name"
    else:
        airline_logo = result[0]
    cursor.close()
    db.close()
    return airline_logo



def add_sale(usersale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour):
    global next_saleid
    # establish a connection to the database
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # create a cursor object
    
    cursor = cnx.cursor()

    if next_saleid == 0:
        cursor.execute("SELECT MAX(CAST(saleid AS UNSIGNED)) FROM sales")
        result = cursor.fetchone()
        if result[0] is not None:
            next_saleid = int(result[0]) + 1

    # Assign the next available saleid
    saleid = str(next_saleid)
    next_saleid += 1
    # insert a new row into the sales table
    add_sale_query = "INSERT INTO sales (saleid, usersale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    add_sale_values = (saleid, usersale, fromcity, fromcountry, tocity, tocityimg, tocountry, flightdate, airlineid, airlinename, logo, price, flightnumber, starthour, endhour)
    cursor.execute(add_sale_query, add_sale_values)

    # commit the transaction and close the connection
    cnx.commit()
    cursor.close()
    cnx.close()
    return "succeed"

def pay_sale(saleid, usersale, salenumber, buynumber, userbuy, passportbuyname, buymail, fromcity, fromcountry, tocity, tocountry, flightdate, airlinename, price, flightnumber, starthour, endhour, userID):
    
    to_number = salenumber
    message = "Hello " + usersale + ",\nthe user: "+userbuy+" wants to buy your flight "+ flightnumber+" from "+ fromcity +" to "+tocity+", at "+flightdate+".\nhe already paid the website " +str(price)+"$ for that.\n\nhis passport name: *"+passportbuyname+".*\n\nchange the name of the flight.\nsend the update ticket to: "+ buymail+".\nAfter that, the money will be sent to you.\n\nThanks, Center Flights."
    sale_to_middle(saleid, userID, flightnumber, 'middle', usersale, fromcountry, tocountry)
    send_whatsapp_message(ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, to_number, message)


def buyyer_got(saleid, usersale, salenumber, buynumber, userbuy, passportbuyname, buymail, fromcity, fromcountry, tocity, tocountry, flightdate, airlinename, price, flightnumber, starthour, endhour, userID):
    to_number1 = salenumber
    message1 = "Hello " + usersale + ",\nthe user: "+userbuy+" confirm you send him the update ticket with his name,\nThe flight "+ flightnumber+" from "+ fromcity +" to "+tocity+", at "+flightdate+".\nnow we deliver you the " +str(price)+"$ he paid for that.\n\nThanks, Center Flights."
    send_whatsapp_message(ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, to_number1, message1)

    to_number2 = buynumber
    message2 = "Hello " + userbuy + ",\nthe seller: " + usersale + " got your money for your buyying.\nNow you have a ticket of flight: " + flightnumber + " from " + fromcity + " to " + tocity + ", at " + flightdate + ".\nnow we deliver you the 10$ we owe you.\n\nThanks, Center Flights."
    sale_to_done(saleid, userID, flightnumber, 'done')
    send_whatsapp_message(ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER, to_number2, message2)

		
def sale_to_middle(saleid, userID, flightnumber, state, saleusername, fromcountry, tocountry):	
    # Connect to the database	
    cnx = mysql.connector.connect(host=HOST,	
        user=USER,	
        password=PASSWORD,	
        database=DATABASE)	
    cursor = cnx.cursor()	
    # Prepare the SQL statement to insert data into the table	
    insert_query = "INSERT INTO salesusersstate (saleid, userID, flightnumber, state, saleusername, fromcountry, tocountry) " \
               "VALUES (%s, %s, %s, %s, %s, %s, %s)"

    # Execute the SQL statement with the provided data	
    data = (saleid, userID, flightnumber, state, saleusername, fromcountry, tocountry)	
    cursor.execute(insert_query, data)	
    # Commit the changes and close the connection	
    cnx.commit()	
    cursor.close()	
    cnx.close()



def sale_to_done(saleid, userID, flightnumber, newstate):
    # Connect to the database
    cnx = mysql.connector.connect(host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE)
    cursor = cnx.cursor()

    # Prepare the SQL statement to update the state column
    update_query = "UPDATE salesusersstate SET state = %s WHERE saleid = %s AND userID = %s AND flightnumber = %s"

    # Execute the SQL statement with the provided data
    data = (newstate, saleid, userID, flightnumber)
    cursor.execute(update_query, data)

    # Commit the changes and close the connection
    cnx.commit()
    cursor.close()
    cnx.close()
    delete_sale_by_id(saleid)


def is_the_sale_state_found_with_me(saleid, userID, flightnumber, state):
    # Connect to the database
    cnx = mysql.connector.connect(host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE)
    cursor = cnx.cursor()

    # Prepare the SQL statement to select rows matching the given criteria
    select_query = "SELECT COUNT(*) FROM salesusersstate WHERE saleid = %s AND userID = %s AND flightnumber = %s AND state = %s"

    # Execute the SQL statement with the provided data
    data = (saleid, userID, flightnumber, state)
    cursor.execute(select_query, data)

    # Fetch the result
    result = cursor.fetchone()

    # Close the connection
    cursor.close()
    cnx.close()

    # Return 1 if the row exists, 0 otherwise
    if result and result[0] > 0:
        return 1
    else:
        return 0


def is_the_sale_state_found_with_someone(saleid, flightnumber, state):
    
    # Connect to the database
    cnx = mysql.connector.connect(host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE)
    cursor = cnx.cursor()

    # Prepare the SQL statement to select rows matching the given criteria
    select_query = "SELECT COUNT(*) FROM salesusersstate WHERE saleid = %s AND flightnumber = %s AND state = %s"

    # Execute the SQL statement with the provided data
    data = (saleid, flightnumber, state)
    cursor.execute(select_query, data)

    # Fetch the result
    result = cursor.fetchone()

    # Close the connection
    cursor.close()
    cnx.close()

    # Return 1 if the row exists, 0 otherwise
    if result and result[0] > 0:
        return 1
    else:
        return 0


def get_user_purchases(user_id):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to retrieve user purchases
    query = "SELECT * FROM salesusersstate WHERE userID = %s"
    values = (user_id,)

    cursor.execute(query, values)
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # Extract the sale IDs from the result set
    purchases = [list(row) for row in rows]

    return purchases
    
def date_distance(sale_date, current_date):	
    sale_date_obj = datetime.strptime(sale_date, "%Y-%m-%d").date()	
    distance = (sale_date_obj - current_date).days	
    return distance	
def calculate_distance(lat1, lng1, lat2, lng2):	
    # This function calculates the distance between two points	
    # Implement your own distance calculation algorithm	
    # Here's a simple example using Euclidean distance formula	
    distance = ((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2) ** 0.5	
    return distance
		
def get_country_data(country_name):	
    url = f"https://restcountries.com/v2/name/{country_name}"	
    response = requests.get(url)	
    if response.status_code == 200:	
        data = response.json()	
        # Find the country data that matches your criteria	
        for country in data:	
            if country["independent"]:	
                return country	
        return None	
    else:	
        return None
        
def calculate_similarity_score(country1, country2):	
    global contries_similarity	
    mykey = country1+country2	
    if mykey in contries_similarity and random.random() < 0.8:	
        return contries_similarity[mykey]	
    global countries_data	
    if country1 in countries_data:	
        data_country1 = countries_data[country1]	
    else:	
        data_country1 = get_country_data(country1)	
        if data_country1:	
            countries_data[country1] = data_country1	
    if country2 in countries_data:	
        data_country2 = countries_data[country2]	
    else:	
        data_country2 = get_country_data(country2)	
        if data_country2:	
            countries_data[country2] = data_country2	
    if data_country1 and data_country2:	
        score = 0	
        if data_country1["region"] == data_country2["region"]:	
            score += 19	
        if data_country1["subregion"] == data_country2["subregion"]:	
            score += 10	
        # Calculate distance	
        lat1, lng1 = data_country1["latlng"]	
        lat2, lng2 = data_country2["latlng"]	
        distance = calculate_distance(lat1, lng1, lat2, lng2)	
        if distance < 300:	
            score += 10	
        elif distance < 500:	
            score += 8	
        elif distance < 700:	
            score += 7	
        elif distance < 1000:	
            score += 5	
        elif distance < 1500:	
            score += 3	
        elif distance < 2000:	
            score += 2	
        elif distance < 2500:	
            score += 1	
        # Add more distance ranges and corresponding scores as needed	
        # Compare population	
        population1 = data_country1["population"]	
        population2 = data_country2["population"]	
        population_difference = abs(population1 - population2)	
        population_threshold = 10000000  # Adjust threshold as needed	
        if population_difference <= population_threshold:	
            score += 6	
        # Check if both countries are developed (hypothetical)	
        touristic_countries = [	
            "France",	
            "Spain",	
            "United States",	
            "China",	
            "Italy",	
            "Turkey",	
            "Mexico",	
            "Germany",	
            "Thailand",	
            "United Kingdom",	
            "Malaysia",	
            "Russia",	
            "Greece",	
            "Japan",	
            "Canada",	
            "Australia",	
            "Brazil",	
            "India",	
            "Egypt",	
            "South Africa"	
        ]	
        if country1 in touristic_countries and country2 in touristic_countries:	
            score += 5	
        contries_similarity[mykey] = score	
        contries_similarity[country2+country1] = score	
        return score	
    else:	
        contries_similarity[mykey] = 0	
        contries_similarity[country2 + country1] = 0	
        return 0
        

def special_order_by(fromcountry, tocountry,max_price, userid, sales):		
    scores = {}		
    weightprice = 2	
    weightdate=2	
    weightsaleid=3	
    weightfromcountry=1		
    weighttocountry = 1		
    user_purchases = get_user_purchases(userid)		
    current_date = date.today()		
    for sale in sales:		
        #score = 0		
        current_score = 100		
        sale_price = int(sale[11])		
        if sale_price <= max_price:		
            price_score = ((max_price - sale_price) / max_price) * 100 * weightprice	
            current_score += price_score		
        sale_date = sale[7]#2024-06-09		
        sale_date_distance = date_distance(sale_date, current_date)		
        if sale_date_distance <= 300:		
            date_score = ((300 - sale_date_distance) / 300) * 120 * weightdate	
            current_score += date_score		
        sale_the_sellername = sale[1]		
        count_sellername = sum(1 for purchase in user_purchases if purchase[4] == sale_the_sellername)		
        current_score += 120 * count_sellername * weightsaleid	
        if not fromcountry:		
            sale_from_country = sale[3]		
            count_from_country = sum(1 for purchase in user_purchases if purchase[5] == sale_from_country)		
            current_score += 50 * count_from_country		
            try:		
                # if count_from_country == 0:		
                #     i = 0		
                #     mscore = 0		
                #     for purchase in user_purchases:		
                #         i += 1		
                #         mscore += calculate_similarity_score(purchase[5], sale_from_country)		
                #     if i > 0:		
                #         current_score += (mscore / i)		
                if count_from_country == 0:		
                    random_purchase = random.choice(user_purchases) if user_purchases else None		
                    if random_purchase:		
                        current_score += calculate_similarity_score(random_purchase[5], sale_from_country)		
            except:		
                print("similarity wrong")		
        if not tocountry:		
            sale_to_country = sale[6]		
            count_to_country = sum(1 for purchase in user_purchases if purchase[6] == sale_to_country)		
            current_score += 50 * count_to_country		
            try:		
                # if count_to_country == 0:		
                #     i = 0		
                #     mscore = 0		
                #     for purchase in user_purchases:		
                #         i += 1		
                #		
                #         mscore += calculate_similarity_score(purchase[6], sale_to_country)		
                #     if i > 0:		
                #         current_score += (mscore / i)		
                if count_to_country == 0:		
                    random_purchase = random.choice(user_purchases) if user_purchases else None		
                    if random_purchase:		
                        current_score += calculate_similarity_score(random_purchase[6], sale_to_country)		
            except:		
                print("similarity wrong")		
        scores[sale[0]] = current_score		
    # scores.sort(key=lambda x: x['score'], reverse=True)		
    #		
    # sorted_sale_ids = [score['sale']['saleid'] for score in scores]		
    #		
    # # Example: Generate an ORDER BY clause using parameterized query		
    # placeholders = ','.join(['%s'] * len(sorted_sale_ids))		
    # order_by = "FIELD(saleid, " + placeholders + ")"		
    # params = sorted_sale_ids		
    # # Example: Run the SQL query with the ORDER BY clause using your database library		
    # # db.execute("SELECT * FROM sales_table ORDER BY " + order_by, params)		
    # print(order_by)		
    sorted_sales = sorted(sales, key=lambda x: scores[x[0]], reverse=True)		
    return sorted_sales



def filter_sales_order_by_special(obj, userid, howmany=15, startfrom=0):
    # Establish a connection to the MySQL server
    cnx = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    # Create a cursor object to execute SQL queries
    cursor = cnx.cursor()

    # Construct the SQL query to filter sales data
    query = "SELECT * FROM sales"
    filters = []
    values = []

    if 'date' in obj and obj['date']:
        filters.append("flightdate = %s")
        values.append(obj['date'])
    if 'fromcountry' in obj and obj['fromcountry']:
        filters.append("fromcountry = %s")
        values.append(obj['fromcountry'])
    if 'tocountry' in obj and obj['tocountry']:
        filters.append("tocountry = %s")
        values.append(obj['tocountry'])
    if 'maxprice' in obj and obj['maxprice']:
        filters.append("price <= %s")
        values.append(obj['maxprice'])

    if len(filters) > 0:
        query += " WHERE " + " AND ".join(filters)

    # Call the special_order_by function for customized sorting
    
    sorted_query = special_order_by(obj, userid)
    if sorted_query:
        query += " ORDER BY " + sorted_query

    # Add pagination to the query
    query += f" LIMIT {startfrom}, {howmany}"

    cursor.execute(query, values)
    rows = cursor.fetchall()

    # Close the cursor and connection to the MySQL server
    cursor.close()
    cnx.close()

    # Convert the result set to a list of dictionaries
    sales = [dict(row) for row in rows]

    return sales

def filter_sales_order_by_special(obj, userid, howmany=15, startfrom=0):	
    # Establish a connection to the MySQL server	
    cnx = mysql.connector.connect(	
        host=HOST,	
        user=USER,	
        password=PASSWORD,	
        database=DATABASE	
    )	
    # Create a cursor object to execute SQL queries	
    cursor = cnx.cursor()	
    # Construct the SQL query to filter sales data	
    query = "SELECT * FROM sales"	
    filters = []	
    values = []	
    if 'date' in obj and obj['date']:	
        filters.append("flightdate = %s")	
        values.append(obj['date'])	
    if 'fromcountry' in obj and obj['fromcountry']:	
        filters.append("fromcountry = %s")	
        values.append(obj['fromcountry'])	
    if 'tocountry' in obj and obj['tocountry']:	
        filters.append("tocountry = %s")	
        values.append(obj['tocountry'])	
    if 'maxprice' in obj and obj['maxprice']:	
        filters.append("price <= %s")	
        values.append(obj['maxprice'])	
    if len(filters) > 0:	
        query += " WHERE " + " AND ".join(filters)	
    # Call the special_order_by function for customized sorting	
    # #p1rint('1')	
    # sorted_query = special_order_by(obj, userid)	
    # print(sorted_query)	
    # # if sorted_query:	
    # #     query += " ORDER BY " + sorted_query	
    # #	
    # # Add pagination to the query	
    # query += f" LIMIT {startfrom}, {howmany}"	
    cursor.execute(query, values)	
    rows = cursor.fetchall()	
    #p1rint(rows)	
    # Close the cursor and connection to the MySQL server	
    cursor.close()	
    cnx.close()	
    # Convert the result set to a list of dictionaries	
    sales = [list(row) for row in rows]	
    if len(sales) > 200:	
        sales = random.sample(sales, 200)	
    maxprice = int(obj['maxprice']) if obj['maxprice'] else 1000	
    fromcountry = obj['fromcountry']	
    tocountry = obj['tocountry']	
    new_sales = special_order_by(fromcountry, tocountry, maxprice, userid, sales)	
    return new_sales[0:102]	
# obj = {'maxprice': '200', 'fromcountry': 'Israel', 'tocountry': None, 'date': None}	
# n = filter_sales_order_by_special(obj, 10002, 15, 0)	
# print(n)	
# obj2 = {'maxprice': '800', 'fromcountry': None, 'tocountry': 'Spain', 'date': None}	
# x = filter_sales_order_by_special(obj, 10002, 15, 0)	
# print(x)







