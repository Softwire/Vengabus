import React from 'react';
import { NotificationManager } from 'react-notifications';

class VengaNotificationManager extends React.Component {
    success = (message, title = "Success", timeout = 5000, callback = undefined, priority = false) => {
        NotificationManager.success(message, title, timeout, callback, priority);
    }
    error = (message, title = "Error", timeout = 9999999, callback = undefined, priority = true) => {
        NotificationManager.error(message, title, timeout, callback, priority);
    }
    warning = (message, title = "Warning", timeout = 5000, callback = undefined, priority = false) => {
        NotificationManager.warning(message, title, timeout, callback = undefined, priority);
    }
    info = (message, title = "Info", timeout = 5000, callback = undefined, priority = false) => {
        NotificationManager.info(message, title, timeout, callback, priority);
    }
}

export const vengaNotificationManager = new VengaNotificationManager();