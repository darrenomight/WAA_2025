"use client";
import { useEffect, useState } from "react";
import api from "../../src/api";

export interface User {
    id: number;
    email: string;
    username: string;
    role: string;
}

export default function ProtectedPage() {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProtected = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found. Please log in.");
                return;
            }

            try {
                const res = await api.get("/protected", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage(res.data.message);

                const me = await api.get("/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(me.data);
            } catch {
                setMessage("Unauthorized. Please log in.");
            }
        };

        fetchProtected();
    }, []);

    return (
        <div>
            <h2>Protected Page</h2>
            <p>{message}</p>
            {user && (
                <div>
                    <h3>User Info</h3>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
