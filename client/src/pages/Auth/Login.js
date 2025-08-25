import React, { useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import "../../styles/authstyle.css";
import { useAuth } from '../../context/auth';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const { t, i18n } = useTranslation();
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/v1/auth/login`, { email, password });
      if (res && res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        toast.success(isRTL ? t('auth.login.loginSuccess') : res.data.message);
        navigate(location.state || "/");
      } else {
        toast.error(isRTL ? t('auth.login.loginError') : res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(t('auth.login.loginError'));
    }
  }

  return (
    <Mylayout title={t('auth.login.title')}>
      <div className='auth-container'>
        <div className='login'>
          <h2>{t('auth.login.heading')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                className="form-control"
                id="exampleInputEmail"
                placeholder={t('auth.login.emailPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                className="form-control"
                id="exampleInputPassword1"
                placeholder={t('auth.login.passwordPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <button
                type="button"
                onClick={() => { navigate("/forgotpassword") }}
                className="btn btn-secondary"
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>
            <button type="submit" className="btn btn-primary">
              {t('auth.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </Mylayout>
  );
}

export default Login;
