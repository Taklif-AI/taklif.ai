FROM public.ecr.aws/lambda/python:3.10

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function handler code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# Copy utilites folder
COPY utilites ${LAMBDA_TASK_ROOT}/utilites

# # Copy tesseract binary
# COPY tesseract_ocr /var/opt

# # Setting environment variables for tesseract
# ENV PATH="/var/opt/bin:$PATH"
# RUN cp -r /var/opt/lib/* /var/lang/lib
# ENV TESSDATA_PREFIX=/var/opt/tesseract/share/tessdata

# RUN chmod +x /var/opt/bin/tesseract

# Install Poppler utils
RUN yum install -y poppler-utils.x86_64

# Set the CMD to your handler
CMD [ "lambda_function.handler" ]