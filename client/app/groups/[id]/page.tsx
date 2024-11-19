"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

const GroupDetailsPage = ({ params }: { params: { id: string } }) => {
    const [group, setGroup] = useState({ name: "", description: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const groupId = params.id;

    type Group = {
        id: number;
        name: string;
        description: string;
        created_by: number;
      };
      

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const token = localStorage.getItem("authToken") || "";
                const data: Group[] = await api.listGroups(token); // Type the response as Group[]
                const selectedGroup = data.find((g) => g.id === parseInt(groupId, 10)); // Use a typed find method
                if (selectedGroup) {
                    setGroup(selectedGroup); // Set the selected group
                } else {
                    setErrorMessage("Group not found.");
                }
            } catch (error: unknown) {
                setErrorMessage("Failed to load group details.");
                console.error("Error fetching group:", error);
            }
        };

        fetchGroupDetails();
    }, [groupId]); // Add groupId as a dependency


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("authToken") || "";
            await api.deleteGroup(parseInt(groupId), token);
            router.push("/groups");
        } catch (error) {
            setErrorMessage("Failed to delete group.");
            console.error("Error deleting group:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
            <p className="mb-4">{group.description}</p>
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Delete Group
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
    );
};

export default GroupDetailsPage;