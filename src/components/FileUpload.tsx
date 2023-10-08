import React, { ChangeEvent, useRef, useState } from 'react';
import { uploadFlightData } from '../services/ApiService'; 


interface FileUploadProps {
    
  }


const FileUpload: React.FC<FileUploadProps> = ({ }) => {
  const [selectedFile, setSelectedFile] = useState<File | any>(null);
  const fileContentRef = useRef<string | any>(null);

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
                    const response = await uploadFlightData(content);
                    alert('Flight added successfully ✈️✔️');
                  } catch (error) {
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

  return (
    <div>
      <input type="file" accept='application/JSON' onChange={handleFileChange} />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;