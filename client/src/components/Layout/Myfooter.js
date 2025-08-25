import React from 'react'
import {Link} from "react-router-dom"
import { useTranslation } from 'react-i18next';

const Myfooter = () => {
  const { t } = useTranslation();

  return (
    <div className='footer'>
   <h4 className='text-center'>
    {t('footer.allRightsReserved')}
   </h4>
   <p className='text-center mt-3'>
   <Link to="/contactus">{t('footer.contactUs')}</Link> | <Link to="/aboutus">{t('footer.aboutUs')}</Link> |  <Link to="/policy">{t('footer.privacyPolicy')}</Link>
   </p>
    </div>
  )
}

export default Myfooter