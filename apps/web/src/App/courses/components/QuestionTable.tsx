import { Table, Button } from 'antd';
import { Course } from '../../../App/../models/course.model';

type QuestionTableProps = {
    questions: Course['questions'];
    onEdit: (questionId: string) => void;
    onExercise: (questionId: string) => void;
  };
  
  export const QuestionTable = ({ questions, onEdit, onExercise }: QuestionTableProps) => {
    const columns = [
      {
        title: 'Question Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Actions',
        key: 'action',
        render: (_text: unknown, record: { id: string }) => (
          <Button type="primary" onClick={() => onEdit(record.id)}>
            Modify
          </Button>
        ),
      },
      {
        title: 'Take Quiz',
        key: 'exerciseAction',
        render: (_text: unknown, record: { id: string }) => (
          <Button type="primary" onClick={() => onExercise(record.id)}>
            Take Quiz
          </Button>
        ),
      },
    ];
  
    const dataSource = questions.map((question) => ({
      key: question.id,
      id: question.id,
      title: question.title,
    }));
  
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: '50vh' }}
        bordered
      />
    );
  };