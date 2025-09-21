"use client";

import { useAdmin } from "../../../../contexts/AdminContext";
import { SellerApplication } from "../../../../types/auth";

interface Props {
    application: SellerApplication;
    onBack: () => void;
}

const ApplicationDetail = ({ application, onBack }: Props) => {
    const { approveApplication, rejectApplication } = useAdmin();

    const handleApprove = () => {
        approveApplication(application.id);
        onBack();
    };

    const handleReject = () => {
        rejectApplication(application.id);
        onBack();
    };

    const profile = application.sellerProfileData;

    const renderDocumentPreview = (url: string) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        const isPdf = /\.pdf$/i.test(url);

        if (isImage) {
            return <img src={url} alt="Прев'ю документа" className="document-preview-content" />;
        }
        
        if (isPdf) {
            return <iframe src={url} title="Прев'ю документа" className="document-preview-content"></iframe>;
        }

        return <p>Формат документа не підтримує прев'ю. Відкрийте його за посиланням.</p>;
    };

    return (
        <div className="application-detail">
            <button onClick={onBack} className="back-button">← Повернутись до списку</button>
            <h2 className="section-title">Деталі заявки</h2>
            <div className="detail-grid">
                <div className="detail-item"><strong>ПІБ:</strong> {`${profile.fullName.lastName} ${profile.fullName.firstName} ${profile.fullName.middleName}`}</div>
                <div className="detail-item"><strong>Категорія:</strong> {application.categoryName}</div>
                <div className="detail-item"><strong>Телефон:</strong> {profile.phoneNumber.value}</div>
                <div className="detail-item"><strong>Дата народження:</strong> {new Date(profile.birthDate.value).toLocaleDateString()}</div>
                <div className="detail-item detail-full-width"><strong>Адреса:</strong> {`${profile.address.city}, ${profile.address.street}, ${profile.address.houseNumber}, кв. ${profile.address.apartmentNumber}`}</div>
            </div>

            <div className="document-section">
                <h3 className="section-title-small">Завантажений документ</h3>
                {application.documentUrl ? (
                    <>
                        <a href={application.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">Переглянути документ у новій вкладці</a>
                    </>
                ) : (
                    <p>Документ не було завантажено.</p>
                )}
            </div>

            <div className="detail-actions">
                <button className="reject-button" onClick={handleReject}>Відхилити</button>
                <button className="approve-button" onClick={handleApprove}>Схвалити</button>
            </div>
        </div>
    );
};

export default ApplicationDetail;