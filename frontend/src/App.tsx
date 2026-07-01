import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./states/AuthState";

import Home from "./pages/Home";
import Login from "./pages/Login";
import BlogPost from "./pages/BlogPost";
import Categories from "./pages/Categories";
import Tags from "./pages/Tags";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:postId" element={<BlogPost />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;