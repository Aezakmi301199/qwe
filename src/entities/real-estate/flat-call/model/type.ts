export interface CallDataFlat {
  id: string;
  cloudCallId: string;
  status: string;
  duration: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  recognitionId: string;
  recognizedText: {
    channel: string;
    endTime: number;
    gender: string;
    sentiment: number;
    startTime: number;
    text: string;
  }[];
  recognitionStatus: string;
  recognizedAt: string;
  flat: {
    id: string;
    address: string;
  };
}

export interface CallDataHouse {
  id: string;
  cloudCallId: string;
  status: string;
  duration: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  recognitionId: string;
  recognizedText: {
    channel: string;
    endTime: number;
    gender: string;
    sentiment: number;
    startTime: number;
    text: string;
  }[];
  recognitionStatus: string;
  recognizedAt: string;
  house: {
    id: string;
    address: string;
  };
}

export interface CallDataLand {
  id: string;
  cloudCallId: string;
  status: string;
  duration: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  recognitionId: string;
  recognizedText: {
    channel: string;
    endTime: number;
    gender: string;
    sentiment: number;
    startTime: number;
    text: string;
  }[];
  recognitionStatus: string;
  recognizedAt: string;
  land: {
    id: string;
    address: string;
  };
}
