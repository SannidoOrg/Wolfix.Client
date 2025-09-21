"use client";

import { useAdmin } from "../../../../contexts/AdminContext";
import { SellerApplication } from "../../../../types/auth";

interface Props {
    onSelectApplication: (application: SellerApplication) => void;
}

const ApplicationList = ({ onSelectApplication }: Props) => {
    const { applications } = useAdmin();

    if (!applications.length) {
        return <div>Активних заявок немає.</div>;
    }

    return (
        <div className="application-list">
            <h2 className="section-title">Заявки на отримання статусу продавця</h2>
            {applications.map((app) => (
                <div key={app.id} className="application-item" onClick={() => onSelectApplication(app)}>
                    <div className="app-item-main">
                        <span className="app-item-name">{`${app.sellerProfileData.fullName.lastName} ${app.sellerProfileData.fullName.firstName}`}</span>
                        <span className="app-item-category">{app.categoryName}</span>
                    </div>
                    <span className={`app-item-status status-${(app.status || '').toLowerCase()}`}>{app.status || 'Статус невідомий'}</span>
                </div>
            ))}
        </div>
    );
};

export default ApplicationList;