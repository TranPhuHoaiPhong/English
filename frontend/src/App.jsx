import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {routes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
