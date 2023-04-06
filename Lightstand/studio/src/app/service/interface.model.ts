
export interface Screen {
  pin: string;
  id : string;
  ownerId: string;
  business: string;
  location: string;
  description: string;
  ratio: number;
  tag: string;
  startHour: Number;
  endHour: Number;
}

export const screenAttributesMapping = {
  pin: 'Pin',
  id: 'Screen name',
  ownerId: 'Owner id',
  business: 'Business',
  location: 'Location',
  description: 'Description',
  ratio: 'Ratio',
  tag: 'Tag',
  startHour: 'Start',
  endHour: 'End',
};

export interface Constraint {
    startDate: Date;
    endDate: Date;
    hour: String[];
    minFreq: Number;
    maxFreq: Number;
    ranking: Number;
    screenId: String[];
    weekday: String[];
    isSov: Boolean;
    shareOfVoice: Number;
    isPlayInTurns: Boolean;
}
