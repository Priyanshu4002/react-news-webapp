import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import { PropTypes } from "prop-types";

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: '6',
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
 
  constructor(){
    super();
    console.log("i am a constructor")
    this.state={
      articles: [],
      loading: false,
      page:1
    }
  }

  async componentDidMount(){
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c6f03614391e4e34b83b11cda0afab9f&page=1&pageSize=${this.props.pageSize}` ;  
    this.setState({loading:true})
    let data = await fetch(url);
    let parsedData= await data.json()
    console.log(parsedData);
    this.setState({articles:parsedData.articles , 
      totalResults:parsedData.totalResults,
      loading:false
    })
  }

  previousPage= async ()=>{
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c6f03614391e4e34b83b11cda0afab9f&page= ${this.state.page-1}&pageSize=${this.props.pageSize}` ;  
    this.setState({loading:true});
    let data = await fetch(url);
    let parsedData= await data.json()
    console.log(parsedData);

    this.setState({
      page:this.state.page-1,
      articles:parsedData.articles,
      loading:false
    })
  }

  nextPage= async ()=>{  
    if(!(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize))){
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c6f03614391e4e34b83b11cda0afab9f&page= ${this.state.page+1}&pageSize=${this.props.pageSize}` ;
      this.setState({loading:true});
      let data = await fetch(url);
      let parsedData= await data.json()
      console.log(parsedData);

      this.setState({
      page:this.state.page+1,
      articles:parsedData.articles,
      loading:false
    })
    }
  }

  render()
  {
    return (
      <div className='container my-3'>
        <h2 className='text-center'>Here are some top headlines from News Monkey!</h2>
        {this.state.loading && <Spinner />}
        <div className="row my-3">
         {!this.state.loading && this.state.articles.map((element)=>{
           return <div className="col-md-4" key={element.url}>
                    <NewsItem  title={element.title?element.title.slice(0,40):" "} description={element.description?element.description.slice(0,40):" "} imageUrl={element.urlToImage} newsUrl={element.url}/>
                  </div>
         })}
         </div>
         <div className="conatiner d-flex justify-content-between my-5">
            <button disabled={this.state.page<=1} type="button" class="btn btn-dark" onClick={this.previousPage}>&laquo; Previous</button>
            <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)}  type="button" class="btn btn-dark" onClick={this.nextPage}>Next &raquo;</button>
         </div>
      </div>
    )
  }
}

export default News
