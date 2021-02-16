import React, { Component } from "react";
import UploadService from "../services/upload-files.service";
import styled from "styled-components";

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

export default class UploadFiles extends Component {
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
      .then((response) => {
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
    console.log(fileInfos)

    return (
        <Styles>
      <div>
        <a href="http://localhost:3000/studies" className="back-button">Back to Studies</a>
        {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <div className="row my-3">
          <div className="col-8">
            <label className="btn btn-default p-0">
              <input type="file" multiple onChange={this.selectFiles} />
              {/*<input*/}
              {/*    type="file" multiple*/}
              {/*    directory=""*/}
              {/*    webkitdirectory=""*/}
              {/*    onChange={this.selectFiles}*/}
              {/*  />*/}
            </label>
          </div>

          <div className="col-4">
            <button
              className="btn btn-success btn-sm"
              disabled={!selectedFiles}
              onClick={this.uploadFiles}
            >
              Upload
            </button>
          </div>
        </div>

        {message.length > 0 && (
          <div className="alert alert-secondary" role="alert">
            <ul>
              {message.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}

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