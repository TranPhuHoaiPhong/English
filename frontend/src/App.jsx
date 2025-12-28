import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";

function App() {
  return (
    <>
      <Router>
        <HeaderComponent />
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
