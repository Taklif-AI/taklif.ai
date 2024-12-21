#!/usr/bin/env python3
from infrastructure.infrastructure_stack import InfrastructureStack
import aws_cdk as cdk
import os

environments = {
    "develop": {
        "account": os.getenv("CDK_DEFAULT_ACCOUNT"), # example: 123456789101
        "region": os.getenv("CDK_DEFAULT_REGION"), # example: us-east-1
        "env_name": "Development",
        "lambda_memory_size": 1024,
        "lambda_timeout": 90,
        "LANGCHAIN_API_KEY": os.getenv("LANGCHAIN_API_KEY"),
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
    },
    "production": {
        "account": os.getenv("CDK_DEFAULT_ACCOUNT"),
        "region": os.getenv("CDK_DEFAULT_REGION"),
        "env_name": "Production",
        "lambda_memory_size": 1024,
        "lambda_timeout": 60,
        "LANGCHAIN_API_KEY": os.getenv("LANGCHAIN_API_KEY"),
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
    }
}

app = cdk.App()

'''
InfrastructureStack(app, "InfrastructureStack",
    # If you don't specify 'env', this stack will be environment-agnostic.
    # Account/Region-dependent features and context lookups will not work,
    # but a single synthesized template can be deployed anywhere.

    # Uncomment the next line to specialize this stack for the AWS Account
    # and Region that are implied by the current CLI configuration.

    #env=cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION')),

    # Uncomment the next line if you know exactly what Account and Region you
    # want to deploy the stack to. */

    #env=cdk.Environment(account='123456789012', region='us-east-1'),

    # For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
    )
'''

# Development environment stack
develop_env = environments["develop"]
InfrastructureStack(
    app, 
    "InfrastructureStackDev",
    env=cdk.Environment(account=develop_env["account"], region=develop_env["region"]),
    env_name=develop_env["env_name"],
    lambda_memory_size=develop_env["lambda_memory_size"],
    lambda_timeout=develop_env["lambda_timeout"],
    LANGCHAIN_API_KEY=develop_env["LANGCHAIN_API_KEY"],
    GROQ_API_KEY=develop_env["GROQ_API_KEY"],
    GEMINI_API_KEY=develop_env["GEMINI_API_KEY"],
)

# Production environment stack
production_env = environments["production"]
InfrastructureStack(
    app, 
    "InfrastructureStackProd",
    env=cdk.Environment(account=production_env["account"], region=production_env["region"]),
    env_name=production_env["env_name"],
    lambda_memory_size=production_env["lambda_memory_size"],
    lambda_timeout=production_env["lambda_timeout"],
    LANGCHAIN_API_KEY=production_env["LANGCHAIN_API_KEY"],
    GROQ_API_KEY=production_env["GROQ_API_KEY"],
    GEMINI_API_KEY=production_env["GEMINI_API_KEY"],
)

app.synth()
