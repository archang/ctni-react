import React, {Component, useState} from 'react'
import  {sharedgrabbedarray}  from './studies.js'





function FeedbackForm() {
    const search = window.location.search; // returns the URL query String
    const Params = new URLSearchParams(search);

const IdFromURL = Params.get('arr');

  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
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

 console.log("nnn", grr)
  const submit = e => {
    e.preventDefault()
    fetch(`https://hooks.zapier.com/hooks/catch/9665392/ongbdjr/`, {
      method: 'POST',
      body: JSON.stringify({ email, comment,grr }),
    })
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
      <label htmlFor="email">Email (optional)</label> <br />
      <input
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
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