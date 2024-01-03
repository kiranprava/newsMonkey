import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [apiLimitReached, setApiLimitReached] = useState(false);
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        try{
            const url="https://1c316fb8-bdaf-4380-bd1e-9749497aec61.mock.pstmn.io/apiCalling"
            // const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
            setLoading(true)
            let data = await fetch(url);
            props.setProgress(30);
            let parsedData = await data.json()
            props.setProgress(70);
            setArticles(parsedData.articles)
            setTotalResults(parsedData.totalResults)
            console.log("hii")
        }
        catch (error) {
              console.log(error)
            
            if (error.response && error.response.status === 429) {
              // API limit reached
              setApiLimitReached(true);
              toast.error('API limit reached. Please try again later.');
              console.log("we are in if")
            } else {
              // Handle other errors
              setApiLimitReached(true);
              toast.error('API limit reached. Please try again later.');
              toast.error('An error occurred. Please try again later.');
              console.log("we are in else")
            //   console.log(error.response)
            //   console.log(error.response.status)
            }

          }
        finally{
            setLoading(false)
            props.setProgress(100);
        }  
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews(); 
        // eslint-disable-next-line 
    }, [])
 

    // const handlePrevClick = async () => {
    //     setPage(page-1)
    //     updateNews();
    // }

    // const handleNextClick = async () => { 
    //     setPage(page+1)
    //     updateNews()
    // }

    const fetchMoreData = async () => {    
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        if(apiLimitReached){
            toast.error('API limit reached..')
        }
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop:'90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>

            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News