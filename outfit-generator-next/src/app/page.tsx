'use client';
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

// TODO:
// - Once user uploads shirts/pants, show them in the clothes container
// - Implement random button functionality
// - Implement changing shirts and pants functionality

export default function Home() {
  const [shirts, inputShirts] = useState<File[]>([]);
  const [pants, inputPants] = useState<File[]>([]);

  const onShirtDrop = useCallback((acceptedFiles: File[]) => {
    inputShirts(prev => [...prev, ...acceptedFiles]);
   }, []);

  const onPantsDrop = useCallback((acceptedFiles: File[]) => {
    inputPants(prev => [...prev, ...acceptedFiles]);
  }, []);

  // Shirt Dropzone
  const { getRootProps: getShirtRootProps, 
    getInputProps: getShirtInputProps, 
    isDragActive: isDragActiveShirt } = useDropzone({
      // Multiple allows user to upload multiple files at once
      multiple: true,
      
      // onDrop is the function that is called when the user drops a file
      onDrop: onShirtDrop,

      // File validation for only png and jpeg files
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
  });

  // Pants Dropzone
  const { getRootProps: getPantsRootProps, 
    getInputProps: getPantsInputProps, 
    isDragActive: isDragActivePants } = useDropzone({
      // Multiple allows user to upload multiple files at once
      multiple: true,

      // onDrop is the function that is called when the user drops a file
      onDrop: onPantsDrop,

      // File validation for only png and jpeg files
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
  });

    return (
    <>
      {/* Header */}
      <header className="flex flex-col items-center mb-4">
        <h1>
          Random Alphet Generator
        </h1>
        <h2>
          By: Daniel Vo
        </h2>
      </header>
      
      {/* Button Container */}
      <div className="button_container flex justify-center mb-4">
        <button id="random_button" onClick={() => {
          console.log("Random");
        }}>
        <Image src="/button.png" alt="Random" width={100} height={100} />
        </button>
      </div>

      {/* Main Container with left and right side columns*/}
      <div className="main_container flex mb-4">
        <div className="left_side w-1/2 border-2 border-red-500 flex flex-col items-center">
          {/* Clothes Upload/Selector Section */}
          <div className="clothes_selector flex flex-col gap-4">
            <label htmlFor="shirt_input" className="file-input-label">
              Upload Shirt
            </label>

            {/* Shirt Dropzone */}
            <div {...getShirtRootProps({className: "dropzone p-8 border-2 border-dashed border-blue-300 rounded-md"})}>
              <input {...getShirtInputProps()} />
              <p>Drag and drop shirt files here, or click to select files</p>
            </div>

            {/* Pants Dropzone */}
            <label htmlFor="pants_input" className="file-input-label">
              Upload Pants
            </label>
            <div {...getPantsRootProps({className: "dropzone p-8 mb-5 border-2 border-dashed border-blue-300 rounded-md"})}>
              <input {...getPantsInputProps()} />
              <p>Drag and drop pants files here, or click to select files</p>
            </div>

          </div>
        </div>

        {/* Clothes Container Section */}
        <div className="right_side w-1/2 border-2 border-blue-500 flex flex-col items-center">
          <div className="clothes_container">
            <div className="shirt_container">
              <h1>Shirt</h1>
            </div>
            <div className="pants_container">
              <h1>Pants</h1>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
