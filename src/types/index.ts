export interface QuestionBase {
  id: number;
}

export interface Question extends QuestionBase {
  text: string;
  options: [string];
  correctAnswer: [number];
  type: string;
  position: number
  explanation?: string
}

export interface Author {
  id: number;
  username: string;
}

export interface Tag {
  id: number;
  name: string;
  displayName: string;
}

export interface QuizOverview {
  id: number;
  title: string;
  description?: string;
  createdAt: Date
  questions: [QuestionBase]
  tags?: [Tag]
  author: Author
}

export interface QuizDetails extends Omit<QuizOverview, 'questions'> {
  questions: [Question]
}