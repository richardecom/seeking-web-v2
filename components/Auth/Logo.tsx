import React from 'react'
import Image from "next/image";

const LoginLogo = () => {
  return (
    <div className='flex justify-center items-center w-full'>
        <Image
            width={74}
            height={74}
            src={"/images/user.jpg"}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
          />
    </div>
  )
}

export default LoginLogo
