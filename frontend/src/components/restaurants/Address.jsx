import React from 'react'
import { addAddress, deleteAddress, editAddress, fetchAddresses } from '../../store/address'
import { useSelector } from 'react-redux'
import { editProfile } from '../../../../backend/controllers/auth/auth-controller'



const Address = () => {
    const {id}=useSelector((state) => state.auth.user);
    console.log(id);
  return (
    <div>

      
    </div>
  )
}

export default Address
