import { useState, useEffect } from 'react';
import { Spin, Typography, Divider, Table, Modal, Input, Button, Checkbox, Form, Row, Col, Radio } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseByCode, updateQuestion } from '../../api-services/courses.api-service';
import { Course } from '../../models/course.model';
import * as S from './CourseDetails.styles';

const { Title, Paragraph } = Typography;

type Choice = {
  text: string;
  isCorrect: boolean;
};

export const CourseDetails = () => {
  const { code } = useParams(); // Fetch course by code
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false); // For student view of the exercise
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string>('');
  const [choices, setChoices] = useState<Choice[]>([]);

  const [form] = Form.useForm();

  // Fetch course details by its unique code
  useEffect(() => {
    async function getCourseDetails() {
      try {
        setLoading(true);
        setError(null);
        if (code) {
          const courseData = await fetchCourseByCode(code); // Fetch the course by its code
          setCourse(courseData);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getCourseDetails();
  }, [code]); // Re-run this effect when the `code` changes

  // Open modal to edit the question
  const handleEdit = (questionId: string) => {
    setEditingQuestionId(questionId);
    const question = course?.questions.find(q => q.id === questionId);
    if (question) {
      setQuestionTitle(question.title);
      setChoices(question.choices || []); // Fallback to empty array if choices is undefined
      form.setFieldsValue({
        questionTitle: question.title,
      });
    }
    setIsModalOpen(true);
  };

  // Open the exercise modal (student view) in V2 of the app it will be a page, and separte components.
  const handleExercise = (questionId: string) => {
    setEditingQuestionId(questionId);
    const question = course?.questions.find(q => q.id === questionId);
    if (question) {
      setQuestionTitle(question.title);
      setChoices(question.choices || []); // Fallback to empty array if choices is undefined
    }
    setIsExerciseModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsExerciseModalOpen(false);
    setQuestionTitle(''); // Reset question title on modal close
    setChoices([]); // Reset choices on modal close
  };

  // Save the updated question
  const handleOk = async () => {
    if (editingQuestionId && course && questionTitle && choices) {
      try {
        const updatedQuestion = await updateQuestion(course._id, editingQuestionId, { title: questionTitle, choices });
        setCourse(prevCourse => {
          if (!prevCourse) return null;
          return {
            ...prevCourse,
            questions: prevCourse.questions.map((question) =>
              question.id === editingQuestionId ? { ...question, title: updatedQuestion.title, choices: updatedQuestion.choices } : question
            ),
          };
        });
        setIsModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to update the question');
      }
    }
  };

  // Handle change of choice text
  const handleChoiceChange = (index: number, field: keyof Choice, value: string | boolean) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    setChoices(updatedChoices); // Update state to reflect the changes
  };

  // Handle Add Choice - allow up to 4 choices
  const handleAddChoice = () => {
    if (choices.length < 4) {
      setChoices([...choices, { text: '', isCorrect: false }]); // Add a new empty choice
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!course) {
    return <div style={{ textAlign: 'center' }}>Course not found</div>;
  }

  const questionsDataSource = course.questions.map((question) => ({
    id: question.id,
    title: question.title,
    action: (
      <Button onClick={() => handleEdit(question.id)} type="primary">
        Modify
      </Button>
    ),
    exerciseAction: (
      <Button onClick={() => handleExercise(question.id)} type="primary">
        Take Quiz
      </Button>
    ),
  }));

  const columns = [
    {
      title: 'Question Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (text: string) => text,
      
    },
    {
      title: 'Take Quiz',
      dataIndex: 'exerciseAction',
      key: 'exerciseAction',
      render: (text: string) => text,
    },
  ];

  return (
    <S.Wrapper>
      <S.BackButton type="primary" onClick={() => navigate('/courses')}>
      {<ArrowLeftOutlined />} Back to Courses
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
            pagination={false}
            scroll={{ y: '50vh' }}
            bordered
            rowKey="id"
          />
        ) : (
          <p>No questions available for this course</p>
        )}

        {/* Edit Question Modal (Teacher view) */}
        <Modal
          title="Edit Question"
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={handleOk}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOk}
          >
            <Form.Item
              label="Question Title"
              name="questionTitle"
              rules={[{ required: true, message: 'Please enter the question title' }]}
            >
              <Input
                value={questionTitle}
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                  form.setFieldsValue({ questionTitle: e.target.value });
                }}
                placeholder="Enter the updated question title"
              />
            </Form.Item>

            <Form.Item label="Choices">
              <Row gutter={[16, 16]}>
                {choices.map((choice, index) => (
                  <Col span={12} key={index}>
                    <Form.Item
                      label={`Choice ${index + 1}`}
                      required
                    >
                      <Input
                        value={choice.text}
                        onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                        placeholder={`Choice ${index + 1} text`}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`isCorrect-${index}`}
                      valuePropName="checked"
                    >
                      <Checkbox
                        checked={choice.isCorrect}
                        onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                      >
                        Correct Choice
                      </Checkbox>
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Form.Item>

            <Button
              type="dashed"
              onClick={handleAddChoice}
              block
              disabled={choices.length >= 4}
            >
              Add Choice
            </Button>
          </Form>
        </Modal>

        {/* Exercise Modal (Student view) */}
        <Modal
          title={questionTitle}
          open={isExerciseModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical">
            <Form.Item label="Choices">
              <Radio.Group>
                {choices.map((choice, index) => (
                  <Radio key={index} value={choice.text}>
                    {choice.text}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Button type="primary">Submit Answer</Button>
          </Form>
        </Modal>
      </S.DetailCard>
    </S.Wrapper>
  );
};
