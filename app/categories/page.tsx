/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import CategoryData from '@/components/Categories/CategoryData'
import { DefaultLayout } from '@/components/Layouts/DefaultLayout'
import ActionsToolbar from '@/components/Shared/ActionsToolbar'
import ProgressLayout from '@/components/Shared/ProgressLayout'
import TableLayout from '@/components/Shared/TableLayout'
import {ContentTitle} from '@/components/Shared/ContentTitle'
import { Progress } from '@/components/ui/progress'
import React, { useEffect, useRef, useState } from 'react'
import { Category } from '../types/category'
import { DownloadCsvFile, GetAllCategories } from '@/hooks/CategoryHook'
import { useRouter } from 'next/navigation'
import { Pagination } from '../types/pagination'
import LeftActionPanel from '@/components/Shared/LeftActionPanel'
import RightActionPanel from '@/components/Shared/RightActionPanel'
import DownloadCsv from '@/components/Shared/DownloadCsv'
import Paginator from '@/components/Shared/Paginator'
import SelectToSearch from '@/components/Shared/SelectToSearch'
import TypeToSearch from '@/components/Shared/TypeToSearch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import FormLayout from '@/components/Shared/FormLayout'
import { CSVLink } from 'react-csv'
import { getDateTime } from '@/utils/DateTime'
import { toast } from '@/hooks/use-toast'
import AddCategory from '@/components/Categories/AddCategory'
import AddButton from '@/components/Shared/AddButton'
import { Box, LayoutList } from 'lucide-react'
import { DialogDescription } from '@radix-ui/react-dialog'

const CategoryPage = () => {
    const headers = ['Category Name', 'Description', 'Type', 'Created Date', 'Status', 'Action'];
    const exportHeaders = [
        { label: "category_id", key: "category_id" },
        { label: "user_id", key: "user_id" },
        { label: "category_name", key: "category_name" },
        { label: "category_description", key: "category_description" },
        { label: "category_type", key: "category_type" },
        { label: "status", key: "status" },
        { label: "date_created", key: "date_created" },
    ];
    const selectValue = [
        { key: 1, value: "Active" },
        { key: 0, value: "Archived" },
    ]
    const fileName = `CATEGORY_DATA${getDateTime()}.csv`

    const [isLoading, setIsLoading] = useState(false);
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [exportData, setExportData] = useState<Category[]>([]);
    const [page, setDefaultPage] = useState(1);
    const [limit] = useState(20);
    const [progress, setProgress] = useState(1);
    const [searchKey, setSearchKey] = useState('');
    const [status, setStatus] = useState('');
    const [firstReload, setFirstReload] = useState(true);
    const [dialog, setDialog] = useState(false);
    const router = useRouter();
    const csvLinkRef = useRef(null);
    const [excludeIds, setExcludeIds] = useState([]);

    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        pages: 0,
        before: null,
        next: null,
    });

    const getCategoryData = async () => {
        if (firstReload) {
            setIsLoading(true);
        }
        setProgress(50);
        try {
            const params = { page, limit, searchKey, status };
            const result = await GetAllCategories(params) as any;
            if (result.status === 200) {
                setCategoryData(result.data.list);
                setPagination(result.data.pagination);
            } else if (result.status === 401) {
                router.push('/')
            }
        } catch (err) {
            console.log(err);
        } finally {
            setProgress(100)
            setFirstReload(false)
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 250);
            return () => clearTimeout(timer);
        }
    };

    const downloadCsvFile = async () => {
        if(categoryData.length > 0){
            try {
                toast({
                    className: 'success_message',
                    description: "Downloading, Please Wait.",
                })
                const params = { page: 1, limit: 1000, searchKey, status, excludeIds };
                const result = await DownloadCsvFile(params) as any;
                if (result.status === 200) {
                    if (result.data.list.length > 0) {
                        const exportData = result.data.list
                        setExportData(exportData)
                        setTimeout(() => {
                            csvLinkRef.current.link.click();
                        }, 1000);
                    } else {
                        toast({
                            className: 'error_message',
                            description: result.message,
                        })
                    }
                }else{
                    toast({
                        className: 'error_message',
                        description: 'Download failed. Something went wrong.',
                    })
                }
            } catch (error) {
                console.log('Error downloading csv file.')
            }
        }else{
            toast({
                className: 'error_message',
                description: "Please select data do be download.",
            })
        }
    };

    useEffect(() => {
    }, [excludeIds])

    useEffect(() => {
        getCategoryData();
    }, [page, limit, searchKey, status]);

    return (
        <DefaultLayout>
            <ContentTitle title="Category List" icon={<LayoutList/>}/>
            <ActionsToolbar>
                <LeftActionPanel>
                    <AddButton onClick={() => setDialog(true)} buttonName='Add Category' hidden={false}/>
                    <SelectToSearch 
                    hidden={false}
                    name='search_cat'
                    id='search_cat' 
                    value={status}
                    isDisabled={false}
                    arrObj={selectValue} 
                    onSelect={(event) => {
                        setStatus(event.target.value) 
                        setDefaultPage(1)
                    }} />
                    <TypeToSearch
                    id= 'search_cat'
                    name= 'search_cat'
                    onClick={ (query) => {
                        setSearchKey(query)
                        setDefaultPage(1)
                    }} />
                </LeftActionPanel>
                <RightActionPanel>
                    <CSVLink
                        ref={csvLinkRef}
                        data={exportData}
                        headers={exportHeaders}
                        filename={fileName}
                        className="hidden"
                        target="_blank">
                    </CSVLink>
                    <DownloadCsv onClick={downloadCsvFile} dataLength = {categoryData.length} hasChecked = {excludeIds.length === pagination.total}/>
                    <Paginator pagination={pagination} onPageChange={setDefaultPage} currentPage={page} />
                </RightActionPanel>
            </ActionsToolbar>
            <TableLayout>
                {isLoading ? (
                    <>
                        <ProgressLayout>
                            <Progress value={progress} className="h-1 w-[30%] max-w-md " />
                        </ProgressLayout>
                    </>
                ) : (<CategoryData
                    CategoryData={categoryData}
                    headers={headers}
                    onClose={() => getCategoryData()}
                    onExcludesChange={setExcludeIds} />
                )}
            </TableLayout>

            {/* Add Category Dialog /> */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="md:max-w-[700px] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <FormLayout>
                    <AddCategory onClose={() => {
                        setDialog(false);
                        getCategoryData();
                    }} />
                    </FormLayout>
                </DialogContent>
            </Dialog>

        </DefaultLayout>
    )
}

export default CategoryPage
