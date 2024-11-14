import React from 'react';

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div>
      <h2 className="mt-5 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default Title;
