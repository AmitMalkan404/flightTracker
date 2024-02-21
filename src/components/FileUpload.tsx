import React, { ChangeEvent, useRef, useState } from 'react';
import { uploadFlightData } from '../services/ApiService'; 
import { saveAllFlights } from '../flightsUtils';
import DragAndDropComponent from './DragAndDrop';
import './fileUpload.scss'
import { eventBus } from '../hooks/services';

export interface FileUploadProps {
  }


const FileUpload: React.FC<FileUploadProps> = (props:FileUploadProps ) => {
  const [selectedFile, setSelectedFile] = useState<File | any>(null);
  const fileContentRef = useRef<string | any>(null);
  const inputFileRef = useRef<any>(null);


  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.type === 'application/json') {
            
        setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onload = async (event) =>{
                try {
                    const content = JSON.parse(event.target?.result as string);
                    fileContentRef.current = content;
                    uploadFlightDataToDB(content)
                  } catch (error: any) {
                    if (error instanceof SyntaxError){
                        console.error('Error parsing JSON:', error);
                        alert('Error parsing JSON ❌ \n Please verify the data again');
                    }
                    if (error.code === "ERR_NETWORK") {
                        console.error('Server Error', error);
                        alert('Internal Error 😞\n Please try again later');
                    }
                    fileContentRef.current = null;
                    setSelectedFile(null);
                    clearFileInput();
                  }
            };
            fileReader.readAsText(file);
        } else {
            setSelectedFile(null);
            fileContentRef.current = null;
            alert('Please select a JSON file.');
        }
    }
  };

  const uploadFlightDataToDB = async (dataContent:any) => {
    const response = await uploadFlightData(dataContent);
    alert('Flight added successfully ✈️✔️');
    saveAllFlights().then(() => {
      eventBus.publish("public.table.newFlightAdded",null);
      clearFileInput();
    });
  }

  const clearFileInput = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
      inputFileRef.current.type = "text";
      inputFileRef.current.type = "file";
    }
  }

  const handleDataDrop = (data:any) => {
    uploadFlightDataToDB(data)
  }

  return (
    <div className='upload-file-container'>
      <input className='input-file' type="file" accept='application/JSON' onChange={handleFileChange} ref={inputFileRef} />
      <DragAndDropComponent onDatadrop={handleDataDrop}/>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;