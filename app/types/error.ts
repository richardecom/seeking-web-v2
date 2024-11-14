export type LocationFormErrors = {
    user_id?: string;
    building?: string;
    room?: string;
    storage_location?: string;
    location_description?: string;
}
export type ItemFormErrors = {
    user_id?: string;
    location_id?: string;
    category_id?: number;
    item_name?: string;
    description?: string;
    quantity?: number;
    rating?: number;
}

export type UserFormErrors = {
    email_address?: string;
    name?: string;
    password?: string;
    confirm_password?: string;
    address?: string;
    dob?: string;
    otp?: string;
}
export type UserEditFormErrors = {
    email_address?: string;
    new_email?: string;
    name?: string;
    password?: string;
    confirm_password?: string;
    address?: string;
    dob?: string;
    otp?: string;
}


export type CategoryFormErrors = {
    user_id?: string;
    category_name?: string;
    category_description?: string;
    category_type?: number;
}

export type LoginErrors = {
    email_address?:string
    password?:string
}