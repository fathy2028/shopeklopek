import React, { useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "../../styles/authstyle.css";
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/v1/auth/forgotpassword`, { email, answer, newpassword });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <Mylayout title={t('auth.forgotPassword.title')}>
      <div className='auth-container'>
        <div className='login'>
          <h2>{t('auth.forgotPassword.heading')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                className="form-control"
                id="exampleInputEmail"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => { setAnswer(e.target.value) }}
                className="form-control"
                id="exampleInputAnswer"
                placeholder={t('auth.forgotPassword.answerPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                required
                value={newpassword}
                onChange={(e) => { setNewpassword(e.target.value) }}
                className="form-control"
                id="exampleInputPassword1"
                placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {t('auth.forgotPassword.submit')}
            </button>
          </form>
        </div>
      </div>
    </Mylayout>
  );
}

export default ForgotPassword;
