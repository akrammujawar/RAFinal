import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAllocatorProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  webURL:string;
  context:WebPartContext;
}

