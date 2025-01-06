
import { Card, Table, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCourses } from '../../api-services/courses.api-service';
import { Course } from "../../models/course.model";
import { DataType } from "../../models/data-type.model";
import * as S from './CourseList.styles';

type CourseListItem = DataType<Pick<Course, 'code' | 'title' | 'description'>>;  // Updated to include code, title, and description

const columns: ColumnsType<CourseListItem> = [
  {
    title: 'Code', // Display the human-readable course code
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

function transformCoursesToDatasource(courses: Course[]): CourseListItem[] {
  return courses.map(course => ({
    key: course._id, // We still keep the original Mongo ID as `key` for row identification
    code: course.code, // Display the human-readable code
    title: course.title,
    description: course.description,  // Include description in the transformed data
  }));
}

export const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesDataSource, setCoursesDataSource] = useState<CourseListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");  // New state to store the search query

  // Fetch courses on component mount
  useEffect(() => {
    async function getCourses() {
      const coursesPayload = await fetchCourses();
      setCourses(coursesPayload);
    }
    getCourses();
  }, []);

  // Update courses data source when courses change or after search
  useEffect(() => {
    // Filter courses based on search query
    const filteredCourses = courses.filter(course => {
      return (
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setCoursesDataSource(transformCoursesToDatasource(filteredCourses));  // Update the table data
  }, [courses, searchQuery]);

  // Handle click on a course row
  function handleCourseClick(course: CourseListItem) {
    navigate(`./${course.code}`);  // Navigate to the course details using `code` as the URL
  }

  // Handle search query change
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  return (
    <S.Wrapper>
      <Input.Search
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder='Search for a course by code, title, or description'
        enterButton
        style={{ marginBottom: 16 }}  // Style the search input for better UX
      />

      <Card>
      <Table
  columns={columns}
  dataSource={coursesDataSource}
  rowKey="key"  // Ensure the row key is explicitly set to the unique 'key' from dataSource
  onRow={course => ({
    onClick: () => handleCourseClick(course),
    style: { cursor: "pointer" },
  })}
  scroll={{ y: '80vh' }}
/>
      </Card>
    </S.Wrapper>
  );
};
