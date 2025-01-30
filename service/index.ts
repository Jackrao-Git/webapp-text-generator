import type { 
  IOnCompleted, 
  IOnData, 
  IOnError, 
  IOnNodeFinished, 
  IOnNodeStarted, 
  IOnWorkflowFinished, 
  IOnWorkflowStarted 
} from './base'
import { get, post, ssePost } from './base'
import type { Feedbacktype } from '@/types/app'

// Function to send completion message
export const sendCompletionMessage = async (body: Record<string, any>, { onData, onCompleted, onError }: {
  onData: IOnData
  onCompleted: IOnCompleted
  onError: IOnError
}) => {
  return ssePost('completion-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onError })
}

// Function to send workflow message
export const sendWorkflowMessage = async (
  body: Record<string, any>,
  {
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  // Debugging logs to check environment variables
  console.log("=== Debugging Workflow API ===");
  console.log("Workflow ID:", process.env.NEXT_PUBLIC_APP_ID);
  console.log("API Key:", process.env.NEXT_PUBLIC_APP_KEY ? "Exists" : "Missing");
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Full API Endpoint:", `workflows/${process.env.NEXT_PUBLIC_APP_ID}/run`);

  return ssePost(`workflows/${process.env.NEXT_PUBLIC_APP_ID}/run`, {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished })
}

// Function to fetch app parameters
export const fetchAppParams = async () => {
  return get('parameters')
}

// Function to update feedback
export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

