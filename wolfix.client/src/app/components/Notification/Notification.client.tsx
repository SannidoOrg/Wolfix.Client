"use client";

import { useGlobalContext } from "../../../contexts/GlobalContext";

const Notification = () => {    
    const { notification } = useGlobalContext();

    if (!notification) {
        return null;
    }

    const notificationClass = `notification show ${notification.type}`;

    return (
        <div className={notificationClass}>
            {notification.message}
        </div>
    );
};

export default Notification;