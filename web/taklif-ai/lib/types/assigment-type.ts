export type Assignment = {
  PK: string; // USER#<user_id>
  SK: string; // RUN#<run_id> or RUN#<run_id>#PERSONALIZATION#<personalization_id> or RUN#<run_id>#PERSONALIZATION#<personalization_id>#SIMPLIFICATION#<simplification_id>
  request_origin: "web" | "API";
  item_type: "Personalization" | "Simplification";
  run_id: string;
  personalization_id?: string;
  simplification_id?: string;
  user_input: {
    interest: string;
    assignment: string;
    is_PDF: boolean;
  };
  model_output: {
    title: string;
    content: string;
  };
  interest_guardrail_decision: {
    decision: string;
    explanation: string;
  };
  assignment_guardrail_decision: {
    decision: string;
    explanation: string;
  };
  output_guardrail_decision: {
    decision: string;
    explanation: string;
  };
  feedback?: {
    like?: {
      value: boolean;
      timestamp: string;
    };
    dislike?: {
      value: boolean;
      timestamp: string;
    };
    copied?: {
      value: boolean;
      timestamp: string;
    };
  };
  metadata: {
    request_id: string;
    model_name: string;
    model_id: string;
    input_tokens: number;
    output_tokens: number;
  };
  error_message?: string;
  created_at: string; // ISO 8601 timestamp
};