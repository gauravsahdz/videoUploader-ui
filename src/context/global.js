import React, { useEffect } from "react";

const GlobalContext = React.createContext();

//actions
const LOADING = "LOADING";
const SET_VIDEOS = "SET_VIDEOS";

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case SET_VIDEOS:
      return {
        ...state,
        loading: false,
        videos: [
          ...action.payload.map((video) => {
            console.log("video: ", video.subtitleFilename);
            return {
              ...video,
              videoUrl: `https://videouploader-api-production.up.railway.app/public/videos/${video.filename}`,
              subtitleUrl: `https://videouploader-api-production.up.railway.app/public/subtitles/${video.subtitleFilename}`,
            };
          }),
        ],
      };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const initialState = {
    videos: [],
    subtitles: [],
    loading: false,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  //get videos
  const getAllVideos = async () => {
    try {
      const res = await fetch(
        "https://videouploader-api-production.up.railway.app/api/videos"
      );
      const data = await res.json();

      dispatch({ type: SET_VIDEOS, payload: data.videos });
    } catch (error) {}
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        getAllVideos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(GlobalContext);
};
