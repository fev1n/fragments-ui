// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    console.log(apiUrl);
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data with just Ids', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getFragmentDataById(user, id) {
  try {
    if (id != '') {
      console.log(`Requesting user fragment data by ID...`);
      console.log(`Fetching ${apiUrl}/v1/fragments/${id}`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        // Generate headers with the proper Authorization bearer token to pass
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const header = res.headers.get('content-type');

      if (header.includes('text')) {
        const data = await res.text();
        console.log('Got user fragments data for given id', { data });
        document.getElementById('receivedData').innerHTML = data;
      }
      if (header.includes('json')) {
        const data = await res.json();
        console.log('Got user fragments data for given id', { data });
      }
    } else {
      document.getElementById('receivedData').textContent = 'ID cannot be empty';
      console.log('id required');
    }
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}

export async function getFragmentsInfo(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    var data = await res.json();
    console.log('Got user fragments data for given id using', { data });
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${id}/info`, { err });
  }
}

export async function postUserFragments(user, data, type) {
  try {
    if (type == 'application/json') {
      data = JSON.parse(JSON.stringify(data)).trim();
    }
    const res = await fetch(`${apiUrl}/v1/fragments/`, {
      // Generate headers with the proper Authorization bearer token to pass
      method: 'post',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': type,
      },
      body: data,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log('Posted user fragments data', { data });
    console.log(res);
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
  }
}

export async function getUserFragmentsData(user) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments all the data', { data });
  } catch (err) {
    console.log('Unable to call GET /v1/fragments/?expand=1', { err });
  }
}
