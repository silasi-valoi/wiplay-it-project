from django.test import TestCase
import unittest
from django.test import Client
from userApp.custom_validators import validate_username_field
from django.core.validators import validate_email,RegexValidator
from mainApp.models import  Answer, Question, Post
from userApp.models import User, Profile

class SimpleTest(unittest.TestCase):
	def setUp(self):
		#Every test needs a client.
		self.client = Client()
		data = {}
		data['email'] = "silasbaloy@hotmail.com"
		data['first_name'] = "silasi" 
		data['last_name']  = "Baloi"
		data['password']   = "silas9018"
		self.response = self.client.post('rest-auth/registration/',data)

	def test_details(self):
		# Issue a GET request.
		#response = self.client.get('/create/question/')
		# Check that the response is 200 OK.
		print(self.response.status_code)
		self.assertEqual(self.response.status_code, 200)
		# Check that the rendered context contains 5 customers.
		#self.assertEqual(self.response.context['email'], self.email)

'''
class QuestionTest(unittest.TestCase):
	def setUp(self):
		#Every test needs a client.
		self.client = Client()
		u = User.objects.get(id=1)
		q = "Who is who"
		password = "silas9018"
		self.response = self.client.post('/create/question/', {'add_question': q,"created_by":u})

	def test_details(self):
		# Issue a GET request.
		#response = self.client.get('/create/question/')
		# Check that the response is 200 OK.
		self.assertEqual(self.response.status_code, 200)
		self.assertEqual(self.response.content, "")
		# Check that the rendered context contains 5 customers.
		#self.assertEqual(len(response.context['customers']), 5)

'''
class UserTest(unittest.TestCase):

	def setUp(self):
		#Every test needs a client.
		self.client = Client()
		phone_number_validator  = RegexValidator(regex=r'^\+?[\d\s]+$')
		nums = ['+27 78 180 6487','078 180 6487','+27781806487','0781806487']
		email = "SilaS@gmail.com"
		self.inval = True
		for n in range(len(nums)):
			self.num = validate_username_field(phone_number_validator,nums[n],True) 
			if self.num != True:
				self.inval = False
		self.em = validate_username_field(validate_email,email,True)

		

	def test_details(self):
		self.assertEqual(self.num, True)
		self.assertEqual(self.em,True)
		self.assertEqual(self.inval,True)



