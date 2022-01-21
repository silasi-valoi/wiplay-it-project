
from app_backend.helpers import  get_objects_perms, has_perm

class SerialiizerMixin(object):
	"""docstring for BaseSerialiizerMixin"""
	is_mixin = "Im a mixin Base Class"

	def current_user(self):
		request =  self.context.get('request', None)
		if request:
			return request.user
		return None


		
	def get_obj_permissions(self, perm_to=None):
		permissions = self.context.get('permissions', None)

		if permissions:
			return  permissions.get(perm_to, None)

		return None

	def update_serializer_obj_perms(self, perms_to : str):
		
		if perms_to:
			permissions = get_objects_perms(perms_to)
			self.context['permissions'] = permissions
			return self.context	

		return None



	def get_user_can_edit(self, obj):
		current_user = self.current_user()
		if not current_user.is_authenticated: return False
			
		edit_perms = self.get_obj_permissions('edit_perms')
	
		if edit_perms:

			can_edit = has_perm(
				current_user, 
				edit_perms[0],
				obj
			) or has_perm(current_user , edit_perms[1], obj)
		
			return can_edit

		return False


