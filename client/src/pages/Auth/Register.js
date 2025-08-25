import React, { useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "../../styles/authstyle.css";
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/v1/auth/register`, { name, email, password, phone, address, answer });
      if (res && res.data.success) {
        toast.success(isRTL ? t('auth.register.registerSuccess') : res.data.message);
        navigate("/login");
      } else {
        toast.error(isRTL ? t('auth.register.registerError') : res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(t('auth.register.registerError'));
    }
  }

  return (
    <Mylayout title={t('auth.register.title')}>
      <div className='auth-container'>
        <div className='register'>
          <h2>{t('auth.register.heading')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                id="exampleInputName"
                placeholder={t('auth.register.namePlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="exampleInputEmail"
                placeholder={t('auth.register.emailPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder={t('auth.register.passwordPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                id="exampleInputPhone"
                placeholder={t('auth.register.phonePlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                id="exampleInputAddress"
                placeholder={t('auth.register.addressPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                id="exampleInputAnswer"
                placeholder={t('auth.register.answerPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {t('auth.register.submit')}
            </button>
          </form>
        </div>
      </div>
    </Mylayout>
  );
}

export default Register;
