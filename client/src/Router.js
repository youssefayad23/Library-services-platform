import Home from "./pages/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    childeren: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
