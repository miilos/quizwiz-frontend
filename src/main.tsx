import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './components/App.tsx'
import './style/main.scss'
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from '@apollo/client'
import { BACKEND_BASE_URI } from './config'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'

const client = new ApolloClient({
  link: new HttpLink({uri: BACKEND_BASE_URI + '/graphql/'}),
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </StrictMode>
)
