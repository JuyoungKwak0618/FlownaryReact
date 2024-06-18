import { useQuery } from "@tanstack/react-query";
import { getBoardList } from "./axiosGet";

export function useGetBoardList(count = 1, field='title', field2 = '', field3 = '', query = '', type = 1) {
    const querydata = useQuery({
        queryKey: ['board', count, field, field2, field3, query, type],
        queryFn: () => getBoardList(count, field, field2, field3, query, type),
        placeholderData: (previousData) => previousData,
    })

    return [querydata.data, querydata.isLoading, querydata.isError];
}