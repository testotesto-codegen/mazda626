import { useDispatch } from 'react-redux';
import client from '../client/Client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logoutSuccess } from '../redux/slices/authSlice';

const Logout = () => {
    const dispatch = useDispatch();
	const navigate = useNavigate();

    useEffect(() => {
        dispatch(logoutSuccess());
        client.logout();
        navigate("/");
    })
}

export default Logout;