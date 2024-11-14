import React from 'react'
interface DescriptionProps {
  description: string;
  className:string;
}
const Description: React.FC<DescriptionProps> = ({ description, className }) => {
  return (
    <div className='text-center text-sm mt-2'>
      <span className={className}>{description}</span>
    </div>
  );
};
export default Description;
