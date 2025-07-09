import { useEffect, useState } from 'react';
import { useGetUserProfileQuery } from '../../../api/endpoints/settingsApi';
import addIcon from '../../../assets/dashboard/icons/addIcon.svg';
import { openModal } from '../../../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleClick = () => {
		dispatch(openModal());
	};

	return (
		<div className="w-full bg-[#121416] py-10">
			<div
				className="bg-[#1D2022] shadow-2xl
				    w-[600px] h-[400px] mx-auto py-36 px-4  rounded-xl flex flex-col justify-center items-center space-y-12"
			>
				<div className="  text-3xl font-semibold ">
					<span className={`text-white  `}> Welcome, </span> <span className="gradient-text">{user.user.username}</span>
				</div>
				<img src={addIcon} alt="Add Icon" className="w-28 cursor-pointer " onClick={handleClick} />
			</div>
		</div>
	);
};

export default Welcome;
