import React, {Component, useEffect, useState} from 'react'
import  {sharedgrabbedarray}  from './studies.js'
import http from "../http-common";
import async from "async";





function FeedbackForm() {
    const search = window.location.search; // returns the URL query String
    const Params = new URLSearchParams(search);

const IdFromURL = Params.get('arr');

  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
    const [usergroup, setusergroup] = useState('')
    const [groups,setgroups]=useState('')
    let grr;

    grr=IdFromURL
    // let study_ID="Study_ID";
    // let study_Name="Study_Name"
    // let names=[]
    // let id=[]
    // for (let json in grr) {
    //
    //   id.push(json[study_ID])
    //     names.push(json[study_Name])
    //
    // }
useEffect(() => {
    fetch("/groups").then(response =>
        response.json().then(data => {
          setgroups(data);
        })
    );
  }, []);
    var groupsgrabbed=groups
    console.log("grps",groupsgrabbed)

 console.log("nnn", grr)
  const submit = e => {
      e.preventDefault()
      console.log("email", email)
      console.log("usergroup", usergroup)
      var groupdata = []
      groupdata.push(email)
      groupdata.push(usergroup)
      http.post("/email", groupdata, {
          headers: {
              "Content-Type": "application/json",
          }
      });
      if (email){
      fetch(`https://hooks.zapier.com/hooks/catch/9665392/ongbdjr/`, {
          method: 'POST',
          body: JSON.stringify({email, comment, grr}),
      })
  }
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="comment">Your question or comment</label>
      <textarea
        name="comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        />
      <br />
      <label htmlFor="email">User Email to share data with </label> <br />
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
       />
      <br />
      <label htmlFor="usergroup">User Group to share data with </label> <br />

        <input
        type="text"
        name="usergroup"
        value={usergroup}
        onChange={e => setusergroup(e.target.value)}
       />
      <br />
      <button type="submit">Send it!</button>
    </form>

  )
}
export default class share extends Component {

  render() {



    return (

      <div>
        <FeedbackForm />

        <a href="http://localhost:3000/studies" className="back-button">Back to Studies</a>
      </div>
        )
        }

}