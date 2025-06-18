import React from 'react';

const HasPermission = ({ access, menuCode, action, children }) => {
    const actionMap = {
        create: 'c',
        read: 'r',
        update: 'u',
        delete: 'd',
    };

    if (!access || !Array.isArray(access.details)) {
        return null;
    }

    const accessDetail = access.details.find((detail) => detail.access_code === menuCode);

    if (accessDetail && accessDetail[actionMap[action]] === 1) {
        return <>{children}</>;
    }

    return null;
};

export default HasPermission;
