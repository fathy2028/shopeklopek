import React, { useEffect, useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState(1440); // Default 24 hours in minutes
  const [photo, setPhoto] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedname, setUpdatedName] = useState("");
  const [updatedDeliveryDuration, setUpdatedDeliveryDuration] = useState(1440); // Default 24 hours in minutes
  const [updatedPhoto, setUpdatedPhoto] = useState(null);
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('deliveryDuration', deliveryDuration);
      if (photo) {
        formData.append('photo', photo);
      }

      const { data } = await axios.post(`${backendUrl}/api/v1/category/create-category`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : ''
        }
      });
      if (data?.success) {
        const formatDuration = (minutes) => {
          if (minutes < 60) return `${minutes} minutes`;
          if (minutes === 60) return '1 hour';
          if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes === 0 ? `${hours} hours` : `${hours} hours and ${remainingMinutes} minutes`;
          }
          const days = Math.floor(minutes / 1440);
          const remainingHours = Math.floor((minutes % 1440) / 60);
          return remainingHours === 0 ? `${days} days` : `${days} days and ${remainingHours} hours`;
        };
        toast.success(`${name} is created with ${formatDuration(deliveryDuration)} delivery duration`);
        getallCategories();
        setName("");
        setDeliveryDuration(1440); // Reset to 24 hours in minutes
        setPhoto(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in submitting the category");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', updatedname);
      formData.append('deliveryDuration', updatedDeliveryDuration);
      if (updatedPhoto) {
        formData.append('photo', updatedPhoto);
      }

      const { data } = await axios.put(`${backendUrl}/api/v1/category/update-category/${selected._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : ''
        }
      });
      if (data.success) {
        const formatDuration = (minutes) => {
          if (minutes < 60) return `${minutes} minutes`;
          if (minutes === 60) return '1 hour';
          if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes === 0 ? `${hours} hours` : `${hours} hours and ${remainingMinutes} minutes`;
          }
          const days = Math.floor(minutes / 1440);
          const remainingHours = Math.floor((minutes % 1440) / 60);
          return remainingHours === 0 ? `${days} days` : `${days} days and ${remainingHours} hours`;
        };
        toast.success(`Category updated: ${updatedname} with ${formatDuration(updatedDeliveryDuration)} delivery`);
        setSelected(null);
        setUpdatedName("");
        setUpdatedDeliveryDuration(1440);
        setUpdatedPhoto(null);
        setVisible(false);
        getallCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handledelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/v1/category/deletecategory/${id}`);
      if (data.success) {
        toast.success(`Deleted successfully`);
        setSelected(null);
        getallCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getallCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
      if (data?.success) {
        setCategories(data?.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching categories");
    }
  };

  useEffect(() => {
    getallCategories();
  }, []);

  return (
    <Mylayout title={"Dashboard - Create Category"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Category Management</h1>
            <div className='p-3 w-50'>
              <CategoryForm
                handlesubmit={handlesubmit}
                value={name}
                setValue={setName}
                deliveryDuration={deliveryDuration}
                setDeliveryDuration={setDeliveryDuration}
                photo={photo}
                setPhoto={setPhoto}
              />
            </div>
            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Delivery Duration</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{(() => {
                        const minutes = c.deliveryDuration || 1440;
                        if (minutes < 60) return `${minutes} minutes`;
                        if (minutes === 60) return '1 hour';
                        if (minutes < 1440) {
                          const hours = Math.floor(minutes / 60);
                          const remainingMinutes = minutes % 60;
                          return remainingMinutes === 0 ? `${hours} hours` : `${hours}h ${remainingMinutes}m`;
                        }
                        const days = Math.floor(minutes / 1440);
                        const remainingHours = Math.floor((minutes % 1440) / 60);
                        return remainingHours === 0 ? `${days} days` : `${days}d ${remainingHours}h`;
                      })()}</td>
                      <td>
                        <button
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setUpdatedDeliveryDuration(c.deliveryDuration || 1440);
                            setSelected(c);
                          }}
                          className='btn btn-primary ms-2'
                        >
                          Edit
                        </button>
                        <button onClick={() => handledelete(c._id)} className='btn btn-danger ms-2'>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
              <CategoryForm
                value={updatedname}
                setValue={setUpdatedName}
                handlesubmit={handleupdate}
                deliveryDuration={updatedDeliveryDuration}
                setDeliveryDuration={setUpdatedDeliveryDuration}
                photo={updatedPhoto}
                setPhoto={setUpdatedPhoto}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Mylayout>
  );
};

export default CreateCategory;
