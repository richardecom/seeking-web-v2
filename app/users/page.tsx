import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { ContentTitle } from '@/components/Shared/ContentTitle';
import { MapPin } from 'lucide-react';
import React from 'react';
import TableLayout from '@/components/Shared/TableLayout';
import UserDataTable from '../../components/User/UserDataTable';
import { LSFilterProvider } from '@/context/FilterContext';


const UserPage = () => {
  return (
    <DefaultLayout>
        <ContentTitle title="User List" icon={<MapPin />} />
        <TableLayout>
        <LSFilterProvider>
          <UserDataTable/>
        </LSFilterProvider>
        </TableLayout>
    </DefaultLayout>
  );
};

export default UserPage;
