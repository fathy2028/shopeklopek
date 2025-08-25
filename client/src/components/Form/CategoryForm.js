import React from 'react'

const CategoryForm = ({handlesubmit, value, setValue, deliveryDuration, setDeliveryDuration, photo, setPhoto}) => {
  return (
    <div>
      <form onSubmit={handlesubmit}>
        <div className="mb-3">
          <input
            style={{ width: '300px' }}
            type="text"
            className="form-control"
            placeholder='Enter Category Name'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Delivery Duration (minutes)</label>
          <input
            style={{ width: '300px' }}
            type="number"
            className="form-control"
            placeholder='Enter delivery duration in minutes (30-10080)'
            value={deliveryDuration || ''}
            onChange={(e) => setDeliveryDuration(parseInt(e.target.value))}
            min="30"
            max="10080"
            required
          />
          <small className="form-text text-muted">
            Enter delivery duration in minutes (30 minutes to 10080 minutes/7 days). Examples: 30 min, 60 min (1 hour), 1440 min (24 hours)
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label">Category Image</label>
          <input
            style={{ width: '300px' }}
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <small className="form-text text-muted">
            Upload an image for the category (optional)
          </small>
          {photo && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(photo)}
                alt="Category preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default CategoryForm
