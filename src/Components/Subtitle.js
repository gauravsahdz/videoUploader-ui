import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

function SubtitleModal({ id, setModal }) {
  const [subtitle, setSubtitle] = React.useState("");
  const [startTimestampValue, setStartTimestampValue] = useState("");
  const [endTimestampValue, setEndTimestampValue] = useState("");

  const [loading, setLoading] = React.useState(false);

  const [startTimestampUnit, setStartTimestampUnit] = useState("seconds");
  const [endTimestampUnit, setEndTimestampUnit] = useState("seconds");

  const handleTextChange = (type) => (event) => {
    if (type === "subtitle") {
      setSubtitle(event.target.value);
    }
  };

  const handleTimestampChange = (type) => (event) => {
    if (type === "start") {
      setStartTimestampValue(event.target.value);
    } else if (type === "startUnit") {
      setStartTimestampUnit(event.target.value);
    } else if (type === "endUnit") {
      setEndTimestampUnit(event.target.value);
    } else if (type === "end") {
      setEndTimestampValue(event.target.value);
    }
  };

  const formatTimestamp = (type) => {
    let formattedTimestamp = "00:00:00,000";

    if (type === "start") {
      if (startTimestampUnit === "seconds") {
        formattedTimestamp = `00:00:${startTimestampValue}.000`;
      } else if (startTimestampUnit === "minutes") {
        formattedTimestamp = `00:${startTimestampValue}:00.000`;
      } else if (startTimestampUnit === "hours") {
        formattedTimestamp = `${startTimestampValue}:00:00.000`;
      } else if (startTimestampUnit === "milliseconds") {
        formattedTimestamp = `00:00:00.${startTimestampValue}`;
      } else {
        formattedTimestamp = "00:00:00.000";
      }
    } else if (type === "end") {
      if (endTimestampUnit === "seconds") {
        formattedTimestamp = `00:00:${endTimestampValue}.000`;
      } else if (endTimestampUnit === "minutes") {
        formattedTimestamp = `00:${endTimestampValue}:00.000`;
      } else if (endTimestampUnit === "hours") {
        formattedTimestamp = `${endTimestampValue}:00:00.000`;
      } else if (endTimestampUnit === "milliseconds") {
        formattedTimestamp = `00:00:00.${endTimestampValue}`;
      } else {
        formattedTimestamp = "00:00:00.000";
      }
    }

    return formattedTimestamp;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (subtitle) {
      const data = {
        subtitle,
        timestampRange:
          formatTimestamp("start") + " --> " + formatTimestamp("end"),
      };
      const res = await fetch(
        `https://videouploader-api-production.up.railway.app/api/videos/api/videos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.status === 200) {
        alert("Please go back and come again to see the changes");
      }
    } else {
      alert("Please enter subtitle");
    }

    setLoading(false);
    setSubtitle("");
    setStartTimestampValue("");
    setEndTimestampValue("");
    setModal(false);
  };

  return (
    <UploadStyled>
      <div className="modal-header">
        <h2>Add Subtitle</h2>
        <div className="closeButton">
          <Button
            name="Close"
            icon={<i className="fas fa-times"></i>}
            bg={"#fab000"}
            onClick={() => {
              setModal(false);
            }}
          >
            X
          </Button>
        </div>
      </div>
      <form
        onSubmit={handleUpload}
        action="api/upload"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="input-control">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            id="subtitle"
            placeholder="Enter subtitle"
            value={subtitle}
            onChange={handleTextChange("subtitle")}
          />
        </div>
        {/* start time of the subtitle */}
        <div className="input-control">
          <label htmlFor="timestampValue">Start Timestamp</label>
          <div className="timestamp-div">
            <input
              type="number"
              name="startTimestampValue"
              id="startTimestampValue"
              placeholder="Start timestamp value"
              value={startTimestampValue}
              onChange={handleTimestampChange("start")}
            />

            <label htmlFor="timestampUnit" className="timestamp">
              Timestamp Unit
            </label>
            <select
              id="timestampUnit"
              name="timestampUnit"
              value={startTimestampUnit}
              onChange={handleTimestampChange("startUnit")}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="milliseconds">Milliseconds</option>
            </select>

            <div>
              <label htmlFor="formattedTimestamp">Formatted Timestamp</label>
              <input
                type="text"
                name="formattedTimestamp"
                id="formattedTimestamp"
                value={formatTimestamp("start")}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* end time of the subtitle */}
        <div className="input-control">
          <label htmlFor="timestampValue">End Timestamp</label>
          <div className="timestamp-div">
            <input
              type="number"
              name="endTimestampValue"
              id="endTimestampValue"
              placeholder="End timestamp value"
              value={endTimestampValue}
              onChange={handleTimestampChange("end")}
            />

            <label htmlFor="timestampUnit" className="timestamp">
              Timestamp Unit
            </label>
            <select
              id="timestampUnit"
              name="timestampUnit"
              value={endTimestampUnit}
              onChange={handleTimestampChange("endUnit")}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="milliseconds">Milliseconds</option>
            </select>

            <div>
              <label htmlFor="formattedTimestamp">Formatted Timestamp</label>
              <input
                type="text"
                name="formattedTimestamp"
                id="formattedTimestamp"
                value={formatTimestamp("end")}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="upload-btn">
          <Button
            name={loading ? "Submitting..." : "Submit"}
            icon={<i className="fas fa-upload"></i>}
            bg={"#fab000"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </UploadStyled>
  );
}

const UploadStyled = styled.div`
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  background: #262626;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 3px 5px 30px rgba(255, 255, 255, 0.1);
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    .closeButton {
      display: flex;
      justify-content: flex-end;
    }
  }
  h2 {
    color: #fff;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    .input-control {
      display: flex;
      flex-direction: column;
      input,
      textarea {
        padding: 0.8rem 1rem;
        border: 1px solid rgb(74 74 74);
        border-radius: 5px;
        outline: none;
        resize: none;
        background: transparent;
        color: #fff;
      }
      label {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #fff;
        opacity: 0.9;
      }
    }
    .inner-input {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed rgb(74 74 74);
      border-radius: 5px;
      padding: 1rem;
      cursor: pointer;
      height: 90px;
      position: relative;
      padding: 1rem;
      .inner-label {
        cursor: pointer;
        margin: 0;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(74 74 74);
      }
    }

    .timestamp-div {
      display: flex;
      gap: 1rem;
    }

    .note-label {
      color: #ecf;
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0.8;
      margin-top: 0.5rem;
    }

    .upload-btn {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .timestamp {
      margin: 0.5rem 0;
    }

    select {
      padding: 0.8rem 1rem;
      border: 1px solid rgb(74 74 74);
      border-radius: 5px;
      outline: none;
      resize: none;
      background: transparent;
      color: #fff;
      margin-bottom: 1rem;

      option {
        background: #262626;
      }
    }
  }
`;

export default SubtitleModal;
