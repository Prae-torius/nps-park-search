'use strict'

const apiKey = '0z9MhEaETDU5cUyjFQG9Ew0zDdkPYtJWOpHqZdQX';
const defaultUrl = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  for(let i = 0; i < responseJson.data.length; i++) {
  $('#results-list').append(`<li><h3>Park Name: ${responseJson.data[i].fullName}</h3><h4>States: ${responseJson.data[i].states}</h4><p>Description: ${responseJson.data[i].description}</p> Website: <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></li>`)
  }
  $('#results').removeClass('hidden');
}

function displayError(queryTerm) {
  $('#error-result').append(`<p>${queryTerm} is not a state</p>`);
  $('#error-result').removeClass('hidden');
 }

 function emptyResults() {
  $('#error-result').empty();
  $('#results-list').empty();
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
    .then(responseJson => {
      if (responseJson.total === 0) {
        displayError(queryTerm);
      }
      displayResults(responseJson);
      return maxResults -= responseJson.data.length;
    })
    .catch(err => console.log(`Something went wrong: ${err.message}`));
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    emptyResults();
    const queryTerms = $('#query-term').val().replace(/,/g, '').split(' ');
    let maxResults = $('#query-limit').val();
    
    for (let i = 0; i < queryTerms.length; i++) {
      getParks(queryTerms[i], maxResults);   
    }
  });
}

$(watchForm);