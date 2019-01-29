'use strict'

const apiKey = '0z9MhEaETDU5cUyjFQG9Ew0zDdkPYtJWOpHqZdQX';
const defaultUrl = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  $('#results-list').empty();
  for(let i = 0; i < responseJson.data.length; i++) {
   console.log(responseJson.data[i])
    $('#results-list').append(`<li><h3>Park Name: ${responseJson.data[i].fullName}</h3><p>Description: ${responseJson.data[i].description}</p> Website: <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></li>`)
  }

  $('#results').removeClass('hidden');
}

function getParks(queryTerm, maxResults) {
  const params = {
    api_key: apiKey,
    q: queryTerm,
    limit: maxResults,
    start: '0'
  }
  
  const queryString = formatQueryParams(params);
  const url = `${defaultUrl}?${queryString}`;

  fetch(url) 
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })  
    .then(responseJson => displayResults(responseJson))  
    .catch(err => alert(`Something went wrong: ${err.message}`));
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();

    const queryTerm = $('#query-term').val();
    const maxResults = $('#query-limit').val();

    getParks(queryTerm, maxResults);
  });
}

$(watchForm);