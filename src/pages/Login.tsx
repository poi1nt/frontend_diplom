import type { FormProps } from 'antd'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  clearError,
  setStorageOwner,
  usersState 
} from '../redux/slices/usersSlice'
import { ILoginFormData } from '../models'
import { loginUser } from '../services/userServices'
import { useAppDispatch, useAppSelector } from '../hooks'
import './Login.scss'

interface FieldType {
  userName?: string,
  password?: string,
  remember?: string,
}

export default function Login() {
  const {isLoading} = useAppSelector(usersState);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, setError] = useState('');

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setError('');
    const formData: ILoginFormData = {
      username: values.userName ?? '',
      password: values.password ?? '',
    };
    
    dispatch(loginUser(formData))
      .unwrap()
      .then((data) => {
        console.log('Вход выполнен успешно');
        message.success({
          content: 'Вход выполнен успешно',
          duration: 2,
        });
        dispatch(clearError());
        localStorage.setItem('token', data.token);

        if (data.user.is_staff) {
          navigate('/admin');
        } else {
          dispatch(setStorageOwner(data.user));
          navigate('/storage');
        }
      })
      .catch((error) => {
        console.log('Ошибка входа:', error);
        setError(error);
        message.error({
          content: error,
          duration: 2,
        });
      });
  };    
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Ошибка входа:', errorInfo.errorFields[0].errors[0]);
    message.error({
      content: errorInfo.errorFields[0].errors[0],
      duration: 2,
    });
  };
  
  return (
    <Card 
      className='card'
      title={<h1>Аутентификация</h1>}
      bordered={false}
    > 
      <Form
        name='basic'
        layout='vertical'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        className='form'
      >
        <Form.Item<FieldType>
          label='Логин'
          name='userName'
          rules={[{ required: true, message: 'Пожалуйста, введите Ваш логин' }]}
        >
          <Input placeholder='Логин'/>
        </Form.Item>

        <Form.Item<FieldType>
          label='Пароль'
          name='password'
          rules={[{ required: true, message: 'Пожалуйста, введите Ваш пароль' }]}
        >
          <Input.Password placeholder='Пароль'/>
        </Form.Item>

        <Form.Item<FieldType>
          name='remember'
          valuePropName='checked'
        >
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>
        
        <Form.Item>
          <Button 
            className='button'
            htmlType='submit'
            size='large'
            loading={isLoading}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}