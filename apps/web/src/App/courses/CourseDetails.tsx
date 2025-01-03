import { Spin, Typography, Divider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseByCode } from '../../api-services/courses.api-service';
import { Course } from '../../models/course.model';  // Import the Course type (no need for Question import)
import * as S from './CourseDetails.styles';

const { Title, Paragraph } = Typography;

// Define the table columns for the questions
const columns = [
  {
    title: 'Question Title',
    dataIndex: 'title',
    key: 'title',
  },
];

export const CourseDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCourseDetails() {
      try {
        setLoading(true);
        setError(null);
        if (code) {
          const courseData = await fetchCourseByCode(code);
          setCourse(courseData);
          console.log('Fetched course data:', courseData);  // Log the data to check structure
        }
      } catch (err) {
        console.error('Error fetching course data:', err);  // Log the error to the console
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getCourseDetails();
  }, [code]);

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!course) {
    return <div style={{ textAlign: 'center' }}>Course not found</div>;
  }

  // Now TypeScript knows that `course.questions` is an array of `Question` objects
  const questionsDataSource = course.questions.map((question) => ({
    key: question.id,  // Use the question's ID as a unique key
    title: question.title,
  }));

  return (
    <S.Wrapper>
      <S.BackButton type="primary" onClick={() => navigate('/courses')}>
        Back to Courses
      </S.BackButton>
      <S.DetailCard>
        <Title level={2}>{course.title}</Title>
        <Paragraph><strong>Code:</strong> {course.code}</Paragraph>
        <Paragraph><strong>Description:</strong> {course.description}</Paragraph>

        <Divider />
        <Title level={4}>Questions</Title>

        {course.questions && course.questions.length > 0 ? (
          <Table
            columns={columns}
            dataSource={questionsDataSource}
            pagination={false}  // Disable pagination
            scroll={{ y: '50vh' }}  // Optional: Add vertical scroll for a large number of questions
            bordered
            rowKey="key"  // Ensure each row has a unique key
          />
        ) : (
          <p>No questions available for this course</p>
        )}
      </S.DetailCard>
    </S.Wrapper>
  );
};
