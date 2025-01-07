import { ArrowLeftOutlined } from '@ant-design/icons';
import * as S from '../CourseDetails.styles'; // Import styled components
import { NavigateFunction } from 'react-router-dom';

type BackButtonProps = {
  navigate: NavigateFunction;
};

export const BackButton = ({ navigate }: BackButtonProps) => (
  <S.BackButton
    type="primary"
    onClick={() => navigate('/courses')}
    icon={<ArrowLeftOutlined />}
  >
    Back to Courses
  </S.BackButton>
);
