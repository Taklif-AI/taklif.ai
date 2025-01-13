import os
from constructs import Construct
from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamodb,
    aws_iam as iam,
    aws_s3 as s3,
    aws_events as events,
    aws_events_targets as targets,
    aws_amplify as amplify,
)


class InfrastructureStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        env_name: str,
        lambda_memory_size: int,
        lambda_timeout: int,
        LANGCHAIN_API_KEY: str,
        LLAMA_CLOUD_API_KEY: str,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # <IAM RESOURCES> ---------------------------------------------------------------------
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
        iam.User(
            self,
            "AdminUser-Dr-Motaz",
            user_name="admin-user-motaz",
            groups=[admin_group],
        )
        iam.User(
            self, "GitHub-Actions", user_name="github-action", groups=[admin_group]
        )

        # Create role for lambda functions
        lambda_role = iam.Role(
            self,
            id=f"{env_name}-LLMCrudLambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
        )

        # Add policies to the llm crud role
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonDynamoDBFullAccess")
        )

        # Create User for NextAuthJS to access DynamoDB
        dynamodb_authjs_user = iam.User(self, "NextAuthJSUser")

        # Create an inline policy with specified DynamoDB actions
        dynamodb_policy = iam.Policy(
            self,
            f"{env_name}DynamoDBAccessPolicy",
            statements=[
                iam.PolicyStatement(
                    actions=[
                        "dynamodb:BatchGetItem",
                        "dynamodb:BatchWriteItem",
                        "dynamodb:Describe*",
                        "dynamodb:List*",
                        "dynamodb:PutItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:GetItem",
                        "dynamodb:Scan",
                        "dynamodb:Query",
                        "dynamodb:UpdateItem",
                    ],
                    resources=[
                        "arn:aws:dynamodb:eu-north-1:***REMOVED-AWS-ACCOUNT-ID***:table/next-auth",
                        "arn:aws:dynamodb:eu-north-1:***REMOVED-AWS-ACCOUNT-ID***:table/next-auth/index/GSI1",
                    ],
                )
            ],
        )

        # Attach the policy to the user
        dynamodb_policy.attach_to_user(dynamodb_authjs_user)

        # Create IAM user for accessing S3 user images bucket
        s3_user_images_iam_user = iam.User(self, "S3UserImagesIamUser")
        # </IAM RESOURCES> ---------------------------------------------------------------------

        # <LAMBDA RESOURCES> ---------------------------------------------------------------------
        # LLM Generation Lambda Function
        llm_generation_code_path = os.path.join(
            os.path.dirname(__file__), "../../functions/llm_generation"
        )

        llm_generation_function = lambda_.DockerImageFunction(
            self,
            id=f"{env_name}-LLMCallingFunction",
            code=lambda_.DockerImageCode.from_image_asset(llm_generation_code_path),
            timeout=Duration.seconds(lambda_timeout),
            memory_size=lambda_memory_size,
            environment={
                "ENV_NAME": env_name,
                "LANGCHAIN_TRACING_V2": "true",
                "LANGCHAIN_ENDPOINT": "https://api.smith.langchain.com",
                "LANGCHAIN_PROJECT": "Taklif.AI",
                "LANGCHAIN_API_KEY": LANGCHAIN_API_KEY,
                "LLAMA_CLOUD_API_KEY": LLAMA_CLOUD_API_KEY,
            },
            role=lambda_role,
        )
        # </LAMBDA RESOURCES> ---------------------------------------------------------------------

        # <API GATEWAY RESOURCES> ---------------------------------------------------------------------
        orchestration_api = apigateway.RestApi(
            self,
            "OrchestrationAPI",
            rest_api_name=f"{env_name}-OrchestrationAPI",
            description="API Gateway for services orchestration",
            endpoint_types=[apigateway.EndpointType.EDGE],
            deploy_options=apigateway.StageOptions(  # we can make the throttling limits dynamic by the user subscription
                stage_name=env_name,
                # throttling_rate_limit=1, # maximum number of requests per second (RPS) allowed for the stage
                # throttling_burst_limit=5, # maximum number of requests that can be served in a short burst before the rate limit is applied
            ),
        )

        llm_generation_resource = orchestration_api.root.add_resource("llm_generation")
        llm_generation_resource.add_method(
            "POST", apigateway.LambdaIntegration(llm_generation_function)
        )
        llm_generation_resource.add_cors_preflight(
            allow_origins=apigateway.Cors.ALL_ORIGINS,  # Allow all origins, or specify a list of allowed origins (it can be replaced with our frontend domain)
        )
        # </API GATEWAY RESOURCES> ---------------------------------------------------------------------

        # <EventBridge RESOURCES> ---------------------------------------------------------------------
        rule = events.Rule(
            self,
            "LambdaWarmPing",
            description="Event rule to keep lambda function warm",
            schedule=events.Schedule.rate(duration=Duration.minutes(5)),
        )

        rule.add_target(targets.LambdaFunction(llm_generation_function))
        # </EventBridge RESOURCES> ---------------------------------------------------------------------

        # <Amplify RESOURCES/> created through GUI

        # <DYNAMODB RESOURCES> ---------------------------------------------------------------------
        ServingLLMsTable = dynamodb.Table(
            self,
            id=f"{env_name}ServingLLMs",
            table_name=f"{env_name}-ServingLLMs",
            partition_key=dynamodb.Attribute(
                name="llm_id",
                type=dynamodb.AttributeType.STRING,  # llm_id: litellm_call/the last 5 characters of the API key, example: github/llama-3.2/VWXYZ
            ),
            sort_key=dynamodb.Attribute(
                name="task",
                type=dynamodb.AttributeType.STRING,  # llm task: personalization, simplification, guardrails, or other
            ),
        )

        NextAuthTable = dynamodb.Table(
            self,
            id=f"{env_name}NextAuthTable",
            table_name="next-auth",
            partition_key=dynamodb.Attribute(
                name="pk", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(name="sk", type=dynamodb.AttributeType.STRING),
            time_to_live_attribute="expires",
        )

        NextAuthTable.add_global_secondary_index(
            index_name="GSI1",
            partition_key=dynamodb.Attribute(
                name="GSI1PK", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="GSI1SK", type=dynamodb.AttributeType.STRING
            ),
        )

        # Create an inline policy with specified DynamoDB actions
        dynamodb_policy = iam.Policy(
            self,
            "DynamoDBAccessPolicy",
            statements=[
                iam.PolicyStatement(
                    actions=[
                        "dynamodb:BatchGetItem",
                        "dynamodb:BatchWriteItem",
                        "dynamodb:Describe*",
                        "dynamodb:List*",
                        "dynamodb:PutItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:GetItem",
                        "dynamodb:Scan",
                        "dynamodb:Query",
                        "dynamodb:UpdateItem",
                    ],
                    resources=[
                        NextAuthTable.table_arn,
                        NextAuthTable.table_arn + "/index/GSI1",
                    ],
                )
            ],
        )
        # </DYNAMODB RESOURCES> ---------------------------------------------------------------------

        # <S3 RESOURCES> ---------------------------------------------------------------------
        user_images_bucket = s3.Bucket(
            self,
            id=f"{env_name}UserImagesBucket",
            bucket_name=f"{env_name.lower()}-user-images-bucket-taklif",
            versioned=True,  # Enable versioning
            public_read_access=False,  # Ensure bucket is private
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,  # Block public access
        )

        # Configure CORS policy
        user_images_bucket.add_cors_rule(
            allowed_methods=[
                s3.HttpMethods.GET,
                s3.HttpMethods.PUT,
                s3.HttpMethods.POST,
                s3.HttpMethods.DELETE,
            ],
            allowed_origins=["*"],
            allowed_headers=["*"],
            expose_headers=[],
        )

        # Attach inline policy to S3 user images IAM user
        s3_user_images_iam_user.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "s3:DeleteObject",
                    "s3:GetObject",
                    "s3:ListBucket",
                    "s3:PutObject",
                    "s3:PutObjectAcl",
                ],
                resources=[user_images_bucket.bucket_arn],
            )
        )
        # </S3 RESOURCES> ---------------------------------------------------------------------
