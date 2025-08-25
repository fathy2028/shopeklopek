import React from 'react'
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserMenu = () => {
  const { t } = useTranslation();

  return (
    <>
<div className='text-ceter'>
<div class="list-group">
<h1 className='bg-black text-light'>{t('dashboard.userPanel')}</h1>
  <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action">{t('dashboard.profile')}</NavLink>
  <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">{t('dashboard.orders')}</NavLink>
</div>
</div>
    </>
  )
}

export default UserMenu