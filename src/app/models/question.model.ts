export interface IQuestions {
  topicId: number;
  questions: IQuestion[];
}

export interface IQuestion {
  id?: number;
  value: string;
  description?: string;
  answers: IAnswer[];
}

export interface IAnswer {
  value: string;
  isCorrect: boolean;
  description?: string;
}
