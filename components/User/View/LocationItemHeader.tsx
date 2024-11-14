import React, { useState } from "react";
import Search from "@/components/User/View/Search";
import Paginator from "@/components/Shared/Paginator";
const LocationItemHeader = ({pagination}) => {

    const [searchKey, setSearchKey] = useState("");
    const [page, setDefaultPage] = useState(1);

  return (
    <div className="w-full md:flex md:justify-between px-2 py-3">
      <div className=" mb-3 md:w-[30%]">
        <span>Location list</span>
      </div>

      <div className="md:w-[70%] xl:flex xl:justify-end">
        <Search
          className="xl:p-1"
          id="search_location"
          name="search_location"
          onClick={(query) => {
            setSearchKey(query);
            setDefaultPage(1);
          }}
        />

        <div className="flex justify-center w-full md:flex md:justify-end xl:w-auto">
          <Paginator
            pagination={pagination}
            onPageChange={setDefaultPage}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationItemHeader;
