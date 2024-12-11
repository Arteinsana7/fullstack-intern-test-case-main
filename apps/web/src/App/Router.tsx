import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import App from "./App.tsx";
import { CourseList } from "./courses/CourseList.tsx";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route element={<CourseList />} path="courses" />

      <Route element={<Navigate replace={true} to='/courses' />} path='/' />
    </Route>
  )
);