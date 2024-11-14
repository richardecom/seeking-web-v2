import {User} from '@/app/types/user'
export type Location = {
    location_id: number,
    building: string,
    room: string,
    storage_location: string,
    location_description: string,
    location_image_url: string,
    status: number,
    date_created: string,
    user_id: number,
    user: User
};

