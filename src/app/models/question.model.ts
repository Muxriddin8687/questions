export interface IQuestions {
    topicId: number;
    questions: IQuestion[];
}

interface IQuestion {
    value: string;
    description?: string;
    answers: IAnswer[];
}

interface IAnswer {
    value: string;
    isCorrect: boolean;
    description?: string;
}