import React from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import NotFound from "./pages/NotFound";

const App = () => {
  let element = useRoutes([
    {
      path: "/",
      errorElement: <NotFound />,
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "movie/:id",
          element: <Movie />,
        },
      ],
    },
  ]);
  return element;
};

export default App;
