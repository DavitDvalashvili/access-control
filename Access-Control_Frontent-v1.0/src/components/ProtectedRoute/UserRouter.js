import axios from "axios";
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom";

const UserRouter = () => {
    const [user, setUser] = useState(null);

    const url = process.env.REACT_APP_LOCAL_IP;

    const checkUser = async () => {
        await axios.get(`${url}:5000/checkuser`)
            .then(res => {
                if (res.status === 200) {
                    if (res.data.loggedIn) setUser(true);
                    else setUser(false);
                }
            })
    }

    useEffect(() => {
        checkUser();
    })

    if (user === false) return <Outlet />
    if (user === true) return <Navigate to="/" />
}
export default UserRouter