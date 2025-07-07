'use client';
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut, signIn } from "next-auth/react";

// TODO:

// High Priority:
// - Revise UI of the site
// - Change site font
// - Add a way for users to save generated outfits to a database
//    - Now need to figure out how to save outfits themselves
//    - We have account creation and authentication to the backend
// - Progress/Loading animation while uploading files

// Medium Priority:
// - Find a way to remove background off user uploaded pictures
// - Add outfit suggestions depending on weather -- AI

// Low Priorities:
// - Add an opening animation that presents my name and project title that has bottom and 
//   top half sliding up revealing the main page

// Potentials:
// - Schedule outfits for a travel duration?
// - Add onboarding feature?

export default function Home() {
  const { data: session, status } = useSession();
  const [shirts, inputShirts] = useState<{ file: File; url: string }[]>([]);
  const [pants, inputPants] = useState<{ file: File; url: string }[]>([]);
  const [displayedShirt, setDisplayedShirt] = useState<{ file: File; url: string } | null>(null);
  const [displayedPants, setDisplayedPants] = useState<{ file: File; url: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const addMoreShirtInputRef = useRef<HTMLInputElement>(null);
  const addMorePantsInputRef = useRef<HTMLInputElement>(null);


  // Functions to handle clothes deletion
  function removeShirt(index: number) {
    inputShirts(prev => {
      const toRemove = prev[index];
      if (toRemove) URL.revokeObjectURL(toRemove.url); // Release reference to object

      // Update array without the deleted item
      const newArr = prev.filter((_, i) => i !== index);

      // If the currently displayed item is the one to delete, replace it
      if (displayedShirt && toRemove && displayedShirt.url == displayedShirt.url) {
        setDisplayedShirt(newArr.length > 0 ? newArr[0] : null);
      }
      return newArr;
    })
  }

  function removePants(index: number) {
    inputPants(prev => {
      const toRemove = prev[index];
      if (toRemove) URL.revokeObjectURL(toRemove.url); // Release reference to object
      const newArr = prev.filter((_, i) => i !== index);
      if (displayedPants && toRemove && displayedPants.url == displayedPants.url) {
        setDisplayedPants(newArr.length > 0 ? newArr[0] : null);
      }
      return newArr;
    })
  }


  // Functions to display a random shirt/pant onClick
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


  // Functions to handle adding new clothes after initial upload onClick
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


  // Functions to display a selected shirt/pants from left-side
  function selectShirt(selectedShirt: { file: File; url: string }) {
    setDisplayedShirt(selectedShirt);
  }

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


  // Shirt/Pants Dropzone Logic
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

  // Shirt/Pants Dropzone Settings
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

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show sign-in page if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to Alphet Generator
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please sign in to continue
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => signIn("google")}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page:
  return (
    <>
      {/* Header */}
      <header className="flex flex-col items-center mb-4">
        <div className="flex items-center justify-between w-full max-w-4xl px-4">
          {/* Title */}
          <div>
            <h1>Alphet Generator</h1>
            <h2>By: Daniel Vo</h2>
          </div>

          {/* Display user's name and profile picture and sign out button */}
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
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
                              className="relative group cursor-pointer hover:scale-110 transition-all duration-200"
                            >
                              {/* Remove button */}
                              <button
                                type="button"
                                className="absolute top-1 right-1 z-10 bg-white bg-opacity-80 rounded-full px-2 py-0.5 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={e => { e.stopPropagation(); removeShirt(index); }}
                                title="Remove shirt"
                              >
                                X
                              </button>
                              <Image src={shirt.url} alt="Shirt" width={100} height={100} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <button
                      onClick={handleAddMoreShirtsClick}
                      className="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
                              className="relative group cursor-pointer hover:opacity-80 hover:scale-110 transition-all duration-200"
                            >
                              {/* Remove button */}
                              <button
                                type="button"
                                className="absolute top-1 right-1 z-10 bg-white bg-opacity-80 rounded-full px-2 py-0.5 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={e => { e.stopPropagation(); removePants(index); }}
                                title="Remove shirt"
                              >
                                X
                              </button>
                              <Image src={pants.url} alt="Pants" width={100} height={100} />
                            </div>
                          ))
                        }

                      </div>
                    </div>
                    <button
                      onClick={handleAddMorePantsClick}
                      className="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
