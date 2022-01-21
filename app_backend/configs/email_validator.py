import re

def my_email_validator(email):
    if len(email) > 7:
        if re.match("^,+@([?)[a-zA-Z0-9-,.(a-zA-Z]{2,3}|[0-9]{1,3})(]?)$", email) != None:
            return True
        else:
            return False
