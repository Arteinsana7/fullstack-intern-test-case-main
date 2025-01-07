import { Modal, Radio, Button, Form } from 'antd';
import { Question } from '../../../models/course.model';

type ExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null; // Ensure proper typing for `question`
};

export const ExerciseModal = ({ isOpen, onClose, question }: ExerciseModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(() => {
      // Handle answer submission logic here (e.g., call API)
      onClose();
    });
  };

  return (
    <Modal
      title={question?.title || 'Exercise'}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Choices">
          <Radio.Group>
            {question?.choices?.map((choice, index) => (
              <Radio key={index} value={choice.text}>
                {choice.text}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Submit Answer
        </Button>
      </Form>
    </Modal>
  );
};
