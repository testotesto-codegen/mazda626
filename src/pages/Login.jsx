import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import FormTemplate from "../components/common/FormTemplate";
import { useLoginMutation } from "../api/endpoints/authApi";
import { useDispatch } from "react-redux";
import client from "../client/Client";
import { loginSuccess } from "../redux/slices/authSlice";
import AuthTemplate from "../components/common/AuthTemplate";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slices/userSlice";
import { logoutSuccess } from "../redux/slices/authSlice";

const inputs = [
  {
    id: 1,
    type: "text",
    placeholder: "Email or Username",
    value: "username",
    label: "Email or Username",
  },
  {
    id: 2,
    type: "password",
    placeholder: "Password",
    value: "password",
    label: "Password",
  },
];

const Login = () => {
  const user = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [loginError, setLoginError] = useState("");
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      setLoginError("");
      setCheckingSubscription(false);
      const response = await client.login(data.username, data.password);
      console.log("Login response:", response);

      if (response.status === 200) {
        dispatch(loginSuccess());

        // Get user info
        const userResponse = await client.getUser();
        console.log("User response:", userResponse);

        if (userResponse.status === 200) {
          dispatch(setUser(userResponse.data));

          // Check subscription status
          setCheckingSubscription(true);
          const subscriptionResponse = await client.checkSubscription();
          setCheckingSubscription(false);
          console.log("Subscription response:", subscriptionResponse);

          if (subscriptionResponse.has_subscription) {
            navigate("/dashboard");
          } else {
            navigate("/subscription");
          }
        } else {
          dispatch(logoutSuccess());
          dispatch(setUser({}));
          client.setAccessToken(""); // Clear token
          navigate("/login");
        }
      } else {
        setLoginError("Username or password is incorrect, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.data || "An error occurred during login");
      client.setAccessToken(""); // Clear token on error
      setCheckingSubscription(false);
    }
  };

  const checkIfUserIsLoggedIn = () => {
    // Check if user is not empty, user is logged in, and refresh_token exists in cookies
    const hasUser = user && user.user && Object.keys(user.user).length > 0;
    const hasRefreshToken = document.cookie.split(';').some((item) => item.trim().startsWith('refresh_token='));
    if (hasUser && isLoggedIn && hasRefreshToken) {
      navigate("/dashboard");
      return null;
    }
  }

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);


  return (
    <>
      <div className="flex min-h-screen">
        <AuthTemplate title="WELCOME BACK" />
        <FormTemplate
          formType="Login"
          inputs={inputs}
          submitHandler={submitHandler}
          isLoading={isLoading || checkingSubscription}
          errorMessage={loginError}
          successMessage={isSuccess}
        />
      </div>
    </>
  );
};

export default Login;
