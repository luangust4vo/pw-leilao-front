import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const hasLoggedIn = localStorage.getItem("hasLoggedIn");
        if (hasLoggedIn) return;

        toast.success(`Bem-vindo, ${user.name || user.email}!`);
        localStorage.setItem("hasLoggedIn", "true");
    }, [user]);

    return (
        <div>Dashboard</div>
    );
};

export default Dashboard;
