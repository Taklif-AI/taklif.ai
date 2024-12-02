import os
from constructs import Construct
from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamodb,
    aws_iam as iam,
    aws_amplify as amplify
)


class InfrastructureStack(Stack):

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        env_name: str,
        lambda_memory_size: int,
        lambda_timeout: int,
        OPENROUTER_API_KEY: str,
        LANGCHAIN_API_KEY: str,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create the IAM User Groups and Policies
        # Backend Developers Group
        backend_policy = iam.ManagedPolicy(
            self,
            "BackendPolicy",
            statements=[
                iam.PolicyStatement(
                    actions=[
                        "lambda:*",
                        "dynamodb:*",
                        "apigateway:*",
                        "cognito-idp:*",
                        "cognito-identity:*",
                        "cognito-sync:*",
                        "rds:*",
                        "s3:*",
                        "ec2:*",
                        "amplify:*",
                    ],
                    resources=["*"],
                )
            ],
        )
        backend_group = iam.Group(self, "BackendGroup")
        backend_group.add_managed_policy(backend_policy)

        # Frontend Developers Group
        frontend_policy = iam.ManagedPolicy(
            self,
            "FrontendPolicy",
            statements=[
                iam.PolicyStatement(
                    actions=[
                        "dynamodb:List*",
                        "dynamodb:Read*",
                        "s3:List*",
                        "s3:Read*",
                        "rds:List*",
                        "rds:Read*",
                        "amplify:*",
                    ],
                    resources=["*"],
                )
            ],
        )
        frontend_group = iam.Group(self, "FrontendGroup")
        frontend_group.add_managed_policy(frontend_policy)

        # Admin Group
        admin_policy = iam.ManagedPolicy(
            self,
            "AdminPolicy",
            statements=[iam.PolicyStatement(actions=["*"], resources=["*"])],
        )
        admin_group = iam.Group(self, "AdminGroup")
        admin_group.add_managed_policy(admin_policy)

        # Create Backend Users
        iam.User(
            self,
            "BackendUser-Mohammed",
            user_name="backend-user-mohammed",
            groups=[backend_group],
        )

        # Create Frontend Users
        iam.User(
            self,
            "FrontendUser-Shady",
            user_name="frontend-user-shady",
            groups=[frontend_group],
        )

        # Create Admin Users
        iam.User(
            self, "AdminUser-Zaki", user_name="admin-user-zaki", groups=[admin_group]
        )
        iam.User(
            self, "AdminUser-Salem", user_name="admin-user-salem", groups=[admin_group]
        )
        lambda_role = iam.Role(
            self,
            id=f"{env_name}-LLMCallLambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
        )

        # Add policies to the role

        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonDynamoDBFullAccess")
        )
        # LLM Calling Lambda Function ---------------------------------
        """
        # Add lambda layer by ARN
        llm_call_lambda_layer = lambda_.LayerVersion.from_layer_version_arn(
            self, 
            "LLMsBasicDependencies",
            "arn:aws:lambda:eu-north-1:491085403164:layer:LLMsBasicsDependencies:1"
        )
        """

        llm_call_lambda_layer = lambda_.LayerVersion(
            self,
            "LLMsBasicDependencies",
            code=lambda_.Code.from_asset("./layers/llms_basic_dependencies/"),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_10],
            description="Lambda layer for LangChain, LiteLLM and other required dependencies",
        )

        llm_call_lambda_code_path = os.path.join(
            os.path.dirname(__file__), "../../functions/llm_call"
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
                "ENV_NAME": env_name,
                "LANGCHAIN_TRACING_V2": "true",
                "LANGCHAIN_ENDPOINT": "https://api.smith.langchain.com",
                "OPENROUTER_API_KEY": OPENROUTER_API_KEY,
                "LANGCHAIN_PROJECT": "Taklif.AI",
                "LANGCHAIN_API_KEY": LANGCHAIN_API_KEY,
            },
        )

        # LLM crud Lambda Function ---------------------------------
        llm_crud_lambda_layer = lambda_.LayerVersion(
            self,
            "LLMCrudDependencies",
            code=lambda_.Code.from_asset("./layers/llm_crud/"),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_10],
            description="Lambda layer for boto3 and others.",
        )

        llm_crud_lambda_code_path = os.path.join(
            os.path.dirname(__file__), "../../functions/llm_crud"
        )

        llm_crud_function = lambda_.Function(
            self,
            id=f"{env_name}-LLMCrudFunction",
            code=lambda_.Code.from_asset(llm_crud_lambda_code_path),
            handler="llm_crud.lambda_handler",
            runtime=lambda_.Runtime.PYTHON_3_10,
            layers=[llm_crud_lambda_layer],
            timeout=Duration.seconds(lambda_timeout),
            memory_size=lambda_memory_size,
            environment={
                "ENV_NAME": env_name,
            },
            role=lambda_role,
        )

        llm_api = apigateway.RestApi(
            self,
            "LLMCallAPI",
            rest_api_name=f"{env_name}-LLMCallAPI",
            description="API Gateway for LLM Call",
            endpoint_types=[apigateway.EndpointType.EDGE],
            deploy_options=apigateway.StageOptions(  # we can make the throttling limits dynamic by the user subscription
                stage_name=env_name,
                #                throttling_rate_limit=1, # maximum number of requests per second (RPS) allowed for the stage
                #                throttling_burst_limit=5, # maximum number of requests that can be served in a short burst before the rate limit is applied
            ),
        )

        # llm_call_resource = llm_api.root.add_resource("llm_call")
        # llm_call_resource.add_method("POST") # POST /llm_call
        # llm_call_resource.add_cors_preflight(
        #     allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        # )

        llm_call_resource = llm_api.root.add_resource("llm_call")
        llm_call_resource.add_method(
            "POST", apigateway.LambdaIntegration(llm_call_function)
        )
        llm_call_resource.add_cors_preflight(
            allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        )
        # Create a resource for routing Lambda 2
        items_resource = llm_api.root.add_resource("items")
        items_resource.add_method(
            "GET", apigateway.LambdaIntegration(llm_crud_function)
        )
        items_resource.add_method(
            "PUT", apigateway.LambdaIntegration(llm_crud_function)
        )
        item_name_resource = items_resource.add_resource("{name}")
        item_provider_resource = item_name_resource.add_resource("{provider}")
        item_provider_resource.add_method(
            "DELETE", apigateway.LambdaIntegration(llm_crud_function)
        )  # NAME
        item_provider_resource.add_method(
            "GET", apigateway.LambdaIntegration(llm_crud_function)
        )  # NAME
        items_resource.add_cors_preflight(
            allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        )
        item_name_resource.add_cors_preflight(
            allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        )
        LLMsTable = dynamodb.Table(
            self,
            id=f"{env_name}-LLMTable",
            table_name=f"{env_name}-LLMs",
            partition_key=dynamodb.Attribute(
                name="name", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name='provider', type=dynamodb.AttributeType.STRING
            )
        )

    
        # Create the Amplify app with the build spec
        amplify_app = amplify.CfnApp(
            self,
            "NextJsTaklifAIApp",
            name="NextJsTaklifAIApp",
            source_code_provider=amplify.GitHubSourceCodeProvider(
                owner="Taklif-AI",
                repository="taklif.ai",
                oauth_token="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",
            )
        )

        amplify_app.add_branch("feature/amplify-hosting")