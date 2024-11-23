import os
from constructs import Construct
from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamodb,
    aws_iam as iam
)


class InfrastructureStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, env_name: str, lambda_memory_size: int, lambda_timeout: int, OPENROUTER_API_KEY: str, LANGCHAIN_API_KEY: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create the IAM User Groups and Policies
        # Helper function to generate a random password
        def generate_password(length=16):
            characters = string.ascii_letters + string.digits + string.punctuation
            return ''.join(secrets.choice(characters) for _ in range(length))

        # Helper function to create users with auto-generated console passwords
        def create_user(user_name: str, group: iam.Group):
            password = generate_password()
            iam_user = iam.CfnUser(
                self, f"{user_name}Cfn",
                user_name=user_name,
                groups=[group.group_name]
            )
            iam.CfnLoginProfile(
                self, f"{user_name}LoginProfile",
                user_name=user_name,
                password=password,
                password_reset_required=True  # Users must reset the password on first login
            )
            print(f"Generated password for {user_name}: {password}")

        # Create Backend Users
        for i in range(1, 4):  # 3 users
            create_user(
                user_name=f"backend-user-{i}",
                group=backend_group
            )

        # Create Frontend Users
        for i in range(1, 3):  # 2 users
            create_user(
                user_name=f"frontend-user-{i}",
                group=frontend_group
            )

        # Create Admin User
        create_user(
            user_name="admin-user",
            group=admin_group
        )

        # LLM Calling Lambda Function ---------------------------------
        '''
        # Add lambda layer by ARN
        llm_call_lambda_layer = lambda_.LayerVersion.from_layer_version_arn(
            self, 
            "LLMsBasicDependencies",
            "arn:aws:lambda:eu-north-1:491085403164:layer:LLMsBasicsDependencies:1"
        )
        '''

        llm_call_lambda_layer = lambda_.LayerVersion(
            self, "LLMsBasicDependencies",
            code=lambda_.Code.from_asset("./layers/llms_basic_dependencies/"),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_10],
            description="Lambda layer for LangChain, LiteLLM and other required dependencies",
        )
                
        llm_call_lambda_code_path = os.path.join(
            os.path.dirname(__file__), 
            "../../backend/llm_call"
        )
    
        llm_call_function = lambda_.Function(
            self,
            id=f"{env_name}-LLMCallFunction",
            code=lambda_.Code.from_asset(llm_call_lambda_code_path),
            handler="llm_call.lambda_handler",
            runtime=lambda_.Runtime.PYTHON_3_10,
            layers=[llm_call_lambda_layer],
            timeout=Duration.seconds(lambda_timeout),
            memory_size=lambda_memory_size,
            environment={
                "ENV_NAME":env_name,
                "LANGCHAIN_TRACING_V2":"true",
                "LANGCHAIN_ENDPOINT":"https://api.smith.langchain.com",
                "OPENROUTER_API_KEY": OPENROUTER_API_KEY,
                "LANGCHAIN_PROJECT": "Taklif.AI",
                "LANGCHAIN_API_KEY": LANGCHAIN_API_KEY,
            }
        )

        llm_call_api = apigateway.LambdaRestApi(
            self,
            "LLMCallAPI",
            handler=llm_call_function,
            rest_api_name=f"{env_name}-LLMCallAPI",
            proxy=False,
            description="API Gateway for LLM Call",
            endpoint_types=[apigateway.EndpointType.EDGE],
            deploy_options=apigateway.StageOptions( # we can make the throttling limits dynamic by the user subscription
                stage_name=env_name,
#                throttling_rate_limit=1, # maximum number of requests per second (RPS) allowed for the stage
#                throttling_burst_limit=5, # maximum number of requests that can be served in a short burst before the rate limit is applied
            )
        )

        items = llm_call_api.root.add_resource("llm_call")
        items.add_method("POST") # POST /llm_call
        items.add_cors_preflight(
            allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        )