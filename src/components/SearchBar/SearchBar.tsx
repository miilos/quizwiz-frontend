import React, { useState } from "react"
import { IoSearch } from "react-icons/io5"

interface SearchBarProps {
  handleSearch: CallableFunction
}

function SearchBar({ handleSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleSearch({
      keywords: query
    })
    setQuery('')
  }

  return (
    <>
      <form className="searchbar" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          id="search"
          className="searchbar__input"
          placeholder="Search quizzes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="searchbar__btn">
          <IoSearch />
        </button>
      </form>
    </>
  )
}

export default SearchBar