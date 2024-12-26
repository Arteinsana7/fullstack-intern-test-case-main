import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";  // Removed Navigate

import App from "./App.tsx";
import { CourseList } from "./courses/CourseList.tsx";
import { CourseDetails } from "./courses/CourseDetails.tsx"; 

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route element={<CourseList />} path="courses" />
      <Route element={<CourseDetails />} path="courses/:code" /> {/* Url route with code */}
    </Route>
  )
);
