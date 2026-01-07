export interface Question {
  id: number;
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

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  createdAt: Date
  questions: [Question]
  tags?: [Tag]
  author: Author
}