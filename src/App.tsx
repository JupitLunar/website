import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Complete from './pages/momaiagent/complete';
import Product1 from './pages/products/Product1';
import Product2 from './pages/products/Product2';
import SiteFAQ from './pages/sitefaq';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/momaiagent/complete" element={<Complete />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/dearbaby" element={<Product1 />} />
        <Route path="/solidstart" element={<Product2 />} />
        <Route path="/faq" element={<SiteFAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
