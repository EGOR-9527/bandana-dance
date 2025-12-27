import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppRoutes } from "../shared/config/routes";
import Home from "../pages/Home";
import Gallery from "../pages/Gallery";
import Teams from "../pages/Teams";

const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route path={AppRoutes.HOME} element={<Home />} />
      <Route path={AppRoutes.GALLERY} element={<Gallery />} />
      <Route path={AppRoutes.TEAMS} element={<Teams />} />
    </Routes>
  </BrowserRouter>
);

export default RouterProvider;
