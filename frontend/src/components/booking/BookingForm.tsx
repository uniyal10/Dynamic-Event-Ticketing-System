import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface BookingFormProps {
    userName: string;
    setUserName: (name: string) => void;
    disabled?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({ userName, setUserName, disabled }) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label htmlFor="userName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Full Name
                    </label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={disabled}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
