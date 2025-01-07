import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { Question } from '../../../models/course.model';

type EditQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: Partial<Question>) => void;
  question: Question | null;
};

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  question,
}) => {
  const [form] = Form.useForm();
  const [choices, setChoices] = useState<{ text: string; isCorrect: boolean }[]>([]);

  // Populate form and state when the modal is opened
  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        questionTitle: question.title,
      });
      setChoices(question.choices || []);
    }
  }, [question, form]);

  const handleChoiceChange = (index: number, field: keyof { text: string; isCorrect: boolean }, value: string | boolean) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    setChoices(updatedChoices);
  };

  const handleAddChoice = () => {
    if (choices.length < 4) {
      setChoices([...choices, { text: '', isCorrect: false }]);
    }
  };

  const handleSave = async () => {
    const updatedFields: Partial<Question> = {};
    const formValues = form.getFieldsValue();

    if (question) {
      // Check if the title has been updated
      if (formValues.questionTitle !== question.title) {
        updatedFields.title = formValues.questionTitle;
      }

      // Check if the choices have been updated
      if (JSON.stringify(choices) !== JSON.stringify(question.choices)) {
        updatedFields.choices = choices;
      }

      // Call the onSave callback with the updated fields
      if (Object.keys(updatedFields).length > 0) {
        onSave(updatedFields);
      }
    }
    onClose(); // Close the modal after saving
  };

  return (
    <Modal
      title="Edit Question"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ questionTitle: question?.title }}
      >
        <Form.Item
          label="Question Title"
          name="questionTitle"
          rules={[{ required: true, message: 'Please enter the question title' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter the updated question title" />
        </Form.Item>

        <Form.Item label="Choices">
          <Row gutter={[16, 16]}>
            {choices.map((choice, index) => (
              <Col span={24} key={index}>
                <Form.Item label={`Choice ${index + 1}`} required>
                  <Input
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                    placeholder={`Choice ${index + 1} text`}
                  />
                </Form.Item>
                <Checkbox
                  checked={choice.isCorrect}
                  onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                >
                  Correct Choice
                </Checkbox>
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
  );
};

export default EditQuestionModal;
