import React, {Component, useEffect, useState} from "react";
import {useMemo} from 'react';
import UploadService from "../services/upload-files.service";
import styled from "styled-components";
import {useDropzone} from 'react-dropzone';
import axios from "axios"
import http from "../http-common";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import Loading from "./loading";


const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,

  borderRadius: 20,
  borderColor: "#26C2E7",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#c4c4c4",
  outline: "none",
  transition: "border .24s ease-in-out"
};
const activeStyle = {
  borderColor: '#2196f3'
};
const acceptStyle = {
  borderColor: '#00e676'
};
const rejectStyle = {
  borderColor: '#ff1744'
};
const Styles = styled.div`
  .back-button {
    padding: 10px 15px;
    z-index: 20;
    color: #ffffff;
    font-size:48px;
    cursor: pointer;
    text-align: center;
    background-color: #0068E6;
    border-radius: 10px;
    box-shadow: 0 3px #999;
    position: absolute;
    display: block;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -50%);
  }
  
    .back-button:hover {
    background-color: #155cb3;
  }
  .back-button:active {
    background-color: #155cb3;
    box-shadow: 0 5px #666;
    // transform: translateY(.5px);
}
`

function Basic(props) {
const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone();

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);
  const uploadFiles = () => {

    for (var i = 0; i < acceptedFiles.length; i++) {
        let formData = new FormData();
        let file = acceptedFiles[i];
        console.log(file.path)
        formData.append('file', file);
        // formData.set('name',formData.get('file').path)
        // formData.set('file'[''],)
        // console.log(formData.get('file'))
        http.post("/upload",
            formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Custom-Header": file.path,
          "Study-Owner": 'Praveen'
        }}
    )
    .catch(function (error) {
      console.log(error);
    });
    }
  }

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <button onClick={uploadFiles}>Submit</button>
    </section>
  );
}
<Basic />



class UploadFiles extends Component {

  constructor(props) {
    super(props);
    this.selectFiles = this.selectFiles.bind(this);
    this.upload = this.upload.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);



    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: [],
      fileInfos: [],
    };


  }
  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }
  selectFiles(event) {
    this.setState({
      progressInfos: [],
      selectedFiles: event.target.files,
    });
  }

  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];

    UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
      this.setState({
        _progressInfos,
      });
    })
      .then(() => {
        this.setState((prev) => {
          let nextMessage = [...prev.message, "Uploaded the file successfully: " + file.name];
          return {
            message: nextMessage
          };
        })
      })
  }
  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;

    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        message: [],
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);

        }
      }
    );
  }
  render() {
    const { selectedFiles, progressInfos, message, fileInfos } = this.state;


    return (
        <Styles>
      <div>
        <Basic />
        <a href="http://localhost:3000/studies" className="back-button">Back to Studies</a>

        <div className="card">
          <div className="card-header">Wait till you see the "Upload successful" before navigating away!</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div>
      </div></Styles>
    );
  }
}

export default withAuthenticationRequired(UploadFiles, {
  onRedirecting: () => <Loading />,
});