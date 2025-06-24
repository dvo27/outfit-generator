'use client';
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

// TODO:
// - Display a random outfit after user uploads both shirts and pants
// - Implement random button functionality
// - Implement changing shirts and pants functionality
// - Add a way to remove shirts and pants
// - Add a way for users to select a shirt and pants from the list of uploaded files
// - Add a way for users to save generated outfits to a database
// - Change site font

export default function Home() {
  const [shirts, inputShirts] = useState<{ file: File; url: string }[]>([]);
  const [pants, inputPants] = useState<{ file: File; url: string }[]>([]);
  const [displayedShirt, setDisplayedShirt] = useState<{ file: File; url: string } | null>(null);
  const [displayedPants, setDisplayedPants] = useState<{ file: File; url: string } | null>(null);

  function randomizeOutfit() {
    // Check if shirts and pants were uploaded
    if (shirts.length > 0 && pants.length > 0) {
      // Randomly pick an index from shirts/pants array
      const shirtIndex = Math.floor(Math.random() * shirts.length);
      const pantsIndex = Math.floor(Math.random() * pants.length);

      // Call setDisplayedShirt and setDisplayedPants
      setDisplayedShirt(shirts[shirtIndex]);
      setDisplayedPants(pants[pantsIndex]);
    }
  }

  useEffect(() => {
    if (shirts.length > 0 && pants.length > 0) {
      console.log("shirts and pants both uploaded")
      randomizeOutfit();
    }
  }, [shirts, pants]);


  // Shirt Dropzone Logic
  const onShirtDrop = useCallback((acceptedFiles: File[]) => {
    // Keep track of the files and their URLs so we don't redisplay images when user refreshes page
    const filesWithURLs = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    inputShirts(prev => [...prev, ...filesWithURLs]);
  }, []);

  // Pants Dropzone Logic
  const onPantsDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithURLs = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    inputPants(prev => [...prev, ...filesWithURLs]);
  }, []);

  // Shirt Dropzone Settings
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

  // Pants Dropzone Settings
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
        <button id="random_button" onClick={randomizeOutfit}>
          <Image src="/button.png" alt="Random" width={100} height={100} />
        </button>
      </div>

      {/* Main Container with left and right side columns*/}
      <div className="main_container flex mb-4">

        {/* Left Side */}
        <div className="left_side w-1/2 border-2 border-red-500 flex flex-col items-center text-center">

          {/* Clothes Upload/Selector Section */}
          <div className="clothes_selector flex flex-col gap-4 w-full px-4">
            <div className="shirt_selector">
              {/* Shirt Dropzone */}

              {  // If no shirts have been uploaded, show dropzone
                shirts.length === 0 ? (
                  <>
                    <label htmlFor="shirt_input" className="file-input-label">
                      Upload Shirt
                    </label>
                    <div {...getShirtRootProps({ className: "dropzone p-8 border-2 border-dashed border-blue-300 rounded-md" })}>
                      <input {...getShirtInputProps()} />
                      <p>Drag and drop shirt files here, or click to select files</p>
                    </div>
                  </>

                ) : (  // If shirts have been uploaded, show their previews:
                  <>
                    <label htmlFor="shirt_input" className="file-input-label">
                      Select Shirt
                    </label>
                    <div className="h-72 w-full overflow-y-auto">
                      {/* Grid of shirts */}
                      <div className="grid grid-cols-3 gap-4">
                        {
                          shirts.map((shirt, index) => (
                            <div key={index}>
                              <Image src={shirt.url} alt="Shirt" width={100} height={100} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </>
                )
              }
            </div>
            <div className="pants_selector">
              {/* Pants Dropzone */}
              {
                // If no pants have been uploaded, show dropzone
                pants.length === 0 ? (
                  <>
                    <label htmlFor="pants_input" className="file-input-label">
                      Upload Pants
                    </label>
                    <div {...getPantsRootProps({ className: "dropzone p-8 mb-5 border-2 border-dashed border-blue-300 rounded-md" })}>
                      <input {...getPantsInputProps()} />
                      <p>Drag and drop pants files here, or click to select files</p>
                    </div>
                  </>
                ) : (
                  // If pants have been uploaded, show their previews:
                  <>
                    {/* Pants Selector */}
                    <label htmlFor="pants_input" className="file-input-label">
                      Select Pants
                    </label>
                    <div className="h-72 w-full overflow-y-auto">
                      {/* Grid of pants */}
                      <div className="grid grid-cols-3 gap-4">
                        {
                          pants.map((pants, index) => (
                            <div key={index}>
                              <Image src={pants.url} alt="Pants" width={100} height={100} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>

        {/* Clothes Container Section */}
        <div className="right_side w-1/2 border-2 border-blue-500 flex flex-col items-center">
          <div className="clothes_container">
            <div className="shirt_container">
              {displayedShirt ? (
                <Image src={displayedShirt.url} alt="Random Shirt" width={200} height={200} />
              ) : (
                <h1>Shirt</h1>
              )}
            </div>
            <div className="pants_container">
              {displayedPants ? (
                <Image src={displayedPants.url} alt="Random Pants" width={200} height={200} />
              ) : (
                <h1>Pants</h1>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
