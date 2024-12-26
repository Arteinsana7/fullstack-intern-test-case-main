import { Spin, Typography, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseByCode } from '../../api-services/courses.api-service';
import { Course } from '../../models/course.model';
import * as S from './CourseDetails.styles';  // Import your styled components

const { Title, Paragraph } = Typography;

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
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
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
        {course.questions && Array.isArray(course.questions) ? (
          course.questions.length > 0 ? (
            <ul>
              {course.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          ) : (
            <p>No questions available for this course</p>
          )
        ) : (
          <p>Questions data is not in the expected format</p>
        )}
      </S.DetailCard>

     
    </S.Wrapper>
  );
};
