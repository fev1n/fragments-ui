// src/app.js

import { Auth, getUser } from './auth';
import {
  getUserFragments,
  getFragmentsInfo,
  getUserFragmentsData,
  postUserFragments,
  getFragmentDataById,
} from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postSection = document.querySelector('#post');
  const postBtn = document.querySelector('#postBtn');
  const getFragmentsIDsBtn = document.querySelector('#getFragmentsIDsBtn');
  const getFragmentsDataBtn = document.querySelector('#getFragmentsDataBtn');
  const getFragmentInfoByIdBtn = document.querySelector('#getFragmentInfoByIdBtn');
  const getFragmentDataByIdBtn = document.querySelector('#getFragmentDataByIdBtn');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;

    return;
  }

  // Posts a fragment for a logged in user
  postBtn.onclick = () => {
    let data = document.querySelector('#data').value;
    let type = document.querySelector('#types').value;
    postUserFragments(user, data, type);
  };

  //Gets all fragments data for the logged in user
  getFragmentsDataBtn.onclick = () => {
    getUserFragmentsData(user);
  };

  //Get all info of fragment with given ID
  getFragmentInfoByIdBtn.onclick = () => {
    let id = document.querySelector('#id').value;
    getFragmentsInfo(user, id);
  };

  getFragmentDataByIdBtn.onclick = () => {
    let id = document.querySelector('#id').value;
    getFragmentDataById(user, id);
  };

  getFragmentsIDsBtn.onclick = () => {
    getUserFragments(user);
  };

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);

  // Disable the Login button
  loginBtn.disabled = true;
  if (loginBtn.disabled == true) {
    postSection.hidden = false;
  }
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
