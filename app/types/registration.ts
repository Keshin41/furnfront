export interface Registration {
  event: string;
  nickname: string;
  eventPart: Activity;
  choices: ActivityChoice[];
}

export interface ActivityChoice {
  id: string;
  value: string;
  choice: string;
}

export interface Activity {
  id: string;
  label: string;
}
