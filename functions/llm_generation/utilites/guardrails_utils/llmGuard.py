import InterestValidator as InterestValidator
import AssignmentValidator as AssignmentValidator


def guard_interest(interest:str, metadata:dict):
   """ Performs guardrails on interest

   Args:
       interest (str): user's interest 
       metadata (dict): {model, apiKey}

   Returns:
       _type_: PassResult(metadata = {llm_response})
   """
   interestValidator = InterestValidator.InterestValidator(use_local = True)
   interest_validation = interestValidator.validate(interest, metadata = metadata)
   return interest_validation

def guard_assignment(assignment: str, metadata:dict):
   """ Performs guardrails on assignment 

   Args:
       interest (str): user's assignment 
       metadata (dict): {model, apiKey}

   Returns:
       _type_: PassResult(metadata = {llm_response})
   """
   assignmentValidator = AssignmentValidator.AssignmentValidator()
   assignment_validation = assignmentValidator.validate(assignment, metadata= metadata)

   return assignment_validation
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
  if not interest_validation.metadata['content']['decision']:
     output = {
        'status': 'bad',
        'llm_response': interest_validation.metadata
     }
     return output
  assignmentValidator = AssignmentValidator.AssignmentValidator()
  assignment_validation = assignmentValidator.validate(input['assignment'], metadata= metadata)
  if not assignment_validation.metadata['content']['decision']:
     output = {
        'status': 'bad',
        'llm_response': assignment_validation.metadata
     }
     return output
  output['assignment_validation'] = assignment_validation.metadata
  output['interest_validation'] = interest_validation.metadata
  return output


