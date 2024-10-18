import React, { useState } from 'react';
import { Switch } from 'react-native';

function AppSwitch(props) {
    const [isNew, setNewValue] = useState(false);
    return (
        <Switch value={isNew} onValueChange={(newValue) => setNewValue(newValue)} />
    );
}

export default AppSwitch;