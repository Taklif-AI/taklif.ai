import InterestValidator as InterestValidator
import AssignmentValidator as AssignmentValidator
def guard_input(input:dict, metadata: dict):
  """_summary_

  Args:
      input (dict): _description_

  Returns:
      _type_: _description_
  """
  output = {}
  interestValidator = InterestValidator.InterestValidator(use_local = True)
  interest_validation = interestValidator.validate(input['interest'], metadata = metadata)
  if not interest_validation.metadata['decision']:
     output = {
        'status': 'bad',
        'llm_response': interest_validation.metadata
     }
     return output
  assignmentValidator = AssignmentValidator.AssignmentValidator()
  assignment_validation = assignmentValidator.validate(input['assignment'], metadata= metadata)
  if not assignment_validation.metadata['decision']:
     output = {
        'status': 'bad',
        'llm_response': assignment_validation.metadata
     }
     return output
  output['assignment_validation'] = assignment_validation.metadata
  output['interest_validation'] = interest_validation.metadata
  return output


