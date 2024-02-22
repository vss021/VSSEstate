import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';



const CreateListing = () => {

  const { currentUser } = useSelector((state) => state.user);

  const [images, setImg] = useState([]);
  const [imageUploadingError, setImagUploadingError] = useState(false);
  const [imgErrorMessage, setImgErrorMessage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [imgUpload, setImgUpload] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const  navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const postDetails = () => {
    // posting images to Cloudinary

    if (images.length > 0 && images.length + formData.imageUrls.length < 7) {
      const uploadImage = async (image) => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "Instra-clone");
        data.append("cloud_name", "vijays");

        try {
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/vijays/image/upload",
            {
              method: "POST",
              body: data,
            }
          );
          const imageData = await response.json();
          return imageData.url;
        } catch (error) {
          setImagUploadingError(true);
          setImgErrorMessage("Error in Uploading Image's");
          return;
        }
      };

      const uploadAllImages = async () => {
        const uploadedImageUrls = [];
        for (const image of images) {
          const imageUrl = await uploadImage(image);
          if (imageUrl) {
            uploadedImageUrls.push(imageUrl);
          }
        }
        setFormData({
          ...formData,  
          imageUrls: formData.imageUrls.concat(uploadedImageUrls),
        });
      };

      uploadAllImages();
    } else {
      setImagUploadingError(true);
      setImgErrorMessage("You can only Upload 6 Images ");
    }
  };

  const handleChange = (event) => {
    
    if(event.target.id === 'sale' || event.target.id === 'rent'){
        setFormData({
            ...formData,
            type : event.target.id,
        })
    }
    if(event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer'){

        setFormData({
            ...formData,
            [event.target.id] : event.target.checked
        })
    }

    if(event.target.type === 'number' || event.target.type === 'text' || event.target.type === 'textarea' ){
        setFormData({
            ...formData,
            [event.target.id] : event.target.value,
        })
    }
  };

  const deleteImg = (index) => {
    setFormData({
      ...FormData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async() => {
    
    try{

      if(formData.imageUrls.length < 1){
        return setError('You must upload at least one image');
      }

      if (+formData.regularPrice < + formData.discountPrice){
        return setError('Discount price must be lower than regular price');
      }

      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    }
    catch(error){
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  

  return (

    <main className="p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-8 ">
        Create a Listing
      </h1>

      <form className=" flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className=" border p-3 rounded-lg"
            id="name"
            maxLength="64"
            minLength="3"
            required
          />

          <textarea
            onChange={handleChange}
            value={formData.description}
            type="text"
            placeholder="Description"
            className=" border p-3 rounded-lg"
            id="description"
            minLength="3"
            required
          />

          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            minLength="3"
            required
          />

          <div className=" flex gap-6 flex-wrap">
            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="checkbox"
                id="sale"
                checked = {formData.type === 'sale'}
                className="w-5"
              />
              <span>Sell</span>
            </div>

            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="checkbox"
                id="rent"
                checked = {formData.type === 'rent'}
                className="w-5"
              />
              <span>Rent</span>
            </div>

            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="checkbox"
                id="parking"
                checked = {formData.parking}
                className="w-5"
              />
              <span>Parking spot</span>
            </div>

            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="checkbox"
                id="furnished"
                checked = {formData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>

            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="checkbox"
                id="offer"
                checked = {formData.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className=" flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="bedrooms"
                min="1"
                value={formData.bedrooms}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Beds</span>
            </div>

            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="bathrooms"
                min="1"
               
                value={formData.bathrooms}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Baths</span>
            </div>

            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="regularPrice"
                min="100"
                value={formData.regularPrice}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className=" flex flex-col items-center">
                <span>Regular Price</span>
                <span className=" text-xs">($ / month)</span>
              </div>
            </div>
            {
              formData.offer && (
            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.discountPrice}
                type="number"
                id="discountPrice"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className=" flex flex-col items-center">
                <span>Discounted Price</span>
                <span className=" text-xs">($ / month)</span>
              </div>
            </div> 
            )}
          </div>
        </div>

        <div className=" flex flex-col flex-1 gap-4">
          <p className=" font-semibold">
            Images
            <span className=" font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className=" flex gap-4">
            <input
              onChange={(e) => setImg(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded-lg w-full "
            />

            <button
              type="button"
              onClick={postDetails}
              disabled ={uploading || imgUpload}
              className=" p-3 text-green-700 border border-green-800 rounded uppercase hover:shadow-lg disabled:opacity-90"
            >
              {uploading && imgUpload ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          <span
          className=" text-red-800 font-semibold text-sm">
            {imageUploadingError && imgErrorMessage}
          </span>

          {
          formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className=" flex items-center justify-between p-3 border "
              >
                <img
                  src={url}
                  alt="listing img"
                  className="w-40 h-30 object-contain rounded"
                />

                <button
                  type="button"
                  onClick={() => deleteImg(index)}
                  className=" text-red-800 p-3 rounded-lg uppercase hover:opacity-85"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            >
            { loading && uploading ? 'Creating...' : 'Create listing'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
