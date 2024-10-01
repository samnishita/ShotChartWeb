import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PageNotFound from './app/PageNotFound/PageNotFound.tsx';
import HomeComponent from './app/HomeComponent/HomeComponent.tsx';
import BodyComponent from './app/BodyComponent/BodyComponent.tsx';
import SearchComponent from './app/SearchComponent/SearchComponent.tsx';
import { setupWorker } from 'msw/browser'
import { handlers } from './mocks/handlers.ts';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        path: "home",
        element: <HomeComponent />,
      },
      {
        path: "search",
        element: <SearchComponent />,
      },
      {
        path: "advanced",
        element: <BodyComponent />,
      },
      {
        path: "",
        element: <Navigate to="home" replace />,
      },
      {
        path: "/",
        element: <Navigate to="home" replace />,
      },
      {
        path: "404",
        element: <PageNotFound />,
      },
      {
        path: "*",
        element: <Navigate to="404" replace />,
      }

    ],
  },
]);

const deferRender = async () => {
  if (process.env.NODE_ENV === 'dev') {
    console.log("DEV")
    let mockServiceWorker = setupWorker(...handlers);
    return mockServiceWorker.start({
      onUnhandledRequest: 'bypass'
    });
  }
}

deferRender().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
