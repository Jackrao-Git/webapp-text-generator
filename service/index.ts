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
  console.log("🚀 Workflow API Request:", `workflows/${process.env.NEXT_PUBLIC_APP_ID}/run`);
  console.log("📡 Body Sent:", JSON.stringify(body, null, 2));

  return ssePost(`workflows/${process.env.NEXT_PUBLIC_APP_ID}/run`, {  
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished })
}


export const fetchAppParams = async () => {
  return get('parameters')
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}
