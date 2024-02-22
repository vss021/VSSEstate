import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Link} from 'react-router-dom';

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess
  
} from "../redux/user/userSlice";

const Profile = () => {

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [image, setImg] = useState("");
  const [url, setUrl] = useState("");
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const [showListingError, setShowListingError] = useState(false);
  const [showListingData, setShowListingData] = useState([]);

  const [uploadImg, setUploadImg] = useState(false);


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  

  // store img to cloudenary
  const postDetails = () => {
    // posting image to clodenary
    // console.log(body, image);

    if (image) {
      setUploadImg(true);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Instra-clone");

      data.append("cloud_name", "vijays");

      fetch("https://api.cloudinary.com/v1_1/vijays/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({ ...formData, avatar: data.url });
          setUploadImg(false); // Set upload status to true (assuming success)
      })
      .catch((err) => {
          console.log(err);
          setUploadImg(false); // Set upload status to false (assuming failure)
      });
    }
  };


  const loadFile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);

    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdatedSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");

      const data = await res.json();

      if(data.success === false){
        dispatch(signOutUserFailure(error.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };


  const handleListings = async() => {
    
    try{

      setShowListingError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();

      if(data.success === false){
        setShowListingError(false);
        return ;
      }

      console.log(data);
      setShowListingData(data);

    } catch(error){
      setShowListingError(true);

    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setShowListingData((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <div className=" max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-6 ">Profile</h1>

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        hidden
        onChange={(event) => {
          loadFile(event);
          setImg(event.target.files[0]);
        }}
      />

      <img
        src={currentUser.avatar || formData.avatar}
        onClick={() => fileRef.current.click()}
        id="output"
        className=" rounded-full mx-auto mb-3 w-24 h-24"
      />

      <button
        type="button"
        className=" bg-slate-700 text-white rounded-lg p-2 uppercase text-2xl hover:opacity-95 w-full mb-3"
        disabled={uploadImg}
        onClick={postDetails}
      >
        {uploadImg ? "Uploading..." : "Updated Pic"}
      </button>

      <form className=" flex flex-col gap-3 ">
        <input
          type="text"
          defaultValue={currentUser.username}
          id="username"
          className=" border focus:outline-none p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          id="email"
          className=" border focus:outline-none p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className=" border focus:outline-none p-3 rounded-lg"
          onChange={handleChange}
        />
      </form>
      <div className=" flex flex-col gap-3 mt-3">
        <button
          onClick={handleSubmit}
          className=" bg-slate-700 text-white rounded-lg p-2 uppercase text-2xl hover:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link to='/create-listing' className=" bg-green-700 text-white rounded-lg p-2 uppercase text-2xl text-center hover:opacity-95 ">
          Create listing
        </Link>
      </div>

      <div className=" flex justify-between mt-6">
        <span
          onClick={handleDeleteUser}
          className=" text-red-700 cursor-pointer font-semibold uppercase "
        >
          Delete account
        </span>
        <span
          onClick={handleSignout}
          className=" text-red-700 cursor-pointer font-semibold uppercase "
        >
          Sign Out
        </span>
      </div>

      <p className=" text-red-700">{error ? error : ""}</p>
      <p className=" text-green-700">
        {updatedSuccess ? "User is Updated Successfully!" : ""}
      </p>

      <button
      onClick={handleListings} 
      className=" text-gray-700 font-semibold w-full text-xl my-3">
        Show Listings
      </button>

      <p className=" text-red-700 mt-5">
        {showListingError ? 'Error showing listings!!' : ''}
      </p>

      {
        showListingData && showListingData.length > 0 && (

          <div  className='flex flex-col gap-4'>
            <h1 className=" text-center mt-7 text-2xl font-semibold">Your Listings</h1>

            {
              showListingData.map((listing)=>(

                <div  key={listing._id} className='border rounded-lg p-3 flex justify-between  gap-4 h-40'>

                  <Link to={`/listing/${listing._id}`}>

                    <img src={listing.imageUrls[0]} alt="listing img"  className='w-32 h-32 object-contain rounded'/>
                  </Link>

                  <Link
                    className='text-slate-700 font-semibold m-auto text-xl  hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                   >
                    <p>{listing.name}</p>
                </Link>

                  <div className='flex flex-col m-auto gap-4  font-semibold justify-around'>

                    <button
                     onClick={() => handleListingDelete(listing._id)}  className='text-red-700 uppercase hover:underline text-xl'>
                      Delete
                    </button>

                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 uppercase hover:underline text-xl'>Edit</button>
                    </Link>
                  </div>
                </div>
                ))
            }
          </div>
        )
      }

    </div>
  );
};

export default Profile;
