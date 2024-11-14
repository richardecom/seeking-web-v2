import React from 'react'

const Footer = ({title, link}) => {
  return (
    <>
    <p className="mt-6 text-center text-sm text-gray-600">
      <a href={link}  className="font-normal hover:text-indigo-800 hover:underline">
        {title}
      </a>
    </p></>
  )
}

export default Footer
