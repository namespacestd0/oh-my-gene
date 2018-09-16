import React, { Component } from 'react';
import {
  ReactiveBase,
  DataSearch,
  MultiList,
  ResultList
} from "@appbaseio/reactivesearch";
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import './Search.css';

class Search extends Component {

  render() {
    return (
      <ReactiveBase
        app="genes"
        url="https://search-elastic-gene-o3guxvznstg6agn7uqas6xcmru.us-west-1.es.amazonaws.com/"
      >
        <h2 className="text-center" style={{marginBottom: '20px', fontWeight: 'normal'}}>Publicly Indexed Genes</h2>
        <div className="row">
          <div className="col-sm-3">
            <MultiList
              componentId="user-list"
              dataField="user.keyword"
              sortBy="asc"
              selectAllLabel="All Users"
              showCount={true}
              placeholder="Filter by User"
              react={{
                and: [
                  "mainSearch",
                ]
              }}
              innerClass={{
                label: "list-item",
                input: "form-control",
              }}
              filterLabel="User"
            />
          </div>
          <div className="col-sm-9">
            <DataSearch
              componentId="mainSearch"
              dataField={["summary","name.keyword"]}
              debounce={100}
              innerClass={{
                input: "form-control",
                list: "search-list"
              }}
              placeholder="Search for genes..."
            />
            <ResultList
              componentId="results"
              dataField="_score"
              sortBy="desc"
              size={8}
              loader={<p className="loading">Loading Results..</p>}
              react={{
                and: ["mainSearch", "user-list"]
              }}
              onData={function (res) {
                return {
                  image: 'gene.png',
                  description: (
                    <div>
                      <h4>{res._id + ' ' + res.name}</h4>
                      <p>{res.summary}</p>
                    </div>
                  ),
                  url: "view/"+res._id,
                  containerProps: {
                  }
                }
              }}
            />
          </div>
        </div>
      </ReactiveBase >
    );
  }
}

// Search.propTypes = {
// };

export default Search;