import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledForm } from "./StyledForm";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user_id) {
      navigate("/admin/clients");
    }
  }, [auth.user_id, navigate]);

  const [username, setUsername] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(username));
  };
  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h2>login</h2>
        <input
          type="text"
          placeholder="username"
          onChange={(e) =>
            setUsername({ ...username, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) =>
            setUsername({ ...username, password: e.target.value })
          }
        />
        <button>
          {auth.loginStatus === "pending" ? "submitting" : "login"}
        </button>

        {auth.loginStatus === "rejected" ? <p>{auth.loginError}</p> : null}
      </StyledForm>
    </>
  );
};

export default Login;
