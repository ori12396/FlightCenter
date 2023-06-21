import sys
import os
import unittest
from flask import Flask
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from start_server import app

class AppTestCase(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_get_users(self):
        response = self.client.get('/users?username=test&password=123')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {'1': [10011, 'test', '123', 'US', 'test@example.com', '1234567890']})

    def test_post_users(self):
        # Test when the user already exists
        data = {
            "username": "test21",
            "password": "123",
            "email": "test@example.com",
            "country": "US",
            "phonenumber": "1234567890"
        }
        response = self.client.post('/users', json=data)
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"0": "bad - already exist"})

        # Test when the user is successfully added
        data = {
            "username": "test41",
            "password": "123",
            "email": "test@example.com",
            "country": "US",
            "phonenumber": "1234567890"
        }
        response = self.client.post('/users', json=data)
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"1": "good - added successfully"})


    def test_delete_sale(self):
        # Delete a sale that exists
        data = {
            "saleid": "20045"
        }
        response = self.client.delete('/delete', json=data)
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"1": "Sale deleted successfully"})

        # Delete a sale that does not exist
        data = {
            "saleid": "12000000000"
        }
        response = self.client.delete('/delete', json=data)
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"0": "Sale not found"})




    def test_post_sale(self): 
        data = {
            "usersale": "John",
            "fromcity": "New York",
            "fromcountry": "USA",
            "tocity": "London",
            "tocityimg": "london.jpg",
            "tocountry": "UK",
            "flightdate": "2023-06-20",
            "airlineid": "123",
            "airlinename": "British Airways",
            "logo": "ba_logo.jpg",
            "price": 499.99,
            "flightnumber": "BA123",
            "starthour": "08:00",
            "endhour": "12:00"
        }
        response = self.client.post('/addnewsale', json=data)
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {"1": 'succeed'})
        

    def test_get_sales(self):
        # Test when howmany and startfrom are provided
        response = self.client.get('/getsales?howmany=10&startfrom=0')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIn("1", data)  # Check if key '1' exists in the response dictionary
        sales_data = data["1"]
        self.assertIsInstance(sales_data, list)

        # Test when howmany and startfrom are not provided
        response = self.client.get('/getsales')  # Remove the query parameters
        data = response.get_json()
        self.assertEqual(response.status_code, 200)

        if "0" in data:
            # Error message is present
            error_message = data["0"]
            self.assertEqual(error_message, "bad - not got howmany or startfrom in the query parameters")
        else:
            # Sales data is present
            sales_data = data["1"]
            self.assertIsInstance(sales_data, list)

        # Test when howmany is not provided
        response = self.client.get('/getsales?startfrom=0')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)

        if "0" in data:
            # Error message is present
            error_message = data["0"]
            self.assertEqual(error_message, "bad - not got howmany or startfrom in the query parameters")
        else:
            # Sales data is present
            sales_data = data["1"]
            self.assertIsInstance(sales_data, list)
            
    def test_is_sale_in_middle_with_someone(self):
        # Positive test case - sale state found
        params = {
            "saleid": 1,
            "flightnumber": "ABC123"
        }
        response = self.client.get('/issaleinmiddlewithsomeone', query_string=params)
        result = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(result, {"1": "found"})

        # Negative test case - sale state not found
        params = {
            "saleid": 2,
            "flightnumber": "XYZ789"
        }
        response = self.client.get('/issaleinmiddlewithsomeone', query_string=params)
        result = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(result, {"0": "not found"})



            
            
           


if __name__ == '__main__':
    unittest.main()
