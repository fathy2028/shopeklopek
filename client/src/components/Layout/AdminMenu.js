import React from 'react'
import Mylayout from './Mylayout';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminMenu = () => {
  const { t } = useTranslation();

  return (
    <>
<div className='text-ceter'>
<div class="list-group">
<h1 className='bg-black text-light'>{t('dashboard.adminPanel')}</h1>
  <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">{t('dashboard.createCategory')}</NavLink>
  <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">{t('dashboard.createProduct')}</NavLink>
  <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">{t('dashboard.products')}</NavLink>
  <NavLink to="/dashboard/admin/allusers" className="list-group-item list-group-item-action">{t('dashboard.users')}</NavLink>
  <NavLink to="/dashboard/admin/adminprofile" className="list-group-item list-group-item-action">Profile</NavLink>
  <NavLink to="/dashboard/admin/allorders" className="list-group-item list-group-item-action">Orders</NavLink>
</div>
</div>
    </>
  )
}

export default AdminMenu