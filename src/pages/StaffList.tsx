import React, { useState, useEffect } from 'react';

// Define the shape of a single staff member object for clarity
interface StaffMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  __v: number;
}

// Define the shape of the full response data
interface StaffData {
  totalStaff: number;
  staffList: StaffMember[];
}



interface StaffListProps {
    staffDataP: StaffData;
}

const StaffListComponent: React.FC<StaffListProps> = ({staffDataP}) => {
    // 1. State to store the fetched data
    // const [staffData, setStaffData] = useState<StaffData | null>(null);
    // const [error, setError] = useState<string | null>(null);

    // 2. useEffect for data fetching (runs once on mount)
   

    

    if (!staffDataP || staffDataP?.staffList.length === 0) {
        return (
            <div className="p-4 max-w-lg mx-auto text-center text-gray-500">
                No staff members found.
            </div>
        );
    }
    
    // 4. Render the component UI
    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* <h2 className="mb-6 text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start">
                👥 Staff Directory
            </h2> */}
            
            <p className="font-bold text-xl p-4 mb-6 border border-gray-200 rounded-lg bg-indigo-50 text-center">
                Total Staff Count: 
                <span className="text-indigo-600 ml-2">{staffDataP?.totalStaff}</span>
            </p>

            {/* --- Staff List: Responsive Table/Card Layout --- */}

            <div className=" rounded-lg overflow-hidden">
                {/* Table Header (Hidden on small screens, shown on md screens and up) 
                */}
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                First Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Last Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {staffDataP?.staffList.map((staff) => (
                            <tr key={staff._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                    {staff._id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {staff.firstName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {staff.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    {staff.email}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile View (Visible on screens smaller than md, using cards) 
                */}
                <div className="block md:hidden">
                    {staffDataP?.staffList.map((staff) => (
                        <div key={staff._id} className="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
                            
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">ID</span>
                                <span className="text-sm font-mono text-gray-800">{staff._id.slice(-8)}</span>
                            </div>

                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">Name</span>
                                <span className="text-sm text-gray-900 font-semibold">{staff.firstName} {staff.lastName}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Email</span>
                                <span className="text-sm text-blue-600 break-all">{staff.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default StaffListComponent;