import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { ContentTitle } from '@/components/Shared/ContentTitle';
import { MapPin } from 'lucide-react';
import React from 'react';
import TableLayout from '@/components/Shared/TableLayout';
import LocationDataTable from '../../components/Location/LocationDataTable';


const Page = () => {
  return (
    <DefaultLayout>
        <ContentTitle title="Location List" icon={<MapPin />} />
        <TableLayout>
            <LocationDataTable/>
        </TableLayout>
    </DefaultLayout>
  );
};

export default Page;
