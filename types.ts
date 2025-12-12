export interface PromptRequest {
  originalPrompt: string;
  instructions: string;
}

export interface PromptResponse {
  cleanedPrompt: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}