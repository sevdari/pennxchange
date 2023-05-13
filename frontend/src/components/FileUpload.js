/**
 * Dummy code for file upload.
 * Will be deleted later.
 */

import React, { useState, useEffect } from 'react';
import { uploadFile } from '../api/upload';

function FileUpload() {
  const [files, setFiles] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const info = document.getElementById('info');
    info.innerHTML = `${count} file(s) selected: `;
  }, [count]);

  // event handler for file selection
  const updateFile = (evt) => {
    setFiles([...evt.target.files]);
    setCount(evt.target.files.length);
  };

  // event handler for files upload
  const handleUpload = async () => {
    // create new formdata object
    const formData = new FormData();

    // Add files to the formdata object
    // to add more than one file add the
    // "multiple" prop to the input element
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`File_${i}`, files[i]);
    }
    // upload the file
    uploadFile(formData);
  };

  return (
    <div>
      <h2>File Upload Example</h2>
      <div id="info" />
      <div>
        File:
        <input
          id="upld"
          type="file"
          name="files[]"
          onChange={(e) => updateFile(e)}
          multiple="multiple"
        />
      </div>
      <button type="submit" onClick={() => handleUpload()}>
        Upload Files
      </button>
      <img src="https://pennxchange.s3.amazonaws.com/3m.png" width="100px" alt="3m" />
    </div>
  );
}
export default FileUpload;
