import React, { useState } from 'react';

export interface DragAndDropComponentProps {
    onDatadrop: (data:any) => void
}

const DragAndDropComponent: React.FC<DragAndDropComponentProps> = (props:DragAndDropComponentProps) => {
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target) {
              const result = event.target.result as string;
              try {
                const parsedJSON = JSON.parse(result);// this is the json to send to parent component
                props.onDatadrop(parsedJSON);
                // Do something with the parsed JSON, such as displaying it
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            }
          };
          reader.readAsText(file);
        }
      };
    
      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
      };
    
      return (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: '99%',
            height: '50%',
            border: '2px dashed #ccc',
            textAlign: 'center',
            marginRight: '3px'
          }}
        >
          <p>Drag and drop a JSON file here</p>
        </div>
      );
};

export default DragAndDropComponent;
