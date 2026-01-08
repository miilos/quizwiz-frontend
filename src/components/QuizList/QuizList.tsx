import { gql } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { Spinner } from "react-bootstrap";
import Quiz from "../Quiz/Quiz";
import type { Quiz as QuizType } from "../../types";
import SearchBar from "../SearchBar/SearchBar";

interface QuizResult {
  quizzes: [QuizType]
}

interface QuizSearchResult {
  searchQuizzes: [QuizType]
}

interface SearchQuizInput {
  keywords: string
}

const GET_ALL_QUIZZES = gql`
  query GetAllQuizzes {
    quizzes {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
      }
      author {
        id
        username
      }
    }
  }
`

const SEARCH_QUIZZES = gql`
  query SearchQuizzes($query: SearchQuizInput!) {
    searchQuizzes(searchParams: $query) {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
        
      }
      questions {
        id
      }
      author {
        id
        username
      }
    }
  }
`

function QuizList() {
  const { loading, error, data } = useQuery<QuizResult>(GET_ALL_QUIZZES)
  const [ searchQuizzes, { loading: searchLoading, error: searchError, data: searchData } ] = useLazyQuery<QuizSearchResult>(SEARCH_QUIZZES)

  const handleSearch = (query: SearchQuizInput) => {
    searchQuizzes({
      variables: { query }
    })
  }

  const isLoading = searchLoading ?? loading
  const hasError = searchError ?? error
  const quizData = searchData?.searchQuizzes ?? data?.quizzes

  if (isLoading) {
    return (
      <Spinner animation="border" role="status" className="loader loader--primary" />
    )
  }

  if (hasError) {
    return (
      <div className="error"></div>
    )
  }

  return (
    <>
      <SearchBar handleSearch={handleSearch} />

      <div className="quiz-list-container">
        <h1 className="quiz-list__title">Browse quizzes</h1>

        <div className="quiz-list__quizzes">
          { 
            quizData?.length ? (
              quizData?.map(
                quiz => <Quiz quiz={quiz} key={quiz.id} />
              )
            ) : (
              <p>There are no search results for these keywords :(</p>
            )
          }
        </div>
      </div>
    </>
  )
}

export default QuizList;