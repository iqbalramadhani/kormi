import React, { useEffect, useState } from "react";
import CardTableNews from './Components/CardTableNews'
import Services from '../services'

export function NewsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [filter, setFilter] = React.useState({});
    const [sort, setSort] = React.useState({});
  
    const [totalData, setTotalData] = useState(0);
    const [data, setData] = React.useState([]);
  
    const getData = async () => {
        let response = await Services.News.browse()
        console.log(response)
        setData([]);
        setTotalData(0);
    };
  
    useEffect(() => {
      getData()
    }, [
      page, rowsPerPage, filter, sort
    ]);
    return (
        <div>
            <CardTableNews />
        </div>
    )
}
