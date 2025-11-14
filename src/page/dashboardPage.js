// Main Page combine all components
import React from "react";
import {useRealTimeData} from '../hooks/useRealTimeData';
import {DashboardLayout} from '../component/dashboardLayout';

export function DashboardPage(){
    // Replace useRealTimeDataMock with actual hook when ready
    // const {data, loading, error}=useRealTimeData();
    const { data, loading, error } = useRealTimeData();

    //if current component is null
    if(loading && !data){
        return(
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
                <p className="text-xl">Initializing Real-time Dashboard...</p>
            </div>
        );
    }
    if(error){
        return(
            <div className="flex items-center justify-center h-screen bg-red-600 text-white p-4">
                <p className="text-xl font-bold">Error Loading Data: {error}</p>
            </div>
        );
    }
    return (
        <DashboardLayout data={data} loading={loading} error={error}/>
    );
}

