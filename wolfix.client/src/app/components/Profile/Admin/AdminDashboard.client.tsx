"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../../contexts/AdminContext";
import { SellerApplication } from "../../../../types/auth";
import ApplicationList from "./ApplicationList.client";
import ApplicationDetail from "./ApplicationDetail.client";
import "../../../../styles/Admin.css";

const AdminDashboard = () => {
    const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
    const { loading, fetchApplications } = useAdmin();

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleBackToList = () => {
        setSelectedApplication(null);
    };

    if (loading && !selectedApplication) {
        return <div>Завантаження заявок...</div>;
    }

    return (
        <div className="admin-dashboard">
            {selectedApplication ? (
                <ApplicationDetail application={selectedApplication} onBack={handleBackToList} />
            ) : (
                <ApplicationList onSelectApplication={setSelectedApplication} />
            )}
        </div>
    );
};

export default AdminDashboard;