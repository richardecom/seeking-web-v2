/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { CategoryFormErrors } from '@/app/types/error';
import { CreateCategory } from '@/hooks/CategoryHook';
import { toast } from '@/hooks/use-toast'
import { GetAllMobileUser } from '@/hooks/UserHooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { z } from 'zod';

const AddCategory = ({ onClose }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState<CategoryFormErrors>({});
    const [searchKey, setSearchKey] = useState('');
    const [user_id, setUserId] = useState(null);
    const [catType, setCatType] = useState([])
    const router = useRouter();
    const maxLength = 100;

    const [formData, setFormData] = useState({
        user_id: 0,
        user_name: '',
        category_name: '',
        category_description: '',
        category_type: 0,
    });
    const formSchema = z.object({
        user_id: z.number().int().min(1, { message: "Required*" }),
        category_type: z.number().int().min(1, { message: "Required*" }),
        category_name: z.string().min(1, { message: "Required*" }),
        category_description: z.string().min(1, { message: "Required*" }).max(255, { message: "Description must not exceed 255 characters." }),
    });
    const isFormValid = useMemo(() => {
        return Object.keys(errors).every(key => errors[key] === undefined) &&
            formData.user_id > 0 &&
            formData.category_type > 0 &&
            formData.category_name &&
            formData.category_description;
    }, [errors, formData]);


    const searchUser = (e) => {
        const key = e.target.value
        setSearchKey(key);
        setUserId('');
        setFormData((prev) => ({ ...prev, user_name: key }));
        setFormData((prev) => ({ ...prev, user_id: 0 }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    const createCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const result = await CreateCategory(formData);
            if (result.status === 201) {
                toast({
                    className: 'success_message',
                    description: result.message,
                })
                onClose();
            } else if (result.status === 401) {
                router.push('/')
            }else{
                toast({
                    className: 'error_message',
                    description: result.message,
                })
            }
        } catch (error) {
            console.log('ERROR: createCategory function: ', error)
            toast({
                className: 'error_message',
                description: 'Error creating category data',
            })
        }
    }

    useEffect(() => {
        const fetchMobileUsers = async () => {
            if (searchKey) {
                try {
                    const data = await GetAllMobileUser({ page: 1, limit: 100, searchKey });
                    setFilteredSuggestions(data.list);
                    setShowSuggestions(user_id === '' ? data.list.length > 0 : false);
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
        const fetchCategoryTypes = async () => {
            const categories = [
                { id: 1, value: 'Food' },
                { id: 2, value: 'Gadgets' },
                { id: 3, value: 'Clothes' },
                { id: 4, value: 'Tools' },
                { id: 5, value: 'Utensils' },
                { id: 6, value: 'Hygiene' }
            ];
            setCatType(categories);
        };
        fetchCategoryTypes();
    }, []);

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
        <form className="space-y-2" onSubmit={createCategory}>
            <div className="relative w-full">
                <div className='w-full mb-5'>
                    <label htmlFor="user_name" className="flex items-center text-sm font-medium leading-4 text-gray-900">
                        <span className="mr-2">User</span>
                        {errors.user_id && (
                            <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.user_id}</p>
                        )}
                    </label>
                    <div className="mt-2 border-red-400 relative">
                        <input
                            id="user_name"
                            name="user_name"
                            type="text"
                            required
                            value={formData.user_name}
                            onChange={searchUser}
                            className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                            placeholder="Search Mobile User" />
                        {showSuggestions && (
                            <ul className="absolute z-10 w-full border border-gray-300 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => selectMUser(suggestion)} className="cursor-pointer p-2 text-sm hover:bg-blue-100">
                                        {suggestion.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-2 pb-3">
                <label htmlFor="item_name" className="flex items-center text-sm font-medium leading-4 text-gray-900">
                    <span className="mr-2">Category Type</span>
                    {errors.category_type && (
                        <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.category_type}</p>
                    )}
                </label>
                <div className='mt-2'>
                    <select
                        id="item_name"
                        name="item_name"
                        required
                        value={formData.category_type}
                        onChange={(e) => setFormData({ ...formData, category_type: parseInt(e.target.value) })}
                        className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                        <option value={0}></option>
                        {catType.map((type, index) => (
                            <option key={index} value={type.id}>{type.value}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='pb-3'>
                <label htmlFor="category_name" className="flex items-center text-sm font-medium leading-4 text-gray-900">
                    <span className="mr-2">Category Name</span>
                    {errors.category_name && (
                        <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.category_name}</p>
                    )}
                </label>
                <div className="mt-2">
                    <input id="category_name" name="category_name"
                        type="text"
                        required
                        value={formData.category_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="category_description" className="flex items-center text-sm font-medium leading-4 text-gray-900">
                    <span className="mr-2">Description</span>
                    {errors.category_description && (
                        <p className="text-red-500 text-xs font-normal  py-1 px-1">{errors.category_description}</p>
                    )}
                </label>
                <div className="mt-2">
                    <textarea
                        id="category_description"
                        name="category_description"
                        required
                        autoComplete="off"
                        rows={2}
                        maxLength={maxLength}
                        value={formData.category_description}
                        onChange={handleChange}
                        className="block w-full rounded-md border text-sm border-gray-300 p-2 shadow-sm transition duration-200 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                </div>
                <div className="mt-2 flex justify-end text-xs text-gray-600">
                    <span>{`${formData.category_description.length} / ${maxLength} characters`}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center py-3">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`flex justify-center items-center rounded-md px-4 h-9 text-xs leading-4 shadow-sm ${!isFormValid ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-[#b00202] text-white hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300'}`}>
                    Create New Item
                </button>
            </div>
        </form>
    )
}

export default AddCategory
