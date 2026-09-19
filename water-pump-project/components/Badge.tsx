import React from 'react';
import { Text, View } from 'react-native';

export default function Badge({ status }: { status: number | string }) {
    const isRunning = status == 1 || status === 'ON' || status === '1';

    return (
        <View 
            className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                isRunning 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-slate-100 border-slate-200'
            }`}
        >
            <View 
                className={`w-2 h-2 rounded-full mr-2 ${
                    isRunning ? 'bg-emerald-500' : 'bg-slate-400'
                }`} 
            />
            <Text 
                className={`text-xs font-bold tracking-wider uppercase ${
                    isRunning ? 'text-emerald-700' : 'text-slate-600'
                }`}
            >
                {isRunning ? 'Running' : 'Standby'}
            </Text>
        </View>
    );
}

