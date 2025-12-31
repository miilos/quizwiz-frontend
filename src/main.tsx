import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './components/App.tsx'
import './style/main.scss'
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({uri: 'http://127.0.0.1:38001/graphql/'}),
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
