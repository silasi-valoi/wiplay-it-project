from django.core.exceptions import ValidationError


def validate_username_field(validator, unique_field, is_number=False,is_email=False ):
	is_valid = False
	try:
		validator(unique_field)
		if is_number:
			return is_number
		if is_email:
			#field =  unique_field
			return is_email
	except  ValidationError as e:
		error =   e
		return is_valid

    

   
         
