FROM public.ecr.aws/lambda/python:3.11

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function handler code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# Copy utilites folder
COPY utilites ${LAMBDA_TASK_ROOT}/utilites

# Grant permissions to ${LAMBDA_TASK_ROOT} directory
RUN chmod 777 ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "lambda_function.handler" ]