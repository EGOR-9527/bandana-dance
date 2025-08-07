import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppRoutes } from "../shared/config/routes";
import Home from "../pages/Home";
import Gallery from "../pages/Gallery";

const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route path={AppRoutes.HOME} element={<Home />} />
      <Route path={AppRoutes.GALLERY} element={<Gallery />} />
    </Routes>
  </BrowserRouter>
);

export default RouterProvider;
