'use client';
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

// TODO:

// High Priority:
// - Progress/Loading animation while uploading files
// - Implement changing shirts and pants functionality
// - Change site font
// - Add a way for users to add new shirts and pants once initial upload
// - Add a way for users to save generated outfits to a database

// Medium Priority:
// - Add an opening animation that presents my name and project title that has bottom and 
//   top half sliding up revealing the main page
// - Add a way to remove shirts and pants
// - Add outfit suggestions depending on weather -- AI

// Potentials:
// - Schedule outfits for a travel duration?
// - Add onboarding feature?

export default function Home() {
  const [shirts, inputShirts] = useState<{ file: File; url: string }[]>([]);
  const [pants, inputPants] = useState<{ file: File; url: string }[]>([]);
  const [displayedShirt, setDisplayedShirt] = useState<{ file: File; url: string } | null>(null);
  const [displayedPants, setDisplayedPants] = useState<{ file: File; url: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const addMoreShirtInputRef = useRef<HTMLInputElement>(null);
  const addMorePantsInputRef = useRef<HTMLInputElement>(null);

  function randomizeShirtClick() {
    if (shirts.length > 0) {
      const shirtIndex = Math.floor(Math.random() * shirts.length);
      setDisplayedShirt(shirts[shirtIndex])
    }
  }

  function randomizePantsClick() {
    console.log('test')
    if (pants.length > 0) {
      const pantsIndex = Math.floor(Math.random() * pants.length);
      setDisplayedPants(pants[pantsIndex])
    }
  }

  function handleAddMoreShirtsClick() {
    addMoreShirtInputRef.current?.click();
  }

  function handleAddMorePantsClick() {
    addMorePantsInputRef.current?.click();
  }

  async function handleAddMoreShirtsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await onShirtDrop(files);
      e.target.value = ""; // reset so the same file can be selected again
    }
  }
  async function handleAddMorePantsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await onPantsDrop(files);
      e.target.value = ""; // reset so the same file can be selected again
    }
  }

  // Display the selected shirt
  function selectShirt(selectedShirt: { file: File; url: string }) {
    setDisplayedShirt(selectedShirt);
  }

  // Display the selected pants
  function selectPants(selectedPants: { file: File; url: string }) {
    setDisplayedPants(selectedPants);
  }

  // Function to trigger alert of a successful upload
  function triggerAlert() {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000)
  }

  // Function to generate random outfits
  const randomizeOutfit = useCallback(() => {
    if (shirts.length > 0 && pants.length > 0) {
      const shirtIndex = Math.floor(Math.random() * shirts.length);
      const pantsIndex = Math.floor(Math.random() * pants.length);
      setDisplayedShirt(shirts[shirtIndex]);
      setDisplayedPants(pants[pantsIndex]);
    }
  }, [shirts, pants]);

  // When shirts and pants have been uploaded, post a randomly generated outfit on clothes container
  useEffect(() => {
    if (shirts.length > 0 && pants.length > 0) {
      randomizeOutfit();
    }
  }, [shirts, pants, randomizeOutfit]);

  // Shirt Dropzone Logic
  const onShirtDrop = useCallback(async (acceptedFiles: File[]) => {
    // Compress images using browser-image-compression library on upload
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    // Keep track of the files and their URLs so we don't redisplay images when user refreshes page
    // Create files and their URLs and put into inputPants array
    const filesWithURLs = await Promise.all(
      acceptedFiles.map(async (file) => {
        const compressedFile = await imageCompression(file, options);
        return {
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
        };
      })
    );
    inputShirts(prev => [...prev, ...filesWithURLs]);

    // Triggers popup alert of successful upload
    triggerAlert()
  }, []);

  // Pants Dropzone Logic
  const onPantsDrop = useCallback(async (acceptedFiles: File[]) => {
    // Compress images using browser-image-compression library on upload
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    // Create files and their URLs and put into inputPants array
    const filesWithURLs = await Promise.all(
      acceptedFiles.map(async (file) => {
        const compressedFile = await imageCompression(file, options);
        return {
          file: compressedFile,
          url: URL.createObjectURL(compressedFile),
        };
      })
    );
    inputPants(prev => [...prev, ...filesWithURLs]);

    // Triggers popup alert of successful upload
    triggerAlert()
  }, []);

  // Shirt Dropzone Settings
  const { getRootProps: getShirtRootProps,
    getInputProps: getShirtInputProps
  } = useDropzone({
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
    getInputProps: getPantsInputProps
  } = useDropzone({
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
          Alphet Generator
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

      {/* Successful Upload Alert Box*/}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-center py-4 lg:px-4 fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex inline-flex" role="alert">
              <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
              <span className="font-semibold mr-2 text-left flex-auto">Upload successful!</span>
              <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      <div className="grid grid-cols-3 gap-4 place-items-center">
                        {
                          shirts.map((shirt, index) => (
                            <div
                              key={index}
                              onClick={() => selectShirt(shirt)}
                              className="cursor-pointer hover:scale-110 transition-all duration-200"
                            >
                              <Image src={shirt.url} alt="Shirt" width={100} height={100} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <button
                      onClick={handleAddMoreShirtsClick}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add More Shirts
                    </button>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg"
                      ref={addMoreShirtInputRef}
                      style={{ display: "none" }}
                      onChange={handleAddMoreShirtsChange}
                    />
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
                      <div className="grid grid-cols-3 gap-4 place-items-center">
                        {
                          pants.map((pants, index) => (
                            <div
                              key={index}
                              onClick={() => selectPants(pants)}
                              className="cursor-pointer hover:opacity-80 hover:scale-110 transition-all duration-200"
                            >
                              <Image src={pants.url} alt="Pants" width={100} height={100} />
                            </div>
                          ))
                        }

                      </div>
                    </div>
                    <button
                      onClick={handleAddMorePantsClick}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add More Pants
                    </button>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg"
                      ref={addMorePantsInputRef}
                      style={{ display: "none" }}
                      onChange={handleAddMorePantsChange}
                    />
                  </>
                )
              }
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right_side w-1/2 border-2 border-blue-500 flex flex-col items-center justify-center">

          {/* Clothes Display Section */}
          <div className="clothes_container">
            {displayedPants && displayedShirt ? (
              <>
                <div className="shirt_container">
                  {displayedShirt ? (
                    <Image 
                      src={displayedShirt.url} 
                      alt="Randomly Selected Shirt" 
                      width={200} 
                      height={200} 
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={randomizeShirtClick}
                      title="Click to randomize shirt"
                      />
                  ) : (
                    <h1>Shirt</h1>
                  )}
                </div>
                <div className="pants_container">
                  {displayedPants ? (
                    <Image src={displayedPants.url} 
                      alt="Randomly Selected Pants" 
                      width={200} 
                      height={200}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={randomizePantsClick}
                      title="Click to randomize pants"
                      />
                  ) : (
                    <h1>Pants</h1>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center items-center">
                  <h1>Upload your shirts and pants to have them appear here</h1>
                </div>
              </>

            )}
          </div>
        </div>

      </div>
    </>
  );
}
