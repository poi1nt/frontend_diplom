import { CloudUploadOutlined, RollbackOutlined } from '@ant-design/icons'
import { Button, Flex, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppSelector } from '../../hooks'
import { usersState } from '../../redux/slices/usersSlice'
import FileUploader from '../FileUploader/FileUploader'
import './downloadSection.scss'

export default function DownloadSection() {
    const { currentUser } = useAppSelector(usersState);
    const [ showUploadForm, setShowUploadForm] = useState(false);
    
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/admin');
    };

    return (
        <div className="download-section">
            {showUploadForm ? 
                <FileUploader setShowForm={setShowUploadForm} /> :
                
                <Flex gap="middle" className="download-section__buttons">
                    {currentUser?.is_staff && 
                        <Tooltip 
                            placement='left'
                            title='Вернуться к списку пользователей'
                        >
                            <Button 
                                className="download-section__button"
                                onClick={handleGoBack}
                            >
                                <RollbackOutlined /> Назад
                            </Button>
                        </Tooltip>
                    }
                    <Tooltip 
                        placement='left'
                        title='Загрузить файл'
                    >
                        <Button 
                            className="download-section__button"
                            onClick={() => setShowUploadForm(!showUploadForm)}
                        >
                            <CloudUploadOutlined /> Загрузить файл
                        </Button>
                    </Tooltip>
                </Flex>
            }
        </div>
    );
}