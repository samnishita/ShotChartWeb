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

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "home",
        element: <HomeComponent />,
      },
      {
        path: "search",
        element: <BodyComponent />,
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
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />

  </StrictMode>,
)
