import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'; 
import App from './App.tsx';
import { CourseList } from './courses/CourseList.tsx';
import { CourseDetails } from './courses/CourseDetails.tsx';

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      {/* Redirect root (/) to /courses */}
      <Route path="/" element={<Navigate to="courses" replace />} />
      {/* Courses listing */}
      <Route element={<CourseList />} path="courses" />
      {/* Course details by code */}
      <Route element={<CourseDetails />} path="courses/:code" />
    </Route>
  )
);
