import React, { useState, useEffect } from "react";
import { z } from 'zod';
import { GetAllMobileUser } from '@/hooks/UserHooks';
import { CreateLocation } from '@/hooks/LocationHooks'
import { LocationFormErrors } from "@/app/types/error";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";

const formSchema = z.object({
    user_id: z
        .number()
        .int()
        .min(1, { message: "Required*" } ),
    building: z.string().min(1, { message: "Required*" }),
    room: z.string()
    .min(1, { message: "Required*"}),
    storage_location: z.string()
    .min(1, { message: "Required*" })
    .max(200, { message: "Storage location must not exceed 200 characters." }),
    location_description: z.string()
    .min(1, { message: "Required*" })
    .max(200, { message: "Location description must not exceed 200 characters." }),
});

const AddLocation = ({onClose}) => {
  const router = useRouter();
  const { toast } = useToast()

  const [searchKey, setSearchKey] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<LocationFormErrors>({});
  const maxLength = 255;

  const [formData, setFormData] = useState({ 
    user_id: 0, 
    user_name: '',
    building: '',
    room: '',
    storage_location: '',
    location_description: '',
  });

const searchUser = (e) => {
  const key  = e.target.value
  setSearchKey(key);
  setUserId('');
  setFormData((prev) => ({ ...prev, user_name: key }));
  setFormData((prev) => ({ ...prev, user_id: 0 }));
}

const selectMUser = (value) => {
  const user_id = value.user_id;
  const user_name = value.name;
  setShowSuggestions(false);
  setSearchKey(user_name);
  setUserId(user_id);
  setFormData((prev) => ({
    ...prev,
    user_id: user_id,
    user_name: user_name,
  }));

  try {
    formSchema.pick({ user_id: true }).parse({ user_id });
    setErrors((prev) => ({ ...prev, user_id: undefined }));
  } catch (error) {
      if (error instanceof z.ZodError) {
          setErrors((prev) => ({ ...prev, user_id: error.errors[0].message }));
      }
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  const createLocation = async (event) => {
    event.preventDefault()
    try {
      const result = await CreateLocation(formData);
      
      if(result.status === 201){
        setFormData({
          user_id: 0,
          user_name: '',
          building: '',
          room: '',
          storage_location: '',
          location_description: '',
        });
        
        // onClose();
        toast({
          className: 'success_message',
          description: result.message,
        })
        onClose();
      }else if(result.status === 401){
        router.push('/')
      }
    } catch (error) {
      console.log('ERROR: createLocation function: ', error)
      toast({
        className: 'error_message',
        description: 'Error creating location data',
      })
    }
  }

  useEffect(() => {
    const fetchMobileUsers = async () => {
      if (searchKey) {
        try {
            const data = await GetAllMobileUser({ page : 1, limit : 100, searchKey });
            setFilteredSuggestions(data.list);
            setShowSuggestions(user_id ==='' ? data.list.length > 0 : false);
        } catch (error) {
          console.error('Error fetching user suggestions:', error);
        }
      } else {
        setShowSuggestions(false);
      }
    };
    const debounceFetch = setTimeout(fetchMobileUsers, 300);

    return () => clearTimeout(debounceFetch);
  }, [user_id, searchKey]);

  useEffect(() => {
    if (Object.keys(formData).length) {
        const validateField = (name, value) => {
            try {
              const pickField = { [name]: true } as Record<keyof typeof formSchema.shape, true>;
                formSchema.pick(pickField).parse({ [name]: value });
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
                }
            }
        };
        Object.keys(formData).forEach(key => validateField(key, formData[key]));
    }
}, [formData]);

  return (
    <form className="space-y-2" onSubmit={createLocation}>
        
        <div className="relative w-full">
          <div className='w-full'>
          <label htmlFor="user_name" className="flex items-center text-sm font-medium leading-4 text-gray-900">
              <span className="mr-2">User</span>
              {errors.user_id && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.user_id}</p>
              )}
          </label>
              <div className="mt-2 border-red-400">
                  <input
                      id="user_name"
                      name="user_name"
                      type="text"
                      required
                      value={formData.user_name}
                      onChange={searchUser}
                      className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      placeholder="Search User"/>
                      

                      {showSuggestions && (
                          <ul className="absolute z-10 w-full border border-gray-300 bg-white rounded-md shadow-lg">
                          {filteredSuggestions.map((suggestion, index) => (
                              <li key={ index } onClick={ () => selectMUser(suggestion) } className="cursor-pointer p-2 text-sm hover:bg-blue-100">
                              {suggestion.name}
                              </li> 
                          ))}
                          </ul>
                      )}
              </div>
          </div>
        </div>

        <div>
        
            <label htmlFor="building" className="flex items-center text-sm font-medium leading-4 text-gray-900">
              <span className="mr-2">Building</span>
              {errors.building && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.building}</p>
              )}
            </label>
            <div className="mt-2">
            <input id="building" name="building"
                type="text"
                required
                value={formData.building}
                onChange={handleChange}
                className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                placeholder="Enter building name."/>
              
            </div>
        </div>

      <div>
          <label htmlFor="room" className="flex items-center text-sm font-medium leading-4 text-gray-900">
              <span className="mr-2">Room</span>
              {errors.room && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.room}</p>
              )}
          </label>
        <div className="mt-2">  
          <input
            id="room"
            name="room"
            type="text"
            required
            value={formData.room}
            onChange={handleChange}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            placeholder="Enter room."/>
             
        </div>
      </div>

      <div>
        <label htmlFor="storage_location" className="flex items-center text-sm font-medium leading-4 text-gray-900">
              <span className="mr-2">Storage Location</span>
              {errors.storage_location && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.storage_location}</p>
              )}
          </label>
        <div className="mt-2">
          <textarea 
            id="storage_location" 
            name="storage_location"
            required
            autoComplete="off"
            rows={4}
            maxLength={maxLength}
            value={formData.storage_location}
            onChange={handleChange}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            placeholder="Enter location description."
          />
        </div>
        <div className="mt-2 flex justify-end text-xs text-gray-600">
          <span>{`${formData.storage_location.length} / ${maxLength} characters`}</span>
        </div>
      </div>

      <div>
      <label htmlFor="location_description" className="flex items-center text-sm font-medium leading-4 text-gray-900">
              <span className="mr-2">Location Description</span>
              {errors.location_description && (
                  <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.location_description}</p>
              )}
          </label>
        <div className="mt-2">
          <textarea
            id="location_description"
            name="location_description"
            required
            autoComplete="off"
            rows={4}
            maxLength={maxLength}
            value={formData.location_description}
            onChange={handleChange}
            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            placeholder="Enter storage location."
          />
        </div>
        <div className="mt-2 flex justify-end text-xs text-gray-600">
          <span>{`${formData.location_description.length} / ${maxLength} characters`}</span>
        </div>
      </div>
        <div className="flex flex-col sm:flex-row justify-center py-3">
            <button
            type="submit"
              className="flex justify-center items-center rounded-md bg-[#b00202] px-4 h-9 text-xs leading-4 text-white shadow-sm hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300">
              Create New Location
            </button>
        </div>
    </form>
  );
};

export default AddLocation;
